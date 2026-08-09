/* Shared helpers for the OpenHydroLab verification suite.

   Two ideas run through every physics test:

   1. The reference value is derived independently of the module — from a closed-form
      solution, a conservation identity, or a hand-checkable textbook calculation
      written out in `source`. A test that simply re-runs the module's own arithmetic
      and compares it to itself proves nothing.

   2. Every comparison is *recorded*, pass or fail, with its expected value, observed
      value and relative error. tools/validation-reporter.mjs collects those records
      into validation/results/validation-results.{json,md}, so the manuscript's
      validation tables are generated from the run rather than transcribed by hand.
*/
import { expect } from "@playwright/test";

export const G = 9.81;

/* Every module, with the expression that signals its physics is ready. Each keeps its
   physics in a classic script, so the whole model is reachable from page.evaluate()
   and can be verified at machine precision rather than at readout precision.
   channel_geometry additionally renders through a deferred ES module, so its readiness
   check waits for the rendering layer too. */
export const MODULES = {
  channel_geometry: { file: "channel_geometry.html", scope: "global", ready: () => typeof hydraulics === "function" && document.getElementById("o-A")?.textContent?.trim().length > 0 },
  manning_uniform_flow: { file: "manning_uniform_flow.html", scope: "global", ready: () => typeof solve === "function" },
  specific_energy: { file: "specific_energy.html", scope: "global", ready: () => typeof solve === "function" },
  hydraulic_jump: { file: "hydraulic_jump.html", scope: "global", ready: () => typeof solve === "function" },
  gvf_profiles: { file: "gvf_profiles.html", scope: "global", ready: () => typeof solve === "function" },
  storm_hydrograph: { file: "storm_hydrograph.html", scope: "global", ready: () => typeof simulate === "function" },
  unit_hydrograph: { file: "unit_hydrograph.html", scope: "global", ready: () => typeof recompute === "function" },
  idf_frequency: { file: "idf_frequency.html", scope: "global", ready: () => typeof iGum === "function" },
  hydrostatic_forces: { file: "hydrostatic_forces.html", scope: "global", ready: () => typeof solve === "function" },
  hydrostatic_forces_3d: { file: "hydrostatic_forces_3d.html", scope: "global", ready: () => typeof solve === "function" && typeof THREE === "object" },
};

export const MODULE_NAMES = Object.keys(MODULES);

/** Open a laboratory and wait until its physics layer has initialised. */
export async function openLab(page, name) {
  const mod = MODULES[name];
  if (!mod) throw new Error(`unknown module: ${name}`);
  await page.goto(`/animations/${mod.file}`, { waitUntil: "load" });
  await page.waitForFunction(mod.ready, undefined, { timeout: 15000 });
  return mod;
}

/**
 * Compare an observed value against an independently derived reference, record the
 * comparison for the validation dataset, and assert.
 *
 * Tolerances are stated per case and reflect what the numerics can honestly deliver:
 * closed-form identities are held to ~1e-9, quantities carried through a fixed-step
 * integration to a few parts in a thousand.
 */
export async function verify(testInfo, {
  module,
  id,
  quantity,
  units = "",
  reference,
  observed,
  source,
  relTol,
  absTol,
}) {
  const finite = Number.isFinite(reference) && Number.isFinite(observed);
  const absErr = finite ? Math.abs(observed - reference) : NaN;
  const relErr = finite && reference !== 0 ? absErr / Math.abs(reference) : NaN;

  let ok = finite;
  if (finite) {
    if (absTol !== undefined) ok = absErr <= absTol;
    else ok = (reference === 0 ? absErr : relErr) <= relTol;
  }

  await testInfo.attach("validation-case", {
    contentType: "application/json",
    body: JSON.stringify({
      module, id, quantity, units,
      reference, observed, absErr, relErr,
      source,
      tolerance: absTol !== undefined ? `abs ≤ ${absTol}` : `rel ≤ ${relTol}`,
      status: ok ? "pass" : "fail",
      engine: testInfo.project.name,
    }),
  });

  const detail = `${id} ${quantity}: expected ${reference} ${units}, observed ${observed} ${units} (rel err ${relErr.toExponential(2)})\n  reference: ${source}`;
  if (absTol !== undefined) expect(absErr, detail).toBeLessThanOrEqual(absTol);
  else if (reference === 0) expect(absErr, detail).toBeLessThanOrEqual(relTol);
  else expect(relErr, detail).toBeLessThanOrEqual(relTol);
}

/** Parse a leading number out of a DOM readout such as "5.76 m²" or "0.342". */
export function num(text) {
  const m = String(text).replace(/[−–]/g, "-").match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/);
  return m ? Number(m[0]) : NaN;
}

/* ---- reference implementations, written from the textbook definitions ---- */

/** Prismatic-channel section properties. Chow (1959), Table 2-1. */
export function section(shape, { b = 0, m = 0, d = 0 }, y) {
  if (shape === "rect") return { A: b * y, P: b + 2 * y, T: b };
  if (shape === "tri") return { A: m * y * y, P: 2 * y * Math.sqrt(1 + m * m), T: 2 * m * y };
  if (shape === "trap") {
    return { A: (b + m * y) * y, P: b + 2 * y * Math.sqrt(1 + m * m), T: b + 2 * m * y };
  }
  if (shape === "circ") {
    const r = d / 2;
    const th = 2 * Math.acos(Math.min(1, Math.max(-1, 1 - (2 * y) / d)));
    return { A: r * r * 0.5 * (th - Math.sin(th)), P: r * th, T: d * Math.sin(th / 2) };
  }
  throw new Error(`unknown shape: ${shape}`);
}

/** Manning discharge, SI: Q = (1/n) A R^(2/3) S^(1/2). */
export function manningQ(shape, dims, y, n, S) {
  const g = section(shape, dims, y);
  return (g.A * Math.pow(g.A / g.P, 2 / 3) * Math.sqrt(S)) / n;
}

/** Critical depth in a rectangular channel: y_c = (q²/g)^(1/3). */
export const ycRect = (q) => Math.cbrt((q * q) / G);

/** Bélanger sequent-depth ratio: y₂/y₁ = ½(√(1+8Fr₁²) − 1). */
export const belanger = (Fr) => 0.5 * (Math.sqrt(1 + 8 * Fr * Fr) - 1);

/** Gumbel reduced variate for return period T. */
export const gumbelY = (T) => -Math.log(-Math.log(1 - 1 / T));

/** Nash cascade of n=2 equal linear reservoirs, constant inflow I from t=0.
    Closed form while the inflow is still on: q(t) = I[1 − e^(−x)(1 + x)], x = t/k. */
export function nash2(I, k, t) {
  const x = t / k;
  return I * (1 - Math.exp(-x) * (1 + x));
}

/**
 * Peak of the same cascade for an inflow of duration D.
 *
 * Since dq₂/dt = (q₁ − q₂)/k and q₁ > q₂ throughout the storm, the second reservoir
 * is still filling when the rain stops: the peak falls *after* t = D, at the instant
 * the two outflows cross. For τ measured from the end of the inflow,
 *     q₁(τ) = q₁(D)·e^(−τ/k),   q₂(τ) = e^(−τ/k)[q₂(D) + q₁(D)·τ/k],
 * which are equal at τ* = k[1 − q₂(D)/q₁(D)].
 */
export function nash2Peak(I, k, D) {
  const q1D = I * (1 - Math.exp(-D / k));
  const q2D = nash2(I, k, D);
  const tau = k * (1 - q2D / q1D);
  return { qp: Math.exp(-tau / k) * (q2D + (q1D * tau) / k), t: D + tau, tau };
}
