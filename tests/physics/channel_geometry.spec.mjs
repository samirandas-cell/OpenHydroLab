/* Channel geometry and the Froude number.

   The physics layer is a classic script, so `hydraulics`, `state`, `PROFILES` and
   `profileIntegrals` are reachable directly and are verified against independently
   computed references at machine precision. A separate test then confirms that what
   the panel *displays* agrees with what the model computed — the readout precision is
   a property of the presentation, not of the physics, and the two are checked apart. */
import { test, expect } from "@playwright/test";
import { openLab, verify, num, section } from "../helpers/lab.mjs";

const MODULE = "channel_geometry";
const G = 9.81;
const NU = 1e-6;

const read = (page, id) => page.locator(`#${id}`).innerText();
const nums = (s) => (String(s).replace(/[−–]/g, "-").match(/-?\d+(?:\.\d+)?/g) || []).map(Number);

/** Evaluate the module's hydraulics() for an arbitrary section state. */
const solveFor = (page, s) => page.evaluate((st) => hydraulics(st), s);

test.describe(`${MODULE} — numerical verification`, () => {
  test("section properties match the textbook formulae for every shape", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Chow (1959) Table 2-1. The circular case is the one worth having: its properties
       come from the subtended angle θ = 2·acos(1 − 2y/d) rather than straight edges. */
    const cases = [
      { shape: "rect", dims: { b: 3 }, y: 1.2, label: "rectangular" },
      { shape: "trap", dims: { b: 3, m: 1.5 }, y: 1.2, label: "trapezoidal" },
      { shape: "tri", dims: { m: 1.5 }, y: 1.2, label: "triangular" },
      { shape: "circ", dims: { d: 2.5 }, y: 1.2, label: "circular, part full" },
      { shape: "circ", dims: { d: 2.5 }, y: 0.4, label: "circular, shallow" },
      { shape: "trap", dims: { b: 0.5, m: 3 }, y: 2.4, label: "trapezoidal, wide batter" },
    ];

    for (const c of cases) {
      const ref = section(c.shape, c.dims, c.y);
      const got = await solveFor(page, { shape: c.shape, ...c.dims, y: c.y, V: 1 });

      for (const [key, label, unit] of [
        ["A", "flow area", "m²"], ["P", "wetted perimeter", "m"], ["T", "top width", "m"],
      ]) {
        await verify(testInfo, {
          module: MODULE, id: `CG-01.${c.shape}${c.y}.${key}`,
          quantity: `${c.label} ${label} at y = ${c.y} m`, units: unit,
          reference: ref[key], observed: got[key],
          source: `Chow (1959) Table 2-1 for a ${c.label} section, `
            + `${JSON.stringify(c.dims)}, y = ${c.y} m`,
          relTol: 1e-12,
        });
      }
    }
  });

  test("derived quantities follow from the section properties", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Default state: trapezoid b = 3 m, m = 1.5, y = 1.2 m, V = 1 m/s.
         A = 5.760 m²   P = 7.32666 m   T = 6.600 m
         R = 0.786099 m D = 0.872727 m  c = 2.92600 m/s
         Fr = 0.341764  Q = 5.760 m³/s  Re = 7.86099×10⁵ */
    const dims = { b: 3, m: 1.5 };
    const y = 1.2, V = 1;
    const g = section("trap", dims, y);
    const R = g.A / g.P, D = g.A / g.T, c = Math.sqrt(G * D);
    const r = await solveFor(page, { shape: "trap", ...dims, y, V });

    const cases = [
      ["CG-02", "Hydraulic radius R", "m", R, r.R, "R = A/P = 5.76 / 7.32666"],
      ["CG-03", "Hydraulic depth D", "m", D, r.D, "D = A/T = 5.76 / 6.60"],
      ["CG-04", "Wave celerity c", "m/s", c, r.c, "c = √(gD), the shallow-water wave speed"],
      ["CG-05", "Froude number", "–", V / c, r.Fr, "Fr = V/√(gD)"],
      ["CG-06", "Discharge Q", "m³/s", V * g.A, r.Q, "Q = VA (continuity)"],
      ["CG-07", "Reynolds number", "–", (V * R) / NU, r.Re, "Re = VR/ν with ν = 1×10⁻⁶ m²/s at 20 °C"],
    ];

    for (const [id, quantity, units, reference, observed, source] of cases) {
      await verify(testInfo, {
        module: MODULE, id, quantity, units, reference, observed, source, relTol: 1e-12,
      });
    }
  });

  test("Froude number is consistent across shapes and velocities", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Fr = V/√(gA/T) has to hold whatever the section, and it is the number the whole
       module is built around, so it is swept rather than spot-checked. */
    const grid = [];
    for (const [shape, dims] of [["rect", { b: 3 }], ["trap", { b: 3, m: 1.5 }], ["tri", { m: 1.5 }], ["circ", { d: 2.5 }]]) {
      for (const y of [0.3, 0.8, 1.2, 2.0]) {
        for (const V of [0.4, 1, 2.5, 6]) grid.push({ shape, dims, y, V });
      }
    }

    /* One round trip for the whole grid — sixty-odd separate evaluate() calls are slow
       enough to trip the test timeout under parallel load. */
    const got = await page.evaluate((g) => g.map((c) => hydraulics({ shape: c.shape, ...c.dims, y: c.y, V: c.V }).Fr), grid);

    let worst = { err: 0, at: null };
    grid.forEach((c, i) => {
      const ref = section(c.shape, c.dims, c.y);
      const FrRef = c.V / Math.sqrt(G * (ref.A / ref.T));
      const err = Math.abs(got[i] - FrRef) / FrRef;
      if (err > worst.err) worst = { err, at: { shape: c.shape, y: c.y, V: c.V } };
    });
    const count = grid.length;

    await verify(testInfo, {
      module: MODULE, id: "CG-08",
      quantity: `Worst Froude-number error over ${count} states`, units: "–",
      reference: 0, observed: worst.err,
      source: "Fr = V/√(gA/T) over 4 shapes × y ∈ {0.3, 0.8, 1.2, 2.0} m × "
        + `V ∈ {0.4, 1, 2.5, 6} m/s (worst at ${JSON.stringify(worst.at)})`,
      absTol: 1e-12,
    });
  });

  test("velocity-distribution integrals reproduce their closed forms", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Simpson's rule over the assumed velocity profile must return a normalised mean of
       exactly 1 (the profile is scaled to the mean velocity) and the analytic α and β.
       The linear profile's α = 2, β = 4/3 is the standard worked example; the 1/7-power
       law gives α = 512/490, β = 64/63. */
    /* Tolerances differ by profile, and the reason is the interesting part.
       For the uniform and linear profiles the integrands are polynomials of degree ≤ 3,
       which Simpson's rule integrates exactly — so those must hold to machine precision.
       The 1/7-power profile is different: u = (8/7)ξ^(1/7) has an unbounded derivative
       at the bed, so Simpson's O(h⁴) error bound does not apply and convergence drops to
       roughly O(h^(1+1/7)). At n = 400 panels that leaves ~3×10⁻⁴, which is a property
       of the quadrature meeting a singular integrand, not an implementation error. */
    const TOL = { uniform: 1e-12, linear: 1e-12, power: 5e-4 };
    const CLOSED = {
      power: "α = 512/490, β = 64/63", linear: "α = 2, β = 4/3", uniform: "α = β = 1",
    };

    for (const name of ["power", "linear", "uniform"]) {
      const r = await page.evaluate((p) => ({
        num: profileIntegrals(p), exact: { alpha: PROFILES[p].alpha, beta: PROFILES[p].beta },
      }), name);

      const note = name === "power"
        ? "; Simpson convergence is limited to ~O(h^(8/7)) by the unbounded derivative of ξ^(1/7) at the bed"
        : "; the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly";

      await verify(testInfo, {
        module: MODULE, id: `CG-09.${name}.mean`,
        quantity: `${name} profile: normalised mean`, units: "–",
        reference: 1, observed: r.num.mean,
        source: `∫₀¹ u(ξ)dξ = 1 by construction — the profile is normalised by the mean velocity${note}`,
        absTol: TOL[name],
      });

      for (const k of ["beta", "alpha"]) {
        await verify(testInfo, {
          module: MODULE, id: `CG-09.${name}.${k}`,
          quantity: `${name} profile: ${k === "beta" ? "momentum β" : "energy α"} coefficient`,
          units: "–",
          reference: r.exact[k], observed: r.num[k],
          source: `Simpson integration of ∫₀¹ u(ξ)${k === "beta" ? "²" : "³"}dξ against the `
            + `closed form (${CLOSED[name]})${note}`,
          absTol: TOL[name],
        });
      }
    }
  });

  test("the panel displays what the model computed", async ({ page }, testInfo) => {
    await openLab(page, MODULE);

    /* Separate concern from the physics: the readouts round for display, so this checks
       agreement to half a unit in the last displayed digit — a presentation test, not a
       numerical one. It catches a readout wired to the wrong quantity. */
    const r = await page.evaluate(() => hydraulics(state));

    for (const [id, el, quantity, units, value, dp] of [
      ["CG-10", "o-A", "Flow area A", "m²", r.A, 2],
      ["CG-11", "o-P", "Wetted perimeter P", "m", r.P, 2],
      ["CG-12", "o-R", "Hydraulic radius R", "m", r.R, 3],
      ["CG-13", "o-T", "Top width T", "m", r.T, 2],
      ["CG-14", "o-D", "Hydraulic depth D", "m", r.D, 3],
      ["CG-15", "o-c", "Wave celerity c", "m/s", r.c, 2],
      ["CG-16", "o-Fr", "Froude number", "–", r.Fr, 3],
      ["CG-17", "o-Q", "Discharge Q", "m³/s", r.Q, 2],
    ]) {
      await verify(testInfo, {
        module: MODULE, id, quantity, units,
        reference: value, observed: num(await read(page, el)),
        source: `the panel readout must agree with hydraulics() to the ${dp} decimals it displays`,
        absTol: 0.5 * 10 ** -dp,
      });
    }

    /* And the coefficients shown as "numeric (analytic)" must agree with each other. */
    for (const [id, el, label] of [["CG-18", "o-beta", "β"], ["CG-19", "o-alpha", "α"]]) {
      const [numeric, analytic] = nums(await read(page, el));
      await verify(testInfo, {
        module: MODULE, id, quantity: `${label}: displayed numeric vs displayed analytic`,
        units: "–", reference: analytic, observed: numeric,
        source: `${label} by numerical integration must match the closed form printed beside it`,
        absTol: 0.0015,
      });
    }
  });

  test("shape switching updates the model and the panel together", async ({ page }) => {
    await openLab(page, MODULE);

    /* Drive the real control and require the global state, the physics and the readout
       to stay in step — the wiring test the direct-call tests above cannot cover. */
    for (const shape of ["rect", "tri", "circ", "trap"]) {
      await page.selectOption("#shape", shape);

      const r = await page.evaluate(() => ({ shape: state.shape, A: hydraulics(state).A }));
      expect(r.shape, "state must follow the select").toBe(shape);

      /* Auto-retrying: the readout is repainted in the frame loop, so polling rather
         than a fixed wait is what keeps this deterministic under parallel load. */
      await expect
        .poll(async () => num(await read(page, "o-A")),
          { message: `displayed area after switching to ${shape}`, timeout: 5000 })
        .toBeCloseTo(r.A, 2);
    }
  });

  test("flow regime label follows the Froude number", async ({ page }) => {
    await openLab(page, MODULE);

    /* The regime chip is what the student reads; it must never disagree with the number
       printed above it. Drive the real velocity slider across its range and compare the
       label against the Froude number the model computed for that same state. */
    const range = await page.evaluate(() => {
      const s = document.getElementById("s-V");
      return { min: Number(s.min), max: Number(s.max) };
    });

    const seen = new Set();
    for (let i = 0; i <= 6; i++) {
      const V = range.min + ((range.max - range.min) * i) / 6;
      await page.evaluate((v) => {
        const s = document.getElementById("s-V");
        s.value = String(v);
        s.dispatchEvent(new Event("input", { bubbles: true }));
      }, V);

      const Fr = await page.evaluate(() => hydraulics(state).Fr);

      /* "CRITICAL" is a substring of both other labels, so the near-critical case is
         anchored. The assertion auto-retries: the chip is repainted in the frame loop,
         and a fixed wait makes this flaky under parallel load. */
      const [label, pattern] = Math.abs(Fr - 1) < 0.05 ? ["CRITICAL", /^CRITICAL/]
        : Fr < 1 ? ["SUBCRITICAL", /SUBCRITICAL/] : ["SUPERCRITICAL", /SUPERCRITICAL/];

      await expect(
        page.locator("#regime"),
        `at V = ${V.toFixed(2)} m/s the model gives Fr = ${Fr.toFixed(3)}, so the chip should read ${label}`,
      ).toHaveText(pattern, { timeout: 5000 });
      seen.add(label);
    }

    /* The sweep is only meaningful if it actually crossed the transition. */
    expect([...seen].length, "the velocity range should span more than one flow regime")
      .toBeGreaterThan(1);
  });
});
