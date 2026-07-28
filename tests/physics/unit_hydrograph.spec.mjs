/* Unit hydrograph — derivation, convolution, and the S-curve duration change.

   The unit hydrograph is defined by a volume: whatever its duration, a UH must
   contain exactly one unit of direct runoff over the catchment. Everything below
   tests that definition and the linearity that follows from it. */
import { test, expect } from "@playwright/test";
import { openLab, verify } from "../helpers/lab.mjs";

const MODULE = "unit_hydrograph";

test.describe(`${MODULE} — numerical verification`, () => {
  test("equilibrium discharge of the S-curve", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const { qeq, area, d0, sInf } = await page.evaluate(() => ({
      qeq: QEQ, area: AREA, d0: D0, sInf: Scv(1000),
    }));

    /* Continuous rain of 1 cm per D₀ hours over area A settles at
       Q_eq = A · 0.01 m / (D₀ · 3600 s). */
    await verify(testInfo, {
      module: MODULE, id: "UH-01", quantity: "S-curve equilibrium discharge", units: "m³/s",
      reference: (area * 0.01) / (d0 * 3600), observed: qeq,
      source: "Q_eq = A·(1 cm)/D₀ = 423×10⁶ m² × 0.01 m / (6 × 3600 s) = 195.833 m³/s",
      relTol: 1e-9,
    });

    /* The S-curve is Q_eq times a gamma CDF, so it must asymptote to Q_eq. */
    await verify(testInfo, {
      module: MODULE, id: "UH-02", quantity: "S-curve asymptote S(t→∞)", units: "m³/s",
      reference: (area * 0.01) / (d0 * 3600), observed: sInf,
      source: "S(t) = Q_eq·P(t) with P a gamma CDF, so S(∞) = Q_eq",
      relTol: 1e-9,
    });
  });

  test("every derived duration carries exactly one unit of runoff", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The lag-and-subtract construction UH_D'(t) = [S(t) − S(t−D')]·D₀/D' telescopes
       to unit volume for any D'. This is the identity the whole S-curve method rests
       on, and the one students most often get wrong, so it is swept, not spot-checked. */
    const durations = [1, 2, 3, 4, 6, 8, 12, 18, 24];
    const volumes = await page.evaluate((durs) => durs.map((Dp) => ({
      Dp, cm: integrate((t) => UHd(t, Dp), 0, TINT) / AREA * 100,
    })), durations);

    let worst = { err: 0, Dp: null, cm: null };
    for (const v of volumes) {
      const err = Math.abs(v.cm - 1);
      if (err > worst.err) worst = { err, Dp: v.Dp, cm: v.cm };
    }

    await verify(testInfo, {
      module: MODULE, id: "UH-03",
      quantity: `Worst unit-volume error over ${durations.length} durations`, units: "cm",
      reference: 0, observed: worst.err,
      source: `∫UH_D' dt / A = 1.00 cm required for D' ∈ {${durations.join(", ")}} h `
        + `(worst at D' = ${worst.Dp} h, giving ${worst.cm?.toFixed(5)} cm)`,
      absTol: 2e-3, // fixed-step trapezoidal integration at Δt = 0.05 h
    });
  });

  test("derivation recovers the excess-rainfall depth that generated the storm", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Mode 1 builds a synthetic observed hydrograph from a known 3 cm of excess
       rainfall plus 10 m³/s of baseflow. Separating that baseflow and dividing by
       the runoff depth must return the 3 cm — a closed identification loop. */
    const r = await page.evaluate(() => {
      Object.assign(S, { mode: "derive", bf: 10 });
      recompute();
      return { d: M.d, uhV: M.uhV, erTrue: ER_TRUE };
    });

    await verify(testInfo, {
      module: MODULE, id: "UH-04", quantity: "Recovered runoff depth", units: "cm",
      reference: r.erTrue, observed: r.d,
      source: "storm synthesised as 3.00 cm × UH₆ + 10 m³/s baseflow; "
        + "d = V_DRH/A must return 3.00 cm",
      relTol: 5e-3,
    });

    await verify(testInfo, {
      module: MODULE, id: "UH-05", quantity: "Volume of the derived UH", units: "cm",
      reference: 1.0, observed: r.uhV,
      source: "the derived unit hydrograph must itself carry unit volume",
      relTol: 5e-3,
    });
  });

  test("S-curve and superposition give the same UH for integer multiples", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Two independent routes to a 12-h UH: lag-and-subtract on the S-curve, and the
       average of two 6-h UHs offset by 6 h. They are the same object, so agreement
       is a check on both implementations at once. */
    for (const Dp of [12, 18, 24]) {
      const r = await page.evaluate((d) => {
        Object.assign(S, { mode: "scurve", Dp: d });
        recompute();
        return { maxDiff: M.maxDiff, peak: M.pk.p, isMult: M.isMult };
      }, Dp);

      expect(r.isMult, `D' = ${Dp} h should be recognised as a multiple of D₀`).toBe(true);

      await verify(testInfo, {
        module: MODULE, id: `UH-06.${Dp}`,
        quantity: `S-curve vs superposition, D' = ${Dp} h`, units: "m³/s",
        reference: 0, observed: r.maxDiff,
        source: `max |UH from S-curve − UH from averaging ${Dp / 6} lagged 6-h UHs| over 0–140 h`,
        absTol: 1e-6,
      });
    }
  });

  test("convolution conserves the applied rainfall volume", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Apply a three-period storm and require the convolved direct-runoff volume to
       equal ΣR over the catchment — linearity plus conservation. */
    const r = await page.evaluate(() => {
      Object.assign(S, { mode: "apply", R: [3, 2, 1], Dr: 6, bf2: 10 });
      recompute();
      return { V: M.V, Vc: M.Vc, er: M.er, area: AREA };
    });

    await verify(testInfo, {
      module: MODULE, id: "UH-07", quantity: "Convolved runoff volume", units: "10⁶ m³",
      reference: ((3 + 2 + 1) / 100) * r.area / 1e6, observed: r.V / 1e6,
      source: "ΣR = 6 cm over 423 km² = 0.06 m × 423×10⁶ m² = 25.38×10⁶ m³",
      relTol: 5e-3,
    });
  });
});
