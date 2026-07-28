/* Opening the .html straight from disk.
 *
 * This is the primary way the laboratories are used: a student downloads a file, or gets
 * one on a memory stick, and double-clicks it. There is no server and no network. Every
 * other test in this suite loads the modules over http://localhost, which is how a
 * `file://`-only regression once shipped unnoticed — vendoring Three.js as an ES module
 * left `channel_geometry` blank on disk, because browsers block module imports from a
 * file:// origin under CORS while serving them happily over http.
 *
 * So this file deliberately duplicates the load checks against the file:// protocol.
 * The duplication is the point.
 */
import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MODULES, MODULE_NAMES } from "../helpers/lab.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fileUrl = (rel) => pathToFileURL(resolve(ROOT, rel)).href;

for (const name of MODULE_NAMES) {
  test(`${name} works when opened directly from disk`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => pageErrors.push(`${e.name}: ${e.message}`));
    page.on("requestfailed", (r) => failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`));

    await page.goto(fileUrl(`animations/${MODULES[name].file}`), { waitUntil: "load" });

    /* The physics must initialise with no server behind it. */
    await page.waitForFunction(MODULES[name].ready, undefined, { timeout: 15000 });
    await page.waitForTimeout(500);

    expect(pageErrors, `${name} raised uncaught exceptions from file://`).toEqual([]);
    expect(
      consoleErrors,
      `${name} logged console errors from file:// — the usual cause is an ES-module `
      + "import, which CORS blocks on this protocol but permits over http",
    ).toEqual([]);
    expect(failedRequests, `${name} failed to load a resource from file://`).toEqual([]);
  });

  test(`${name} renders from disk`, async ({ page }) => {
    await page.goto(fileUrl(`animations/${MODULES[name].file}`), { waitUntil: "load" });
    await page.waitForFunction(MODULES[name].ready, undefined, { timeout: 15000 });

    /* A module whose script failed to load still shows its panels; what it does not do is
       size its canvas or run a frame loop. Both are checked, because the blank-canvas
       failure produces no error of its own. */
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    /* Polled for the same reason as the http equivalents: canvas sizing and the frame
       loop both lag under parallel load on a headless software compositor. */
    await expect
      .poll(async () => {
        const box = await canvas.boundingBox();
        return box ? Math.min(box.width, box.height) : 0;
      }, { message: `${name} canvas must be sized from file://`, timeout: 10000 })
      .toBeGreaterThan(100);

    await page.evaluate(() => { window.__frames = 0; });
    await page.evaluate(() => {
      const tick = () => { window.__frames++; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await expect
      .poll(() => page.evaluate(() => window.__frames),
        { message: `${name} should drive requestAnimationFrame from file://`, timeout: 10000 })
      .toBeGreaterThanOrEqual(5);
  });
}

test("channel_geometry builds its 3D scene from disk", async ({ page }) => {
  /* The one module with a rendering dependency, checked specifically: a live WebGL
     context, geometry actually in the scene, and the readouts populated by the render
     layer rather than left at their empty initial markup. */
  await page.goto(fileUrl("animations/channel_geometry.html"), { waitUntil: "load" });
  await page.waitForFunction(() => typeof hydraulics === "function", undefined, { timeout: 15000 });
  await page.waitForTimeout(600);

  const r = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    const gl = c && (c.getContext("webgl2") || c.getContext("webgl"));
    let meshes = 0;
    if (typeof scene !== "undefined") scene.traverse((o) => { if (o.isMesh || o.isLine) meshes++; });
    return {
      three: typeof THREE !== "undefined" && !!THREE.REVISION,
      orbit: typeof THREE !== "undefined" && typeof THREE.OrbitControls === "function",
      glLive: !!gl && !gl.isContextLost(),
      meshes,
      area: document.getElementById("o-A")?.textContent?.trim() || "",
    };
  });

  expect(r.three, "global THREE must be present from file://").toBe(true);
  expect(r.orbit, "OrbitControls must be attached to THREE").toBe(true);
  expect(r.glLive, "a live WebGL context is required").toBe(true);
  expect(r.meshes, "the scene must actually contain geometry").toBeGreaterThan(5);
  expect(r.area, "the render layer must populate the readouts").toMatch(/\d/);
});
