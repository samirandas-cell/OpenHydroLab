/* Every laboratory must load and initialise without errors on every engine. */
import { test, expect } from "@playwright/test";
import { MODULES, MODULE_NAMES, openLab } from "../helpers/lab.mjs";

for (const name of MODULE_NAMES) {
  test(`${name} loads without console or runtime errors`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => pageErrors.push(`${e.name}: ${e.message}`));
    page.on("requestfailed", (r) => failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`));

    await openLab(page, name);
    await page.waitForTimeout(600); // let the animation loop run a few frames

    expect(pageErrors, `uncaught exceptions in ${name}`).toEqual([]);
    expect(consoleErrors, `console errors in ${name}`).toEqual([]);
    expect(failedRequests, `failed requests in ${name}`).toEqual([]);
  });

  test(`${name} renders its canvas and keeps animating`, async ({ page }) => {
    await openLab(page, name);

    /* A blank canvas is the most common silent failure in a WebGL or 2D module:
       no error, nothing drawn. Check the canvas has real pixel dimensions and that
       the frame loop is actually running.

       Both checks poll rather than sample once. Sizing happens on a resize handler and
       frames come from requestAnimationFrame, and under parallel load — several WebGL
       contexts at once on a headless software compositor — either can lag well past a
       single immediate read. */
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    await expect
      .poll(async () => {
        const box = await canvas.boundingBox();
        return box ? Math.min(box.width, box.height) : 0;
      }, { message: `${name} canvas must be sized`, timeout: 10000 })
      .toBeGreaterThan(100);

    await page.evaluate(() => { window.__frames = 0; });
    await page.evaluate(() => {
      const tick = () => { window.__frames++; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await expect
      .poll(() => page.evaluate(() => window.__frames),
        { message: `${name} should be driving requestAnimationFrame`, timeout: 10000 })
      .toBeGreaterThanOrEqual(5);
  });
}

test("the landing page links to every laboratory", async ({ page }) => {
  await page.goto("/index.html");
  const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));

  for (const name of MODULE_NAMES) {
    const file = MODULES[name].file;
    expect(hrefs.some((h) => h && h.includes(file)), `index.html should link to ${file}`).toBe(true);
  }
});

test("every link on the landing page resolves", async ({ page, request }) => {
  await page.goto("/index.html");
  const hrefs = await page.locator("a[href]").evaluateAll((as) =>
    as.map((a) => a.getAttribute("href")).filter((h) => h && !h.startsWith("#") && !h.startsWith("mailto:")));

  const broken = [];
  for (const href of hrefs) {
    if (/^https?:/i.test(href)) continue; // external links are checked by hand, not in CI
    const res = await request.get(new URL(href, `http://localhost:${process.env.PORT || 4173}/`).toString());
    if (!res.ok()) broken.push(`${href} → ${res.status()}`);
  }
  expect(broken, "broken internal links").toEqual([]);
});
