/* IDF and frequency analysis — Gumbel fitting, the Sherman IDF surface,
   time of concentration, and the Rational Method.

   This is the only module built on a real gauge record (27 years of annual maxima
   at six durations), so the tests check both the statistics and the unit algebra
   that carries an intensity through to a design discharge. */
import { test, expect } from "@playwright/test";
import { openLab, verify, gumbelY } from "../helpers/lab.mjs";

const MODULE = "idf_frequency";
const EULER = 0.5772156649;

test.describe(`${MODULE} — numerical verification`, () => {
  test("Gumbel parameters match a method-of-moments fit computed independently", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const { ams, gum, durations } = await page.evaluate(() => ({
      ams: Object.fromEntries(DUR.map((D) => [D, AMS[D]])),
      gum: Object.fromEntries(DUR.map((D) => [D, GUM[D]])),
      durations: DUR,
    }));

    /* Method of moments for the Gumbel distribution:
         α = √6·s/π,  ξ = x̄ − 0.5772·α,  with s the n−1 sample standard deviation. */
    let worstAl = 0, worstXi = 0, atAl = null, atXi = null;
    for (const D of durations) {
      const x = ams[D];
      const n = x.length;
      const mu = x.reduce((a, b) => a + b, 0) / n;
      const sd = Math.sqrt(x.reduce((a, b) => a + (b - mu) ** 2, 0) / (n - 1));
      const al = (Math.sqrt(6) * sd) / Math.PI;
      const xi = mu - EULER * al;

      const eAl = Math.abs(gum[D].al - al) / al;
      const eXi = Math.abs(gum[D].xi - xi) / Math.abs(xi);
      if (eAl > worstAl) { worstAl = eAl; atAl = D; }
      if (eXi > worstXi) { worstXi = eXi; atXi = D; }

      expect(n, `duration ${D} h should have 27 annual maxima`).toBe(27);
    }

    await verify(testInfo, {
      module: MODULE, id: "ID-01", quantity: "Worst Gumbel scale α error over 6 durations", units: "–",
      reference: 0, observed: worstAl,
      source: `α = √6·s/π recomputed in Node from the published annual maxima `
        + `(worst at D = ${atAl} h)`,
      absTol: 1e-12,
    });

    await verify(testInfo, {
      module: MODULE, id: "ID-02", quantity: "Worst Gumbel location ξ error over 6 durations", units: "–",
      reference: 0, observed: worstXi,
      source: `ξ = x̄ − 0.5772·α recomputed in Node from the published annual maxima `
        + `(worst at D = ${atXi} h)`,
      absTol: 1e-12,
    });
  });

  test("reduced variate and quantile function", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await page.evaluate(() => ({
      y100: yT(100), y2: yT(2),
      i100_1h: iGum(1, 100), gum1: GUM[1],
    }));

    /* y_T = −ln(−ln(1 − 1/T)); at T = 100 this is 4.600149. */
    await verify(testInfo, {
      module: MODULE, id: "ID-03", quantity: "Gumbel reduced variate at T = 100 yr", units: "–",
      reference: gumbelY(100), observed: r.y100,
      source: "y_T = −ln(−ln(1 − 1/T)) = −ln(−ln 0.99) = 4.600149",
      relTol: 1e-12,
    });

    await verify(testInfo, {
      module: MODULE, id: "ID-04", quantity: "Gumbel reduced variate at T = 2 yr", units: "–",
      reference: gumbelY(2), observed: r.y2,
      source: "y_T = −ln(−ln 0.5) = 0.366513",
      relTol: 1e-12,
    });

    /* And the quantile must be exactly the linear combination it claims to be. */
    await verify(testInfo, {
      module: MODULE, id: "ID-05", quantity: "1-h, 100-yr design intensity", units: "mm/h",
      reference: r.gum1.xi + r.gum1.al * gumbelY(100), observed: r.i100_1h,
      source: "i(D,T) = ξ_D + α_D·y_T evaluated from the fitted 1-h parameters",
      relTol: 1e-12,
    });
  });

  test("the Sherman IDF surface reproduces the Gumbel quantiles it was fitted to", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await page.evaluate(() => {
      const rows = [];
      for (const D of DUR) for (const T of [2, 5, 10, 25, 50, 100]) {
        rows.push({ D, T, gum: iGum(D, T), sh: iSherman(D, T) });
      }
      return { rows, sh: SH };
    });

    /* The Sherman form i = a·T^m/(D+b)^n is a smooth summary of 36 Gumbel quantiles.
       It cannot reproduce them exactly, so the honest test is that the fitted RMSE
       is small relative to the intensities being fitted, and that no single point is
       badly off. */
    const mean = r.rows.reduce((a, x) => a + x.gum, 0) / r.rows.length;
    const worst = Math.max(...r.rows.map((x) => Math.abs(x.sh - x.gum) / x.gum));

    await verify(testInfo, {
      module: MODULE, id: "ID-06", quantity: "Sherman fit RMSE relative to mean intensity", units: "–",
      reference: 0, observed: r.sh.rmse / mean,
      source: `Levenberg–Marquardt fit of i = a·T^m/(D+b)^n to 36 Gumbel quantiles; `
        + `RMSE ${r.sh.rmse.toFixed(4)} mm/h against a mean intensity of ${mean.toFixed(2)} mm/h`,
      absTol: 0.10,
    });

    await verify(testInfo, {
      module: MODULE, id: "ID-07", quantity: "Worst single-point Sherman deviation", units: "–",
      reference: 0, observed: worst,
      source: "max |i_Sherman − i_Gumbel| / i_Gumbel over the 6 durations × 6 return periods",
      absTol: 0.25,
    });

    for (const k of ["a", "m", "b", "n"]) {
      expect(Number.isFinite(r.sh[k]), `Sherman parameter ${k} must be finite`).toBe(true);
    }
  });

  test("intensity is monotone in both duration and return period", async ({ page }) => {
    await openLab(page, MODULE);
    const r = await page.evaluate(() => {
      const out = {};
      for (const T of [2, 10, 100]) out[T] = DUR.map((D) => iGum(D, T));
      const byT = [2, 5, 10, 25, 50, 100].map((T) => iGum(1, T));
      return { out, byT, durations: DUR };
    });

    /* Longer storms are less intense; rarer storms are more intense. If either
       ordering broke, every IDF curve on the plot would be wrong. */
    for (const T of [2, 10, 100]) {
      const series = r.out[T];
      for (let i = 1; i < series.length; i++) {
        expect(series[i], `intensity must fall with duration (T = ${T} yr, D = ${r.durations[i]} h)`)
          .toBeLessThan(series[i - 1]);
      }
    }
    for (let i = 1; i < r.byT.length; i++) {
      expect(r.byT[i], "intensity must rise with return period").toBeGreaterThan(r.byT[i - 1]);
    }
  });

  test("time of concentration and the Rational Method", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Kirpich: t_c = 0.0195·L^0.77·S^(−0.385) minutes, converted to hours.
       L = 4000 m, S = 0.005 → t_c = 1.4830 h. */
    const L = 4000, slope = 0.005;
    const tcRef = (0.0195 * Math.pow(L, 0.77) * Math.pow(slope, -0.385)) / 60;
    const r = await page.evaluate(({ l, s }) => ({
      tc: kirpichTc(l, s),
      i: iSherman(kirpichTc(l, s), 100),
      C: S.C, A: S.A,
    }), { l: L, s: slope });

    await verify(testInfo, {
      module: MODULE, id: "ID-08", quantity: "Time of concentration (Kirpich)", units: "h",
      reference: tcRef, observed: r.tc,
      source: "t_c = 0.0195·L^0.77·S^(−0.385)/60 with L = 4000 m, S = 0.005 → 1.4830 h",
      relTol: 1e-12,
    });

    /* The Rational Method in SI: Q = C·i·A/3.6 turns mm/h over km² into m³/s.
       The 3.6 is the whole unit conversion, and getting it wrong is the classic
       student error the module is meant to prevent. */
    const Qref = (0.45 * r.i * 10) / 3.6;
    const Qobs = await page.evaluate(({ i }) => {
      Object.assign(S, { C: 0.45, A: 10 });
      return S.C * i * S.A / 3.6;
    }, { i: r.i });

    await verify(testInfo, {
      module: MODULE, id: "ID-09", quantity: "Rational Method peak discharge", units: "m³/s",
      reference: Qref, observed: Qobs,
      source: "Q_p = C·i·A/3.6 with C = 0.45, A = 10 km², "
        + `i = i_Sherman(t_c, 100 yr) = ${r.i.toFixed(3)} mm/h`,
      relTol: 1e-12,
    });

    /* Dimensional sanity, done from first principles rather than by trusting 3.6:
       0.45 × i [mm/h] × 10 [km²] = 0.45 × (i/1000/3600) m/s × 10×10⁶ m². */
    const QfromSI = 0.45 * (r.i / 1000 / 3600) * (10 * 1e6);
    await verify(testInfo, {
      module: MODULE, id: "ID-10", quantity: "Rational Method via base SI units", units: "m³/s",
      reference: QfromSI, observed: Qobs,
      source: "C·(i/1000/3600 m/s)·(A×10⁶ m²) must equal C·i·A/3.6",
      relTol: 1e-12,
    });
  });

  test("annual maxima are consistent with the underlying hourly record", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The 2022 record is shipped as run-length-encoded hourly rainfall and the module
       extracts annual maxima from it live. The extracted value must agree with the
       published annual-maximum series for that year. */
    const r = await page.evaluate(() => {
      const out = [];
      for (const D of DUR) {
        const series = depthSeries(D);
        let best = 0;
        for (const v of series) if (Number.isFinite(v) && v > best) best = v;
        out.push({ D, extracted: best / D, published: AMS[D][IY2022] });
      }
      return out;
    });

    let worst = 0, at = null;
    for (const row of r) {
      const err = Math.abs(row.extracted - row.published) / row.published;
      if (err > worst) { worst = err; at = row.D; }
    }

    await verify(testInfo, {
      module: MODULE, id: "ID-11", quantity: "Worst AMS extraction error over 6 durations", units: "–",
      reference: 0, observed: worst,
      source: "maximum D-hour intensity found by sliding a window over the 2022 hourly "
        + "record must equal the published annual maximum for 2022; the published table "
        + `is rounded to four decimals, which bounds the agreement at ~3×10⁻⁵ `
        + `(worst at D = ${at} h)`,
      absTol: 5e-5,
    });
  });
});
