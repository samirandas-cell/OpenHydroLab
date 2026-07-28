/* Specific energy — alternate depths, critical depth, sluice gate and hump choking.

   The specific-energy curve is defined by E = y + q²/2gy². Every check below reduces
   to putting a depth the module produced back into that equation and requiring the
   energy it was supposed to have. */
import { test, expect } from "@playwright/test";
import { openLab, verify, ycRect } from "../helpers/lab.mjs";

const MODULE = "specific_energy";
const G = 9.81;
const B = 0.20; // flume width, m

const Efn = (q, y) => y + (q * q) / (2 * G * y * y);

test.describe(`${MODULE} — numerical verification`, () => {
  test("alternate depths lie on the specific-energy curve", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    const q = 0.021;   // m²/s → y_c = 35.57 mm
    const E = 0.10;    // m, comfortably above E_min

    const r = await page.evaluate(({ qq, ee }) => ({
      ysub: rootSub(qq, ee), ysup: rootSup(qq, ee),
    }), { qq: q, ee: E });

    /* Both roots must reproduce E when substituted back — this is what makes them
       alternate depths rather than two unrelated numbers. */
    await verify(testInfo, {
      module: MODULE, id: "SE-01", quantity: "E from the subcritical root", units: "m",
      reference: E, observed: Efn(q, r.ysub),
      source: "y + q²/2gy² evaluated at the subcritical root must return E = 0.100 m",
      relTol: 1e-9,
    });

    await verify(testInfo, {
      module: MODULE, id: "SE-02", quantity: "E from the supercritical root", units: "m",
      reference: E, observed: Efn(q, r.ysup),
      source: "y + q²/2gy² evaluated at the supercritical root must return E = 0.100 m",
      relTol: 1e-9,
    });

    const yc = ycRect(q);
    expect(r.ysup, "supercritical root must sit below y_c").toBeLessThan(yc);
    expect(r.ysub, "subcritical root must sit above y_c").toBeGreaterThan(yc);
  });

  test("critical depth and minimum specific energy", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    const r = await page.evaluate(() => {
      Object.assign(st, { mode: "hump", Qset: 0.0042, yapp: 0.170, dz: 0.0 });
      return solve();
    });

    await verify(testInfo, {
      module: MODULE, id: "SE-03", quantity: "Critical depth", units: "m",
      reference: ycRect(0.0042 / B), observed: r.yc,
      source: "y_c = (q²/g)^(1/3) with q = Q/B = 0.0042/0.20 = 0.021 m²/s",
      relTol: 1e-9,
    });

    /* E_min = 1.5·y_c is the whole reason the curve has a nose. */
    await verify(testInfo, {
      module: MODULE, id: "SE-04", quantity: "Minimum specific energy", units: "m",
      reference: 1.5 * ycRect(0.0042 / B), observed: r.Emin,
      source: "E_min = 1.5·y_c for a rectangular section",
      relTol: 1e-9,
    });

    /* And E evaluated at y_c must actually equal it. */
    await verify(testInfo, {
      module: MODULE, id: "SE-05", quantity: "E evaluated at y_c", units: "m",
      reference: r.Emin, observed: Efn(0.0042 / B, r.yc),
      source: "substituting y_c into the specific-energy equation must give E_min",
      relTol: 1e-9,
    });
  });

  test("sluice gate conserves specific energy across the opening", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The gate discharge is derived from E₁ = E₂. Recovering that equality from the
       resulting depths confirms the closed form was implemented correctly. */
    let worst = { err: 0, at: null };
    for (const y1 of [0.12, 0.17, 0.24]) {
      for (const a of [0.008, 0.012, 0.020]) {
        const r = await page.evaluate(({ yy, aa }) => {
          Object.assign(st, { mode: "setY1", y1: yy, a: aa });
          return solve();
        }, { yy: y1, aa: a });

        const err = Math.abs(r.E1 - r.E2) / r.E1;
        if (err > worst.err) worst = { err, at: { y1, a } };

        expect(r.Fr1, "approach flow must be subcritical").toBeLessThan(1);
        expect(r.Fr2, "flow under the gate must be supercritical").toBeGreaterThan(1);
      }
    }

    await verify(testInfo, {
      module: MODULE, id: "SE-06", quantity: "Worst |E₁ − E₂|/E₁ across 9 gate settings", units: "–",
      reference: 0, observed: worst.err,
      source: `sluice-gate discharge is derived from E₁ = E₂; y₁ ∈ {0.12, 0.17, 0.24} m × `
        + `a ∈ {8, 12, 20} mm (worst at ${JSON.stringify(worst.at)})`,
      absTol: 1e-9,
    });
  });

  test("energy budget closes along the whole hump reach", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Over a frictionless hump the total head is constant, so
         y(x) + q²/2gy(x)² + z(x) = E₁
       must hold at every station, choked or not. The module samples 121 stations. */
    for (const [label, dz] of [["subcritical", 0.010], ["near choking", 0.030], ["choked", 0.060]]) {
      const res = await page.evaluate((d) => {
        Object.assign(st, { mode: "hump", Qset: 0.0042, yapp: 0.170, dz: d });
        const r = solve();
        return { residual: energyResidual(r), choked: r.choked, E1: r.E1, dzc: r.dzc };
      }, dz);

      await verify(testInfo, {
        module: MODULE, id: `SE-07.${dz * 1000}mm`,
        quantity: `Max head residual over the reach, Δz = ${dz * 1000} mm (${label})`, units: "m",
        reference: 0, observed: res.residual,
        source: "max |y + q²/2gy² + z − E₁| over 121 stations along the flume",
        absTol: 1e-6,
      });
    }
  });

  test("choking begins exactly where the energy margin runs out", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The critical hump height is Δz_c = E_approach − E_min. Just below it the flow is
       unchoked and the upstream depth is untouched; just above it the upstream surface
       must rise. This threshold is the conceptual pivot of the whole module. */
    const r = await page.evaluate(() => {
      Object.assign(st, { mode: "hump", Qset: 0.0042, yapp: 0.170, dz: 0 });
      const base = solve();
      const eps = 1e-4;
      Object.assign(st, { dz: base.dzc - eps });
      const below = solve();
      Object.assign(st, { dz: base.dzc + eps });
      const above = solve();
      return { dzc: base.dzc, Eapp: base.Eapp, Emin: base.Emin, below, above };
    });

    await verify(testInfo, {
      module: MODULE, id: "SE-08", quantity: "Critical hump height Δz_c", units: "m",
      reference: r.Eapp - r.Emin, observed: r.dzc,
      source: "Δz_c = E_approach − E_min: the largest step the flow can climb without choking",
      relTol: 1e-9,
    });

    expect(r.below.choked, "just below Δz_c the flow must not be choked").toBe(false);
    expect(r.above.choked, "just above Δz_c the flow must choke").toBe(true);
    expect(r.above.rise, "choking must back water up upstream").toBeGreaterThan(0);
  });
});
