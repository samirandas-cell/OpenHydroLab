/* Manning uniform flow — normal depth, critical depth, and the critical slope.

   Normal depth is found by bisection inside the module, so the strongest test is a
   round trip: compute a discharge from a known depth with an independent Manning
   implementation, hand that discharge back, and require the original depth to return. */
import { test, expect } from "@playwright/test";
import { openLab, verify, section, manningQ, ycRect } from "../helpers/lab.mjs";

const MODULE = "manning_uniform_flow";
const G = 9.81;

async function solveWith(page, cfg) {
  return page.evaluate((c) => {
    Object.assign(st, c.st, { logS: Math.log10(c.S) });
    const r = solve();
    const gc = geom(r.yc);
    return {
      ...r,
      qAtNormal: manningQ(r.yn, r.s),
      qAtCriticalSlope: manningQ(r.yc, r.Sc),
      FrCritical: (st.Q / gc.A) / Math.sqrt(9.81 * (gc.A / gc.T)),
      geomNormal: geom(r.yn),
    };
  }, cfg);
}

test.describe(`${MODULE} — numerical verification`, () => {
  test("normal depth inverts the Manning equation", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Textbook forward calculation, done here rather than in the page:
       rectangular channel b = 5 m, y = 2 m, n = 0.015, S₀ = 0.001
       → A = 10 m², P = 9 m, R = 1.1111 m, Q = (1/n)AR^(2/3)√S = 22.615 m³/s.
       Feeding that Q back must return y = 2.000 m. */
    const dims = { b: 5 };
    const yTrue = 2.0, n = 0.015, S = 0.001;
    const Q = manningQ("rect", dims, yTrue, n, S);

    const r = await solveWith(page, { st: { shape: "rect", b: 5, n, Q }, S });

    await verify(testInfo, {
      module: MODULE, id: "MN-01", quantity: "Normal depth (round trip)", units: "m",
      reference: yTrue, observed: r.yn,
      source: `Q = (1/n)AR^(2/3)√S₀ = ${Q.toFixed(4)} m³/s computed independently at `
        + "y = 2.000 m in a 5 m rectangular channel, n = 0.015, S₀ = 0.001",
      relTol: 1e-6,
    });

    const g = section("rect", dims, yTrue);
    await verify(testInfo, {
      module: MODULE, id: "MN-02", quantity: "Flow area at normal depth", units: "m²",
      reference: g.A, observed: r.A,
      source: "A = b·y = 5 × 2 = 10 m²",
      relTol: 1e-6,
    });

    await verify(testInfo, {
      module: MODULE, id: "MN-03", quantity: "Hydraulic radius at normal depth", units: "m",
      reference: g.A / g.P, observed: r.R,
      source: "R = A/P = 10 / (5 + 2×2) = 1.11111 m",
      relTol: 1e-6,
    });
  });

  test("critical depth satisfies Fr = 1", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const Q = manningQ("rect", { b: 5 }, 2.0, 0.015, 0.001);
    const r = await solveWith(page, { st: { shape: "rect", b: 5, n: 0.015, Q }, S: 0.001 });

    await verify(testInfo, {
      module: MODULE, id: "MN-04", quantity: "Critical depth", units: "m",
      reference: ycRect(Q / 5), observed: r.yc,
      source: `y_c = (q²/g)^(1/3) with q = Q/b = ${(Q / 5).toFixed(4)} m²/s`,
      relTol: 1e-6,
    });

    /* Independent of the formula used to find it, the depth labelled critical must
       carry Fr = 1. */
    await verify(testInfo, {
      module: MODULE, id: "MN-05", quantity: "Froude number at critical depth", units: "–",
      reference: 1, observed: r.FrCritical,
      source: "by definition Fr = V/√(gD) = 1 at y = y_c",
      relTol: 1e-6,
    });
  });

  test("critical slope reproduces the design discharge at critical depth", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const Q = manningQ("rect", { b: 5 }, 2.0, 0.015, 0.001);
    const r = await solveWith(page, { st: { shape: "rect", b: 5, n: 0.015, Q }, S: 0.001 });

    /* S_c is defined as the slope at which uniform flow occurs *at* critical depth.
       So Manning evaluated at (y_c, S_c) must return the same Q. */
    await verify(testInfo, {
      module: MODULE, id: "MN-06", quantity: "Q from Manning at (y_c, S_c)", units: "m³/s",
      reference: Q, observed: r.qAtCriticalSlope,
      source: "definition of the critical slope: uniform flow at y = y_c carries the same Q",
      relTol: 1e-6,
    });

    await verify(testInfo, {
      module: MODULE, id: "MN-07", quantity: "Q from Manning at (y_n, S₀)", units: "m³/s",
      reference: Q, observed: r.qAtNormal,
      source: "definition of normal depth: Manning at (y_n, S₀) returns the design Q",
      relTol: 1e-6,
    });
  });

  test("trapezoidal and triangular sections match the textbook formulae", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    const cases = [
      { shape: "trap", dims: { b: 2.5, m: 2 }, y: 1.4 },
      { shape: "tri", dims: { m: 2 }, y: 1.1 },
      { shape: "rect", dims: { b: 4 }, y: 0.8 },
    ];

    for (const c of cases) {
      const ref = section(c.shape, c.dims, c.y);
      const got = await page.evaluate(({ shape, dims, y }) => {
        Object.assign(st, { shape, ...dims });
        return geom(y);
      }, c);

      for (const [key, label, unit] of [["A", "area", "m²"], ["P", "wetted perimeter", "m"], ["T", "top width", "m"]]) {
        await verify(testInfo, {
          module: MODULE, id: `MN-08.${c.shape}.${key}`,
          quantity: `${c.shape} ${label} at y = ${c.y} m`, units: unit,
          reference: ref[key], observed: got[key],
          source: `Chow (1959) Table 2-1 section properties for a ${c.shape} channel, `
            + `${JSON.stringify(c.dims)}, y = ${c.y} m`,
          relTol: 1e-9,
        });
      }
    }
  });

  test("depth inversion is exact across shapes, slopes and roughnesses", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Sweep the controls and require the round trip to close everywhere. */
    let worst = { err: 0, at: null };
    let count = 0;
    for (const [shape, dims] of [["rect", { b: 5 }], ["trap", { b: 2.5, m: 2 }], ["tri", { m: 2 }]]) {
      for (const S of [1e-4, 1e-3, 1e-2]) {
        for (const n of [0.011, 0.015, 0.030]) {
          for (const y of [0.5, 1.5, 3.0]) {
            const Q = manningQ(shape, dims, y, n, S);
            const r = await solveWith(page, { st: { shape, ...dims, n, Q }, S });
            const err = Math.abs(r.yn - y) / y;
            count++;
            if (err > worst.err) worst = { err, at: { shape, S, n, y } };
          }
        }
      }
    }

    await verify(testInfo, {
      module: MODULE, id: "MN-09",
      quantity: `Worst normal-depth round-trip error over ${count} states`, units: "–",
      reference: 0, observed: worst.err,
      source: `3 shapes × S₀ ∈ {1e-4, 1e-3, 1e-2} × n ∈ {0.011, 0.015, 0.030} × `
        + `y ∈ {0.5, 1.5, 3.0} m (worst at ${JSON.stringify(worst.at)})`,
      absTol: 1e-6,
    });
  });

  test("slope classification agrees with the depth ordering", async ({ page }) => {
    await openLab(page, MODULE);

    /* A mild slope must produce y_n > y_c and a steep slope y_n < y_c. The label the
       student reads has to follow the numbers, not a separate rule of thumb. */
    for (const S of [1e-4, 1e-3, 5e-3, 2e-2, 5e-2]) {
      const r = await solveWith(page, { st: { shape: "rect", b: 5, n: 0.015, Q: 22.6 }, S });
      if (S < r.Sc * 0.95) expect(r.yn, `S₀ = ${S} should be mild`).toBeGreaterThan(r.yc);
      if (S > r.Sc * 1.05) expect(r.yn, `S₀ = ${S} should be steep`).toBeLessThan(r.yc);
    }
  });
});
