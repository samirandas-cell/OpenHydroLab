/* Gradually varied flow — profile classification, RK4 integration, direct step.

   Two things get verified here that nothing else in the suite covers: that the
   integrated water-surface profile actually satisfies the energy equation it was
   derived from, and that two independent numerical methods — RK4 marching and the
   direct-step method — return the same reach length. */
import { test, expect } from "@playwright/test";
import { openLab, verify, manningQ, ycRect } from "../helpers/lab.mjs";

const MODULE = "gvf_profiles";

/* Reference case: rectangular channel b = 5 m, n = 0.015, Q = 10 m³/s, S₀ = 0.001.
   Hand values: q = 2 m²/s, y_c = (4/9.81)^(1/3) = 0.7417 m, y_n ≈ 1.125 m → mild bed.
   A control depth of 1.8 m sits above both, so the profile is an M1 backwater. */
const BASE = { shape: "rect", b: 5, n: 0.015, logQ: 1, y0: 1.8 };
const S0 = 0.001;

async function setup(page, over = {}) {
  return page.evaluate(({ base, s0, o }) => {
    Object.assign(st, base, { u: uOf(s0) }, o);
    const r = solve();
    return {
      yn: r.yn, yc: r.yc, Sc: r.Sc, cls: r.cls, L: r.L, note: r.note, hit: r.hit,
      yStart: r.yStart, yEnd: r.yEnd, Ix: r.Ix, dE: r.dE, eRatio: r.eRatio,
      dsL: r.ds.L, dsOk: r.ds.ok, N: r.N,
      SfAtNormal: Sf(r.yn), Fr2AtCritical: Fr2(r.yc), slopeUsed: S0(),
      dydxAtNormal: dydx(r.yn),
    };
  }, { base: BASE, s0: S0, o: over });
}

test.describe(`${MODULE} — numerical verification`, () => {
  test("normal and critical depths satisfy their defining conditions", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await setup(page);

    /* Normal depth is the depth at which the friction slope equals the bed slope. */
    await verify(testInfo, {
      module: MODULE, id: "GV-01", quantity: "Friction slope at normal depth", units: "–",
      reference: S0, observed: r.SfAtNormal,
      source: "definition of normal depth: S_f(y_n) = S₀ = 0.001",
      relTol: 1e-6,
    });

    /* Critical depth is where the Froude number reaches one. */
    await verify(testInfo, {
      module: MODULE, id: "GV-02", quantity: "Fr² at critical depth", units: "–",
      reference: 1, observed: r.Fr2AtCritical,
      source: "definition of critical depth: Q²T/(gA³) = 1",
      relTol: 1e-6,
    });

    /* And the depths themselves against independent calculations. */
    await verify(testInfo, {
      module: MODULE, id: "GV-03", quantity: "Critical depth", units: "m",
      reference: ycRect(10 / 5), observed: r.yc,
      source: "y_c = (q²/g)^(1/3) with q = 10/5 = 2 m²/s → 0.74166 m",
      relTol: 1e-6,
    });

    /* Independent Manning inversion by bisection, computed here in Node. */
    let lo = 1e-5, hi = 60;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (manningQ("rect", { b: 5 }, mid, 0.015, S0) < 10) lo = mid; else hi = mid;
    }
    await verify(testInfo, {
      module: MODULE, id: "GV-04", quantity: "Normal depth", units: "m",
      reference: (lo + hi) / 2, observed: r.yn,
      source: "independent bisection on (1/n)AR^(2/3)√S₀ = 10 m³/s, b = 5 m, n = 0.015",
      relTol: 1e-6,
    });

    /* dy/dx vanishes at normal depth — the surface is parallel to the bed there. */
    await verify(testInfo, {
      module: MODULE, id: "GV-05", quantity: "dy/dx at normal depth", units: "–",
      reference: 0, observed: r.dydxAtNormal,
      source: "the GVF numerator S₀ − S_f is zero at y = y_n",
      absTol: 1e-9,
    });
  });

  test("the integrated profile satisfies the GVF energy equation", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The GVF equation is dE/dx = S₀ − S_f. Integrating the right-hand side along the
       computed profile must reproduce the specific-energy change between its ends.
       This tests the RK4 marching itself, not just the algebra that feeds it. */
    for (const [label, y0] of [["M1 backwater", 1.8], ["M2 drawdown", 0.95], ["M3 jet", 0.35]]) {
      const r = await setup(page, { y0 });
      await verify(testInfo, {
        module: MODULE, id: `GV-06.${label.split(" ")[0]}`,
        quantity: `∫(S₀ − S_f)dx ÷ ΔE, ${label}`, units: "–",
        reference: 1, observed: r.eRatio,
        source: "the GVF equation dE/dx = S₀ − S_f must hold along the integrated profile",
        relTol: 5e-3,
      });
    }
  });

  test("direct step converges and agrees with RK4 marching", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* The direct-step method is what students compute by hand. Refining the number of
       depth increments must converge, and must converge to the same reach length the
       RK4 integration produces — two independent routes to one answer. */
    const conv = await page.evaluate(({ base, s0 }) => {
      Object.assign(st, base, { u: uOf(s0) });
      const r = solve();
      const lengths = [1, 2, 5, 10, 25, 50, 100, 250, 1000, 4000]
        .map((N) => ({ N, L: Math.abs(directStep(r.yStart, r.yEnd, N).L) }));
      return { lengths, rk4: r.L };
    }, { base: BASE, s0: S0 });

    const fine = conv.lengths.at(-1).L;
    const prev = conv.lengths.at(-2).L;

    await verify(testInfo, {
      module: MODULE, id: "GV-07", quantity: "Direct-step self-convergence (N = 1000 → 4000)", units: "–",
      reference: 0, observed: Math.abs(fine - prev) / fine,
      source: `reach length from the direct-step method must converge as the depth `
        + `increment is refined (${prev.toFixed(2)} m → ${fine.toFixed(2)} m)`,
      absTol: 5e-3,
    });

    await verify(testInfo, {
      module: MODULE, id: "GV-08", quantity: "Direct step vs RK4 reach length", units: "m",
      reference: conv.rk4, observed: fine,
      source: "the converged direct-step length must match the RK4-integrated profile length",
      relTol: 2e-2,
    });

    /* First-order convergence, checked in the asymptotic range only. At very coarse
       increments (N = 1, 2) the direct-step error is not yet monotone — the averaged
       friction slope is a poor estimate over a large depth change and the error can
       change sign — so monotonicity is required from N = 25 upward. */
    const errs = conv.lengths.map((x) => Math.abs(x.L - fine) / fine);
    const asymptotic = conv.lengths.findIndex((x) => x.N === 25);
    for (let i = asymptotic; i < conv.lengths.length - 1; i++) {
      expect(
        errs[i],
        `direct-step error must fall as N grows (N = ${conv.lengths[i].N}); `
        + `errors: ${conv.lengths.map((x, j) => `${x.N}:${errs[j].toExponential(2)}`).join(" ")}`,
      ).toBeLessThanOrEqual(errs[i - 1] + 1e-12);
    }
  });

  test("profile classification follows the depth ordering", async ({ page }) => {
    await openLab(page, MODULE);

    /* Mild bed: y₀ above both depths is M1, between them M2, below both M3. */
    for (const [y0, expected] of [[1.8, "M1"], [0.95, "M2"], [0.35, "M3"]]) {
      const r = await setup(page, { y0 });
      expect(r.cls.name, `y₀ = ${y0} m on a mild bed should be ${expected}`).toBe(expected);
    }

    /* Steep bed: raise S₀ above the critical slope and the zones relabel as S-curves. */
    const steep = await page.evaluate(({ base }) => {
      Object.assign(st, base, { u: uOf(0.02) });
      const r = solve();
      return { yn: r.yn, yc: r.yc, cls: r.cls };
    }, { base: BASE });

    expect(steep.yn, "S₀ = 0.02 must give y_n < y_c").toBeLessThan(steep.yc);
    expect(steep.cls.L, "the bed should classify as steep").toBe("S");
  });

  test("horizontal and adverse beds have no normal depth", async ({ page }) => {
    await openLab(page, MODULE);

    /* On a horizontal or adverse bed uniform flow cannot exist, so y_n must be
       reported as infinite rather than silently returning a number. */
    for (const u of [0, -130.5]) {
      const r = await page.evaluate(({ base, uu }) => {
        Object.assign(st, base, { u: uu, y0: 1.2 });
        const res = solve();
        return { yn: res.yn, cls: res.cls };
      }, { base: BASE, uu: u });

      expect(Number.isFinite(r.yn), `u = ${u} should have no normal depth`).toBe(false);
      expect(["H", "A"]).toContain(r.cls.L);
    }
  });
});
