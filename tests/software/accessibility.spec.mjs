/* Accessibility and portability.

   The claims being tested are the ones the manuscript can then make: every control
   has a name a screen reader can announce, the laboratories can be driven from the
   keyboard alone, and the layout does not break at the viewport sizes a lecture
   theatre projector or a student laptop actually uses. */
import { test, expect } from "@playwright/test";
import { MODULE_NAMES, openLab } from "../helpers/lab.mjs";

/* These are the only tests that drive real keyboard input against a live canvas, which
   makes them the ones exposed to headless-graphics flakiness — Firefox's software
   compositor intermittently drops its framebuffer when several WebGL pages run in
   parallel. Retries are allowed here and nowhere else: the physics suite runs at zero
   retries, because there a retry would hide a genuine numerical failure. */
test.describe.configure({ retries: 2 });

/**
 * Wait until the module has finished its first frames before driving the keyboard.
 * Building a 3D scene blocks the main thread long enough that queued key presses can be
 * swallowed, which makes keyboard tests flaky under parallel load — and a flaky test in
 * a validation suite is worse than no test at all.
 */
async function settle(page) {
  await page.evaluate(() => new Promise((r) => {
    requestAnimationFrame(() => requestAnimationFrame(() => r()));
  }));
  await page.waitForTimeout(150);
}

/** Approximate the accessible name computation for the control types used here. */
const NAME_PROBE = () => {
  const named = [];
  const unnamed = [];
  const sel = "button, input, select, textarea, a[href], [role='button'], [tabindex]:not([tabindex='-1'])";
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest("[aria-hidden='true']")) continue;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    let name = el.getAttribute("aria-label")?.trim() || "";
    if (!name && el.getAttribute("aria-labelledby")) {
      name = el.getAttribute("aria-labelledby").split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() || "")
        .join(" ").trim();
    }
    if (!name && el.id) {
      name = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent?.trim() || "";
    }
    if (!name) name = el.closest("label")?.textContent?.trim() || "";
    if (!name) name = (el.textContent || "").trim();
    if (!name) name = el.getAttribute("title")?.trim() || "";

    const id = el.id || el.getAttribute("class") || el.tagName.toLowerCase();
    (name ? named : unnamed).push(`${el.tagName.toLowerCase()}#${id}`);
  }
  return { named, unnamed };
};

for (const name of MODULE_NAMES) {
  test(`${name} — every interactive control has an accessible name`, async ({ page }) => {
    await openLab(page, name);
    const { named, unnamed } = await page.evaluate(NAME_PROBE);

    expect(named.length, `${name} should expose interactive controls`).toBeGreaterThan(0);
    expect(unnamed, `controls in ${name} with no accessible name`).toEqual([]);
  });

  test(`${name} — sliders are operable from the keyboard`, async ({ page }) => {
    await openLab(page, name);
    await settle(page);

    const sliders = page.locator("input[type='range']");
    const count = await sliders.count();
    if (count === 0) {
      test.skip(true, `${name} has no range inputs`);
      return;
    }

    /* Focus the first slider, nudge it with the arrow keys, and require both the
       control value and the on-screen readout to respond. A slider that only moves
       under the mouse locks out keyboard and switch users. */
    const slider = sliders.first();
    await slider.focus();
    const before = await slider.inputValue();

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(80);
    let after = await slider.inputValue();

    if (after === before) {           // already at the maximum
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(80);
      after = await slider.inputValue();
    }

    expect(after, `${name}: arrow keys must change the slider value`).not.toBe(before);
  });

  test(`${name} — focus order reaches the controls by Tab alone`, async ({ page }) => {
    await openLab(page, name);
    await settle(page);

    const reached = new Set();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab", { delay: 15 });
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return `${el.tagName.toLowerCase()}#${el.id || ""}`;
      });
      if (tag) reached.add(tag);
    }

    expect(reached.size, `${name}: tabbing should reach several controls`).toBeGreaterThan(2);
  });

  test(`${name} — layout does not overflow horizontally`, async ({ page }) => {
    await openLab(page, name);

    /* 1920×1080 projector, 1366×768 laptop, 1024×768 lab machine. */
    for (const [w, h] of [[1920, 1080], [1366, 768], [1024, 768]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(250);

      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        return d.scrollWidth - d.clientWidth;
      });
      expect(overflow, `${name} overflows horizontally at ${w}×${h}`).toBeLessThanOrEqual(2);
    }
  });
}

test("documentation guides exist for every laboratory", async ({ request }) => {
  /* Instructor adoption depends on the written guide, not just the animation. */
  const missing = [];
  for (const name of MODULE_NAMES) {
    const res = await request.get(`/docs/${name}_guide.md`);
    if (!res.ok()) missing.push(`docs/${name}_guide.md`);
  }
  expect(missing, "laboratories without a written guide").toEqual([]);
});
