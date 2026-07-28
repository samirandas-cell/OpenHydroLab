/* Storm hydrograph — φ-index losses, Nash cascade routing, baseflow separation.

   References used here:
     · the φ-index definition itself (excess = (i − φ)·D for i > φ),
     · the closed-form response of a cascade of two equal linear reservoirs,
     · volume conservation between the excess-rainfall depth and the routed
       direct-runoff hydrograph.
   None of these is read back from the module. */
import { test, expect } from "@playwright/test";
import { openLab, verify, nash2, nash2Peak } from "../helpers/lab.mjs";

const MODULE = "storm_hydrograph";

/** Run simulate() for a given parameter set and return the result object. */
async function run(page, params) {
  return page.evaluate((p) => {
    Object.assign(S, p);
    const r = simulate(p.phi, p.k);
    return {
      erDepth: r.erDepth, fDepth: r.fDepth, chk: r.chk, volD: r.volD,
      qp: r.qp, tp: r.tp, tc: r.tc, lag: r.lag,
      qdMax: Math.max(...r.qd),
      qdAtEndOfRain: r.qd[Math.round((1 + p.dur) / 0.02)],
      qbFirst: r.qb[0],
    };
  }, params);
}

/* Design case: 30 mm/h for 3 h on a 20 km² catchment, φ = 10 mm/h, k = 4 h.
   Hand calculation: excess = (30 − 10) × 3 = 60 mm; losses = 10 × 3 = 30 mm. */
const CASE = { i: 30, dur: 3, phi: 10, A: 20, k: 4, u: 0, bf: "res" };

test.describe(`${MODULE} — numerical verification`, () => {
  test("rainfall partitioning follows the φ-index definition", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await run(page, CASE);

    await verify(testInfo, {
      module: MODULE, id: "SH-01", quantity: "Excess rainfall depth", units: "mm",
      reference: (CASE.i - CASE.phi) * CASE.dur, observed: r.erDepth,
      source: "φ-index: (i − φ)·D = (30 − 10) mm/h × 3 h = 60 mm",
      relTol: 1e-6,
    });

    await verify(testInfo, {
      module: MODULE, id: "SH-02", quantity: "Infiltrated depth", units: "mm",
      reference: Math.min(CASE.i, CASE.phi) * CASE.dur, observed: r.fDepth,
      source: "φ-index: min(i, φ)·D = 10 mm/h × 3 h = 30 mm",
      relTol: 1e-6,
    });

    await verify(testInfo, {
      module: MODULE, id: "SH-03", quantity: "Runoff coefficient", units: "–",
      reference: 60 / 90, observed: r.erDepth / (r.erDepth + r.fDepth),
      source: "ER / P = 60 mm / 90 mm = 0.6667",
      relTol: 1e-6,
    });
  });

  test("routed hydrograph conserves the excess-rainfall volume", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await run(page, CASE);

    /* The routing cascade is linear and mass-conserving, so the volume under the
       direct-runoff hydrograph must return exactly the excess-rainfall depth.
       This is the module's central conservation identity. */
    await verify(testInfo, {
      module: MODULE, id: "SH-04", quantity: "Volume closure (depth from ∫Q dt)", units: "mm",
      reference: 60, observed: r.chk,
      source: "∫Q_d dt / A must return the 60 mm of excess rainfall that generated it",
      relTol: 2e-3,
    });

    await verify(testInfo, {
      module: MODULE, id: "SH-05", quantity: "Direct-runoff volume", units: "10⁶ m³",
      reference: (0.060 * 20e6) / 1e6, observed: r.volD / 1e6,
      source: "60 mm × 20 km² = 0.060 m × 20×10⁶ m² = 1.20×10⁶ m³",
      relTol: 2e-3,
    });
  });

  test("peak discharge matches the two-reservoir cascade closed form", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await run(page, CASE);

    /* Constant excess-rainfall input I switched on at t = 1 h and held for D = 3 h,
       I = 20 mm/h over 20 km² = 111.11 m³/s. */
    const I = ((CASE.i - CASE.phi) / 1000 / 3600) * (CASE.A * 1e6); // mm/h over A → m³/s

    /* Outflow at the moment the rain stops. */
    await verify(testInfo, {
      module: MODULE, id: "SH-06", quantity: "Direct runoff at the end of the rain", units: "m³/s",
      reference: nash2(I, CASE.k, CASE.dur), observed: r.qdAtEndOfRain,
      source: "Nash n=2, constant input: q(D) = I[1 − e^(−D/k)(1 + D/k)] "
        + "= 111.11 × 0.17336 = 19.262 m³/s, D = 3 h, k = 4 h",
      relTol: 2e-3,
    });

    /* The peak itself arrives after the rain has stopped — the second reservoir is
       still filling at t = D. Students routinely expect the peak to coincide with the
       end of the storm, so this is worth pinning down exactly. */
    const peak = nash2Peak(I, CASE.k, CASE.dur);

    await verify(testInfo, {
      module: MODULE, id: "SH-07", quantity: "Direct-runoff peak", units: "m³/s",
      reference: peak.qp, observed: r.qdMax,
      source: "Nash n=2 cascade peaks where q₁ = q₂, at τ* = k[1 − q₂(D)/q₁(D)] "
        + `= ${peak.tau.toFixed(3)} h after the rain stops → ${peak.qp.toFixed(3)} m³/s`,
      relTol: 2e-3,
    });

    expect(r.qdMax, "the peak must exceed the discharge at the end of the rain")
      .toBeGreaterThan(r.qdAtEndOfRain);
  });

  test("pre-storm baseflow follows the stated 0.05 m³/s per km² rule", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await run(page, CASE);

    await verify(testInfo, {
      module: MODULE, id: "SH-09", quantity: "Pre-storm baseflow", units: "m³/s",
      reference: 0.05 * CASE.A, observed: r.qbFirst,
      source: "documented rule q₀ = 0.05 × A = 0.05 × 20 km² = 1.0 m³/s",
      relTol: 1e-9,
    });
  });

  test("volume closes across the whole parameter space", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Conservation is not a property of one lucky parameter set. Sweep the controls
       and require closure everywhere the storm actually produces runoff. */
    const grid = [];
    for (const i of [15, 30, 60, 100]) {
      for (const dur of [1, 3, 6]) {
        for (const phi of [0, 10, 25]) {
          for (const k of [0.5, 4, 12]) {
            if (i > phi) grid.push({ ...CASE, i, dur, phi, k });
          }
        }
      }
    }

    let worst = { relErr: 0 };
    for (const p of grid) {
      const r = await run(page, p);
      const expected = (p.i - p.phi) * p.dur;
      const relErr = Math.abs(r.chk - expected) / expected;
      if (relErr > worst.relErr) worst = { relErr, p, observed: r.chk, expected };
    }

    await verify(testInfo, {
      module: MODULE, id: "SH-08", quantity: `Worst volume-closure error over ${grid.length} parameter sets`,
      units: "–",
      reference: 0, observed: worst.relErr,
      source: `sweep of i ∈ {15,30,60,100} mm/h, D ∈ {1,3,6} h, φ ∈ {0,10,25} mm/h, `
        + `k ∈ {0.5,4,12} h; closure required at every point `
        + `(worst at ${JSON.stringify(worst.p ?? CASE)})`,
      absTol: 5e-3,
    });
  });

  test("urbanisation raises and sharpens the peak", async ({ page }) => {
    await openLab(page, MODULE);

    /* A behavioural check rather than a numerical one: the module must reproduce the
       qualitative result the lecture is built around. Increasing imperviousness cuts
       φ and k, so the peak must rise and arrive sooner, monotonically. */
    const peaks = [];
    for (const u of [0, 25, 50, 75, 100]) {
      const r = await page.evaluate((uu) => {
        Object.assign(S, { i: 30, dur: 3, phi: 10, A: 20, k: 4, u: uu, bf: "res" });
        const e = urbanized();
        const res = simulate(e.phi, e.k);
        return { qp: res.qp, tp: res.tp };
      }, u);
      peaks.push(r);
    }

    for (let j = 1; j < peaks.length; j++) {
      expect(peaks[j].qp, `peak must rise with urbanisation (step ${j})`)
        .toBeGreaterThan(peaks[j - 1].qp);
      expect(peaks[j].tp, `peak must not arrive later with urbanisation (step ${j})`)
        .toBeLessThanOrEqual(peaks[j - 1].tp);
    }
  });
});
