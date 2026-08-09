/* Hydrostatic force in three dimensions — plate shapes and the pressure prism.

   This module's distinctive claim is that the standard table of geometric properties
   is not taken on trust: A, ȳ and I_xc are re-derived from each shape's own chord
   width and compared with the table on screen. The tests below close the loop by
   holding the module to the table values written out here, and to a centre-of-pressure
   reference obtained by integrating the pressure over the shape directly — a route
   that never mentions I_xc.

   For a shape of chord width w(t), t measured along the plane from the upper edge,
   and a pressure that varies linearly as p = p₀ + k t,

       s_R = ∫ t (p₀ + k t) w dt  /  ∫ (p₀ + k t) w dt

   which for the triangle (w = b t/L) evaluates in closed form to

       s_R = L (4 h_top + 3 L sinθ) / [ 2 (3 h_top + 2 L sinθ) ]
*/
import { test } from "@playwright/test";
import { openLab, verify } from "../helpers/lab.mjs";

const MODULE = "hydrostatic_forces_3d";
const G = 9.81;
const GAMMA = 1000 * G;

const plane = (page, cfg) => page.evaluate((c) => {
  Object.assign(st, { mode: "plane", rho: 1000, ...c });
  clampState();
  const R = solve();
  return { A: R.A, ycl: R.ycl, Ixc: R.Ixc, hc: R.hc, F: R.F, dy: R.dy, sR: R.sR, yc: R.yc,
           chkA: R.chkA, chkYc: R.chkYc, chkI: R.chkI, chkF: R.chkF, chkS: R.chkS };
}, cfg);

const curved = (page, cfg) => page.evaluate((c) => {
  Object.assign(st, { mode: "curved", rho: 1000, ...c });
  clampState();
  const R = solve();
  return { Fx: R.Fx, Fv: R.Fv, FR: R.FR, armX: R.armX, xbar: R.xbar, Mnet: R.Mnet };
}, cfg);

/* The standard table (Munson Fig. 2.18), written out independently of the module. */
const L = 3, B = 2;
const TABLE = {
  rect: { A: B * L,                     yc: L / 2,                 I: (B * L ** 3) / 12 },
  tri:  { A: (B * L) / 2,               yc: (2 * L) / 3,           I: (B * L ** 3) / 36 },
  circ: { A: (Math.PI * L * L) / 4,     yc: L / 2,                 I: (Math.PI * L ** 4) / 64 },
  semi: { A: (Math.PI * L * L) / 2,     yc: (4 * L) / (3 * Math.PI),
          I: (Math.PI / 8 - 8 / (9 * Math.PI)) * L ** 4 },
};

test.describe(`${MODULE} — numerical verification`, () => {

  for (const [shape, ref] of Object.entries(TABLE)) {
    test(`${shape}: area, centroid and second moment match the standard table`, async ({ page }, testInfo) => {
      await openLab(page, MODULE);
      const r = await plane(page, { shape, theta: 35, L, b: B, hTop: 1.5 });

      await verify(testInfo, {
        module: MODULE, id: `shape-${shape}-A`, quantity: "area", units: "m²",
        reference: ref.A, observed: r.A, relTol: 1e-12,
        source: `standard table of geometric properties, ${shape}: A = ${ref.A.toFixed(6)} m² at L = 3 m, b = 2 m`,
      });
      await verify(testInfo, {
        module: MODULE, id: `shape-${shape}-yc`, quantity: "centroid from the upper edge",
        units: "m", reference: ref.yc, observed: r.ycl, relTol: 1e-12,
        source: `standard table, ${shape}: ȳ = ${ref.yc.toFixed(6)} m`,
      });
      await verify(testInfo, {
        module: MODULE, id: `shape-${shape}-I`, quantity: "second moment about the centroidal axis",
        units: "m⁴", reference: ref.I, observed: r.Ixc, relTol: 1e-12,
        source: `standard table, ${shape}: I_xc = ${ref.I.toFixed(6)} m⁴`,
      });
      /* And the module's own re-derivation of the same three, from the chord width. */
      for (const [id, obs, what] of [
        ["A", r.chkA, "area"], ["yc", r.chkYc, "centroid"], ["I", r.chkI, "second moment"],
      ]) {
        await verify(testInfo, {
          module: MODULE, id: `shape-${shape}-selfcheck-${id}`,
          quantity: `${what} from ∫w dt ÷ table`, units: "—",
          reference: 1, observed: obs, relTol: 1e-6,
          source: `the module integrates the shape's own chord width w(t) and compares with the `
                + `table value; the substitution used for the circular shapes makes the `
                + `integrand smooth, so this must hold to ~1e-8`,
        });
      }
    });
  }

  test("circle: F = γ h_c A with the centroid a half-diameter down the plane", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const D = 2, theta = 60, hTop = 3;
    const r = await plane(page, { shape: "circ", theta, L: D, b: 2, hTop });

    const hc = hTop + (D / 2) * Math.sin((theta * Math.PI) / 180);
    const A = (Math.PI * D * D) / 4;
    await verify(testInfo, {
      module: MODULE, id: "circ-F", quantity: "resultant force", units: "N",
      reference: GAMMA * hc * A, observed: r.F, relTol: 1e-12,
      source: "F = γ h_c A, h_c = 3 + 1·sin60° = 3.8660 m, A = πD²/4 = 3.1416 m² → 119.15 kN",
    });
    await verify(testInfo, {
      module: MODULE, id: "circ-dy", quantity: "shift of the CP below the centroid", units: "m",
      reference: ((Math.PI * D ** 4) / 64) * Math.sin((theta * Math.PI) / 180) / (hc * A),
      observed: r.dy, relTol: 1e-12,
      source: "Δy = I_xc sinθ /(h_c A) with I_xc = πD⁴/64 — the form of I_xc/(y_cA) that stays "
            + "finite as θ → 0",
    });
  });

  test("triangle: the CP matches a direct integration that never uses I_xc", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const theta = 40, hTop = 1.2, Lt = 3, bt = 2;
    const r = await plane(page, { shape: "tri", theta, L: Lt, b: bt, hTop });

    /* s_R = ∫t(p₀+kt)(b t/L)dt / ∫(p₀+kt)(b t/L)dt over 0..L
           = (p₀L³/3 + kL⁴/4) / (p₀L²/2 + kL³/3)
       with p₀ = γh_top and k = γsinθ. */
    const u = hTop, v = Lt * Math.sin((theta * Math.PI) / 180);
    const ref = (Lt * (4 * u + 3 * v)) / (2 * (3 * u + 2 * v));
    await verify(testInfo, {
      module: MODULE, id: "tri-CP", quantity: "centre of pressure from the apex", units: "m",
      reference: ref, observed: r.sR, relTol: 1e-12,
      source: "direct integration of the first moment of pressure over the triangle, "
            + "s_R = L(4h_top + 3L sinθ)/[2(3h_top + 2L sinθ)] — independent of I_xc",
    });
  });

  test("semicircle: the centroid sits at 4R/3π from the flat edge", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const Rs = 2;
    const r = await plane(page, { shape: "semi", theta: 90, L: Rs, b: 2, hTop: 0 });
    await verify(testInfo, {
      module: MODULE, id: "semi-centroid", quantity: "centroid from the flat edge", units: "m",
      reference: (4 * Rs) / (3 * Math.PI), observed: r.ycl, relTol: 1e-12,
      source: "standard table: the centroid of a semicircle lies 4R/3π = 0.8488 m from its "
            + "diameter, which is why its CP is not at mid-height",
    });
  });

  test("horizontal limit: every shape puts the CP on its own centroid", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    for (const shape of Object.keys(TABLE)) {
      const r = await plane(page, { shape, theta: 0, L, b: B, hTop: 4 });
      await verify(testInfo, {
        module: MODULE, id: `horiz-${shape}-dy`, quantity: `Δy for a horizontal ${shape}`,
        units: "m", reference: 0, observed: r.dy, relTol: 1e-15,
        source: "uniform pressure has no first moment about the centroid, whatever the shape; "
              + "Δy = I_xc sinθ/(h_cA) reaches this without dividing by sinθ",
      });
    }
  });

  test("circular gate: the resultant still passes through the pivot axis", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const R = 2, hO = 3, b = 2;
    const r = await curved(page, { R, hO, span: 90, bc: b });

    await verify(testInfo, {
      module: MODULE, id: "gate3d-Fx", quantity: "horizontal component", units: "N",
      reference: GAMMA * (hO + R / 2) * R * b, observed: r.Fx, relTol: 1e-12,
      source: "F_x = γ h_c A_proj on the vertical projection → 156.96 kN",
    });
    await verify(testInfo, {
      module: MODULE, id: "gate3d-Fv", quantity: "vertical component", units: "N",
      reference: GAMMA * b * (hO * R + (Math.PI * R * R) / 4), observed: r.Fv, relTol: 1e-12,
      source: "F_v = γ b (h_O R + πR²/4) → 179.36 kN",
    });
    await verify(testInfo, {
      module: MODULE, id: "gate3d-zero-moment", quantity: "net moment ÷ (F_R·R)", units: "—",
      reference: 0, observed: Math.abs(r.Mnet) / (r.FR * R), relTol: 1e-12,
      source: "the traction on a circular arc is radial, so it exerts no moment about the "
            + "pivot axis — the property a Tainter gate is designed around",
    });
  });

  test("the worked solution reports the same numbers as the model", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    /* The step-by-step panel is generated from the solution object, but it is what a
       student copies down, so its headline answer is checked against the model. */
    const r = await page.evaluate(() => {
      Object.assign(st, { mode: "plane", shape: "rect", theta: 30, L: 3, b: 2, hTop: 2, rho: 1000, step: 0 });
      clampState(); refresh();
      const R = solve();
      const txt = document.querySelector("#work .answer").textContent;
      const m = txt.match(/F_R = ([\d.]+) kN/);
      return { panel: m ? Number(m[1]) : NaN, model: R.F / 1000 };
    });
    await verify(testInfo, {
      module: MODULE, id: "worked-solution-answer", quantity: "F_R quoted by the panel", units: "kN",
      reference: r.model, observed: r.panel, relTol: 5e-4,
      source: "the worked-solution panel must quote the model's own resultant, to the two "
            + "decimals it displays",
    });
  });
});
