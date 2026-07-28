/* Hydraulic jump — sequent depths, momentum, and energy dissipation.

   The jump is the cleanest verification target in the suite: the sequent-depth
   relation is exact, specific force is conserved across the jump by construction,
   and the energy loss can be computed two independent ways that must agree. */
import { test, expect } from "@playwright/test";
import { openLab, verify, belanger, ycRect } from "../helpers/lab.mjs";

const MODULE = "hydraulic_jump";
const G = 9.81;

async function solveAt(page, y1, Fr) {
  return page.evaluate(({ a, b }) => {
    Object.assign(st, { y1: a, Fr: b });
    const r = solve();
    return {
      y1: r.y1, y2: r.y2, V1: r.V1, V2: r.V2, Fr2: r.Fr2, q: r.q,
      yc: r.yc, E1: r.E1, E2: r.E2, hL: r.hL, hL10: r.hL10,
      M1: r.M1, M2: r.M2, L: r.L, diss: r.diss,
    };
  }, { a: y1, b: Fr });
}

test.describe(`${MODULE} — numerical verification`, () => {
  test("sequent depth follows the Bélanger equation", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const y1 = 0.020, Fr = 5;
    const r = await solveAt(page, y1, Fr);

    await verify(testInfo, {
      module: MODULE, id: "HJ-01", quantity: "Sequent depth y₂", units: "m",
      reference: y1 * belanger(Fr), observed: r.y2,
      source: "Bélanger: y₂ = y₁·½(√(1+8Fr₁²) − 1) = 0.020 × ½(√201 − 1) = 0.131775 m",
      relTol: 1e-9,
    });

    /* V₁²/2g = Fr₁²y₁/2 exactly, so E₁ here is 0.020 + 0.250 = 0.270 m by hand. */
    await verify(testInfo, {
      module: MODULE, id: "HJ-02", quantity: "Approach specific energy E₁", units: "m",
      reference: y1 + (Fr * Fr * y1) / 2, observed: r.E1,
      source: "E₁ = y₁ + V₁²/2g = y₁(1 + Fr₁²/2) = 0.020 × (1 + 12.5) = 0.270 m",
      relTol: 1e-9,
    });
  });

  test("specific force is conserved across the jump", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await solveAt(page, 0.020, 5);

    /* The jump is derived from momentum, so M₁ = M₂ must hold to machine precision.
       Any drift here means the sequent depth and the specific-force curve have come
       apart — the single most important internal consistency check in the module. */
    await verify(testInfo, {
      module: MODULE, id: "HJ-03", quantity: "Momentum residual |M₁ − M₂| / M₁", units: "–",
      reference: 0, observed: Math.abs(r.M1 - r.M2) / r.M1,
      source: "specific force M = q²/(gy) + y²/2 must be equal either side of the jump",
      absTol: 1e-9,
    });
  });

  test("energy loss agrees between the energy and momentum routes", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await solveAt(page, 0.020, 5);

    /* Route 1: h_L = E₁ − E₂, straight from the two specific energies.
       Route 2: h_L = (y₂ − y₁)³ / (4y₁y₂), the closed form that drops out of
       combining momentum and energy. Independent derivations, same number. */
    await verify(testInfo, {
      module: MODULE, id: "HJ-04", quantity: "Energy loss, momentum closed form", units: "m",
      reference: r.hL, observed: r.hL10,
      source: "h_L = (y₂ − y₁)³/(4y₁y₂) must equal E₁ − E₂",
      relTol: 1e-9,
    });

    expect(r.hL, "a jump must dissipate energy").toBeGreaterThan(0);
  });

  test("downstream Froude number satisfies the inverse Bélanger relation", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await solveAt(page, 0.020, 5);

    /* Bélanger read backwards from the downstream side must return y₁. */
    await verify(testInfo, {
      module: MODULE, id: "HJ-05", quantity: "y₁ recovered from Fr₂", units: "m",
      reference: r.y1, observed: r.y2 * belanger(r.Fr2),
      source: "y₁ = y₂·½(√(1+8Fr₂²) − 1) — the jump relation is symmetric",
      relTol: 1e-8,
    });

    expect(r.Fr2, "flow must leave the jump subcritical").toBeLessThan(1);
  });

  test("critical depth lies between the sequent depths", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const r = await solveAt(page, 0.020, 5);

    await verify(testInfo, {
      module: MODULE, id: "HJ-06", quantity: "Critical depth y_c", units: "m",
      reference: ycRect(r.q), observed: r.yc,
      source: "y_c = (q²/g)^(1/3) with q = V₁y₁ = 0.044294 m²/s",
      relTol: 1e-9,
    });

    expect(r.y1).toBeLessThan(r.yc);
    expect(r.yc).toBeLessThan(r.y2);
  });

  test("momentum and energy identities hold across the whole Froude range", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* One Froude number proves nothing about the rest of the slider. */
    let worstM = 0, worstE = 0, atM = null, atE = null;
    for (const y1 of [0.010, 0.020, 0.040]) {
      for (const Fr of [1.5, 2, 3, 4.5, 6, 8, 10]) {
        const r = await solveAt(page, y1, Fr);
        const mRes = Math.abs(r.M1 - r.M2) / r.M1;
        const eRes = Math.abs(r.hL - r.hL10) / Math.abs(r.hL);
        if (mRes > worstM) { worstM = mRes; atM = { y1, Fr }; }
        if (eRes > worstE) { worstE = eRes; atE = { y1, Fr }; }
      }
    }

    await verify(testInfo, {
      module: MODULE, id: "HJ-07", quantity: "Worst momentum residual over 21 states", units: "–",
      reference: 0, observed: worstM,
      source: `y₁ ∈ {0.010, 0.020, 0.040} m × Fr₁ ∈ {1.5, 2, 3, 4.5, 6, 8, 10} `
        + `(worst at ${JSON.stringify(atM)})`,
      absTol: 1e-9,
    });

    await verify(testInfo, {
      module: MODULE, id: "HJ-08", quantity: "Worst energy-route disagreement over 21 states", units: "–",
      reference: 0, observed: worstE,
      source: `|(E₁−E₂) − (y₂−y₁)³/(4y₁y₂)| / h_L across the same grid `
        + `(worst at ${JSON.stringify(atE)})`,
      absTol: 1e-8,
    });
  });

  test("dissipation ratio grows monotonically with Froude number", async ({ page }) => {
    await openLab(page, MODULE);

    /* The teaching point of the module: stronger jumps waste proportionally more
       energy. If this ordering ever broke, the lecture claim would be wrong. */
    let prev = -Infinity;
    for (const Fr of [1.5, 2, 3, 4.5, 6, 8, 10]) {
      const r = await solveAt(page, 0.020, Fr);
      expect(r.diss, `dissipation must increase with Fr (at Fr = ${Fr})`).toBeGreaterThan(prev);
      prev = r.diss;
    }
  });
});
