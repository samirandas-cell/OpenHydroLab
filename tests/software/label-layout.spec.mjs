/* Label legibility in the 3D laboratory.
 *
 * channel_geometry annotates its scene with sprite labels (T, y, b, m, P, S₀, …). Those
 * sprites are sized in world units, so they keep a constant pixel size while the section
 * they annotate grows or shrinks by two orders of magnitude across the sliders. Offsets
 * that look right at one geometry therefore collapse into each other at another, and the
 * failure is silent: nothing errors, the scene renders, a label is simply unreadable
 * underneath another one. A shipped build had the side-slope label m completely buried
 * beneath the reach-scale S₀ annotation.
 *
 * Nothing else in this suite can catch that — it is a purely visual property. So the
 * labels are projected to screen space here and checked for overlap directly, across
 * shapes, sizes, views and viewports.
 */
import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/* Two labels may touch by a hairline without either becoming unreadable; anything with
   both dimensions above this is a genuine collision. */
const TOLERANCE_PX = 4;

/** Runs in the page: set a configuration, then measure every visible label's screen box. */
const SWEEP = ({ configs, tol }) => {
  const results = [];

  const measure = () => {
    const rects = [];
    const right = new THREE.Vector3(), up = new THREE.Vector3(), fwd = new THREE.Vector3();
    camera.updateMatrixWorld(true);
    camera.matrixWorld.extractBasis(right, up, fwd);
    const W = renderer.domElement.clientWidth, H = renderer.domElement.clientHeight;

    scene.traverse((o) => {
      if (!o.isSprite || !o.userData.text) return;
      let visible = o.visible;
      o.traverseAncestors((a) => { if (a.visible === false) visible = false; });
      if (!visible) return;

      const c = o.getWorldPosition(new THREE.Vector3());
      const hw = o.scale.x / 2, hh = o.scale.y / 2;
      const corners = [[-1, -1], [1, 1]].map(([sx, sy]) => {
        const v = c.clone()
          .addScaledVector(right, sx * hw)
          .addScaledVector(up, sy * hh)
          .project(camera);
        return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, z: v.z };
      });
      if (corners.some((q) => q.z > 1)) return;   // behind the camera

      rects.push({
        text: o.userData.text,
        x0: Math.min(corners[0].x, corners[1].x), x1: Math.max(corners[0].x, corners[1].x),
        y0: Math.min(corners[0].y, corners[1].y), y1: Math.max(corners[0].y, corners[1].y),
      });
    });
    return rects;
  };

  for (const cfg of configs) {
    Object.assign(state, { shape: cfg.shape, y: cfg.y, b: cfg.b, m: cfg.m, d: cfg.d });
    if (typeof applyShape === "function") applyShape();
    buildStatic();
    setView(cfg.view);

    /* setView moves the camera and retargets the orbit controls, but the controls only
       apply their target on update() — which normally happens in the frame loop. This
       sweep runs synchronously, so drive it explicitly rather than waiting for a frame:
       measuring against a stale camera matrix would silently compare the wrong view. */
    controls.update();
    camera.updateMatrixWorld(true);

    const rects = measure();
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ox > tol && oy > tol) {
          results.push(
            `${cfg.view} view, ${cfg.shape} y=${cfg.y} b=${cfg.b} m=${cfg.m}: `
            + `"${a.text}" and "${b.text}" overlap by ${Math.round(ox)}×${Math.round(oy)} px`,
          );
        }
      }
    }
    if (rects.length === 0) results.push(`${cfg.view} view, ${cfg.shape}: no labels found at all`);
  }
  return results;
};

const CONFIGS = [];
for (const shape of ["trap", "rect", "tri", "circ"]) {
  /* smallest, default and largest section the sliders allow */
  for (const [y, b, m, d] of [[0.4, 1.0, 0.5, 1.5], [1.2, 3.0, 1.5, 2.5], [3.5, 8.0, 3.0, 4.0]]) {
    for (const view of ["3d", "xs", "plan"]) CONFIGS.push({ shape, y, b, m, d, view });
  }
}

for (const [w, h] of [[1600, 950], [1366, 768]]) {
  test(`channel_geometry labels never overlap at ${w}×${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(pathToFileURL(resolve(ROOT, "animations/channel_geometry.html")).href,
      { waitUntil: "load" });
    await page.waitForFunction(() => typeof scene !== "undefined" && typeof camera !== "undefined",
      undefined, { timeout: 15000 });
    await page.waitForTimeout(400);

    const collisions = await page.evaluate(SWEEP, { configs: CONFIGS, tol: TOLERANCE_PX });

    expect(
      collisions,
      `${CONFIGS.length} configurations checked at ${w}×${h}; a label hidden under another `
      + "is unreadable to the student even though nothing errors",
    ).toEqual([]);
  });
}

test("every 3D label is tagged with its text", async ({ page }) => {
  /* The overlap test can only report what collided because makeLabel records the string
     on the sprite. If that tagging is dropped, the test above still passes but stops
     being able to describe a failure — so it is asserted separately. */
  await page.goto(pathToFileURL(resolve(ROOT, "animations/channel_geometry.html")).href,
    { waitUntil: "load" });
  await page.waitForFunction(() => typeof scene !== "undefined", undefined, { timeout: 15000 });
  await page.waitForTimeout(300);

  const r = await page.evaluate(() => {
    let tagged = 0, untagged = 0;
    scene.traverse((o) => { if (o.isSprite) (o.userData.text ? tagged++ : untagged++); });
    return { tagged, untagged };
  });

  expect(r.tagged, "the scene should carry labelled sprites").toBeGreaterThan(4);
  expect(r.untagged, "every label sprite should record its text in userData").toBe(0);
});
