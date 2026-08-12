/* Hydrostatic forces on submerged surfaces — plane and curved.

   Every reference below is written out here from the textbook definitions, so a
   comparison is against an independently derived number rather than against the
   module re-running its own arithmetic.

   The plane-surface references use the fact that the pressure prism on a rectangle
   is a trapezoid, whose centroid is known in closed form:

       F_R = γ h_c A                                       (Munson Eq. 2.18)
       s_R = L (2 p_bot + p_top) / (3 (p_bot + p_top))      centroid of a trapezoid

   The second expression never mentions I_xc, so it is a genuinely independent route
   to the centre of pressure that the module's y_c + I_xc/(y_cA) must reproduce.

   The curved-surface references integrate the radial traction on a circular arc:

       F_x = γ (h_O + R/2) R b            horizontal, on the vertical projection
       F_v = γ b (h_O R + πR²/4)          weight of the prism above the arc
       x̄   = (h_O R²/2 + R³/3) / (h_O R + πR²/4)
       M_O = 0                            identically, the traction being radial
*/
import { test } from "@playwright/test";
import { openLab, verify } from "../helpers/lab.mjs";

const MODULE = "hydrostatic_forces";
const G = 9.81;
const RHO = 1000;
const GAMMA = RHO * G;

/** Set the plane surface and read the module's solution at machine precision. */
const plane = (page, cfg) => page.evaluate((c) => {
  Object.assign(st, { mode: "plane", rho: 1000, ...c });
  clampState();
  const R = solve();
  return { F: R.F, hc: R.hc, A: R.A, dy: R.dy, sR: R.sR, hR: R.hR, yc: R.yc, yR: R.yR,
           pTop: R.pTop, pBot: R.pBot, Ixc: R.Ixc, fChk: R.fChk, sChk: R.sChk };
}, cfg);

const curved = (page, cfg) => page.evaluate((c) => {
  Object.assign(st, { mode: "curved", rho: 1000, above: false, ...c });
  clampState();
  const R = solve();
  return { Fx: R.Fx, Fv: R.Fv, FR: R.FR, alpha: R.alpha, armX: R.armX, xbar: R.xbar,
           V: R.V, Mnet: R.Mnet, Mfx: R.Mfx, Mfv: R.Mfv, fxChk: R.fxChk, fvChk: R.fvChk };
}, cfg);

/* Centroid of the trapezoidal pressure prism, measured from the upper edge. */
const sRtrap = (L, pTop, pBot) => (L * (2 * pBot + pTop)) / (3 * (pBot + pTop));

test.describe(`${MODULE} — numerical verification`, () => {

  test("vertical plate breaking the surface: F = ½γL²b and the CP sits at 2L/3", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const L = 2.5, b = 1.0;
    const r = await plane(page, { theta: 90, L, b, hTop: 0 });

    /* Triangular prism: the mean pressure is ½γL, so F = ½γL·(Lb). */
    await verify(testInfo, {
      module: MODULE, id: "plane-vertical-F", quantity: "resultant force", units: "N",
      reference: 0.5 * GAMMA * L * L * b, observed: r.F, relTol: 1e-12,
      source: "F = γ h_c A with h_c = L/2 for a plate whose upper edge is at the free surface "
            + "(Munson Eq. 2.18); = ½γL²b = 30656.25 N for L = 2.5 m, b = 1 m",
    });
    /* The centroid of a triangle lies at two-thirds of its height — no I_xc involved. */
    await verify(testInfo, {
      module: MODULE, id: "plane-vertical-CP", quantity: "centre of pressure from the upper edge",
      units: "m", reference: (2 * L) / 3, observed: r.sR, relTol: 1e-12,
      source: "the pressure prism is a triangle, so its centroid is at 2L/3 = 1.6667 m",
    });
  });

  test("inclined plate: the centre of pressure is the centroid of the trapezoidal prism", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const L = 3, b = 2, hTop = 2, theta = 30;
    const r = await plane(page, { theta, L, b, hTop });

    const hc = hTop + (L / 2) * Math.sin((theta * Math.PI) / 180);
    await verify(testInfo, {
      module: MODULE, id: "plane-incl-F", quantity: "resultant force", units: "N",
      reference: GAMMA * hc * L * b, observed: r.F, relTol: 1e-12,
      source: "F = γ h_c A, h_c = h_top + (L/2) sinθ = 2.75 m, A = 6 m² → 161.865 kN "
            + "(tutorial gate AB hinged 2 m below the surface)",
    });
    await verify(testInfo, {
      module: MODULE, id: "plane-incl-CP", quantity: "centre of pressure from the upper edge",
      units: "m",
      reference: sRtrap(L, GAMMA * hTop, GAMMA * (hTop + L * Math.sin((theta * Math.PI) / 180))),
      observed: r.sR, relTol: 1e-12,
      source: "centroid of the trapezoidal pressure prism, s_R = L(2p_bot + p_top)/(3(p_bot + p_top)) "
            + "— an independent route to the CP that never uses I_xc",
    });
  });

  test("45° dam face, 10 m deep, per metre width", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const H = 10, theta = 45, L = H / Math.sin((theta * Math.PI) / 180), b = 1;
    const r = await plane(page, { theta, L, b, hTop: 0 });

    await verify(testInfo, {
      module: MODULE, id: "plane-dam45-F", quantity: "resultant force per metre", units: "N/m",
      reference: 0.5 * GAMMA * H * L * b, observed: r.F, relTol: 1e-12,
      source: "F = γ(H/2)(L·b) with wetted slant L = H/sin45° = 14.142 m → 693.66 kN/m "
            + "(worked example: rockfill dam, reservoir depth 10 m)",
    });
    await verify(testInfo, {
      module: MODULE, id: "plane-dam45-CP", quantity: "CP along the face", units: "m",
      reference: (2 * L) / 3, observed: r.yR, relTol: 1e-12,
      source: "upper edge at the free surface, so y_R = 2L/3 = 9.428 m along the face "
            + "— independent of the inclination",
    });
  });

  test("horizontal plate: uniform pressure puts the CP on the centroid", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const L = 2.5, b = 1, h = 2;
    const r = await plane(page, { theta: 0, L, b, hTop: h });

    await verify(testInfo, {
      module: MODULE, id: "plane-horiz-F", quantity: "resultant force", units: "N",
      reference: GAMMA * h * L * b, observed: r.F, relTol: 1e-12,
      source: "uniform pressure p = ρgh = 19.62 kPa over 2.5 m² → 49.05 kN "
            + "(worked example: plate lying flat 2 m down)",
    });
    await verify(testInfo, {
      module: MODULE, id: "plane-horiz-dy", quantity: "shift of the CP below the centroid",
      units: "m", reference: 0, observed: r.dy, relTol: 1e-15,
      source: "uniform pressure has no first moment about the centroid, so Δy = 0 exactly; "
            + "the module must reach this limit without dividing by sinθ",
    });
  });

  test("Δy varies as 1/h_c, so the CP migrates onto the centroid with depth", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const L = 3, b = 2, theta = 90;
    const shallow = await plane(page, { theta, L, b, hTop: 1 });
    const deep = await plane(page, { theta, L, b, hTop: 20 });

    /* Δy = L² sinθ /(12 h_c), so Δy·h_c is a constant of the geometry alone. */
    await verify(testInfo, {
      module: MODULE, id: "plane-dy-invariant", quantity: "Δy·h_c at 20 m ÷ at 1 m", units: "—",
      reference: 1, observed: (deep.dy * deep.hc) / (shallow.dy * shallow.hc), relTol: 1e-12,
      source: "Δy = I_xc/(y_cA) = L² sinθ/(12 h_c), so the product Δy·h_c depends only on L and θ; "
            + "the ratio between any two submergences is therefore exactly 1",
    });
  });

  test("radial gate: components, lines of action, and zero moment about the pivot", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const R = 2, hO = 3, b = 2;
    const r = await curved(page, { R, hO, span: 90, b });

    const Fx = GAMMA * (hO + R / 2) * R * b;
    const V = b * (hO * R + (Math.PI * R * R) / 4);
    const Fv = GAMMA * V;
    const xbar = ((hO * R * R) / 2 + (R * R * R) / 3) / (hO * R + (Math.PI * R * R) / 4);
    const armX = R / 2 + (R * R) / (12 * (hO + R / 2));

    await verify(testInfo, {
      module: MODULE, id: "curved-Fx", quantity: "horizontal component", units: "N",
      reference: Fx, observed: r.Fx, relTol: 1e-12,
      source: "F_x = γ h_c A_proj on the vertical projection, h_c = h_O + R/2 = 4 m, "
            + "A_proj = R·b = 4 m² → 156.96 kN (tutorial radial gate)",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-Fx-arm", quantity: "line of action of F_x below the pivot",
      units: "m", reference: armX, observed: r.armX, relTol: 1e-12,
      source: "R/2 + I_xc/(y_cA) for the vertical projection = 1 + 2²/(12·4) = 1.08333 m",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-Fv", quantity: "vertical component", units: "N",
      reference: Fv, observed: r.Fv, relTol: 1e-12,
      source: "F_v = γV with V = b(h_O R + πR²/4) = 18.2832 m³, the prism between the arc "
            + "and the free-surface level → 179.36 kN",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-xbar", quantity: "line of action of F_v from the pivot",
      units: "m", reference: xbar, observed: r.xbar, relTol: 1e-12,
      source: "centroid of that prism: (h_O R²/2 + R³/3)/(h_O R + πR²/4) = 0.9480 m",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-FR", quantity: "resultant", units: "N",
      reference: Math.hypot(Fx, Fv), observed: r.FR, relTol: 1e-12,
      source: "F_R = √(F_x² + F_v²)",
    });
    /* The traction on a circular arc is radial, so r × p n = 0 pointwise about the
       centre of curvature. The two component moments are large and must cancel. */
    await verify(testInfo, {
      module: MODULE, id: "curved-zero-moment", quantity: "net moment ÷ (F_R·R)", units: "—",
      reference: 0, observed: Math.abs(r.Mnet) / (r.FR * R), relTol: 1e-12,
      source: "pressure on a circular arc acts along the radius, so it has no moment about "
            + "the centre of curvature: F_v x̄ − F_x·arm ≡ 0 for every head, radius and span",
    });
  });

  test("quadrant gate with the pivot at the free surface: x̄ = 4R/3π", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    const R = 1, b = 3;
    const r = await curved(page, { R, hO: 0, span: 90, b });

    await verify(testInfo, {
      module: MODULE, id: "curved-quadrant-xbar", quantity: "line of action of F_v", units: "m",
      reference: (4 * R) / (3 * Math.PI), observed: r.xbar, relTol: 1e-12,
      source: "with h_O = 0 the prism is a quarter disc, whose centroid is 4R/3π = 0.4244 m "
            + "from the centre (worked example: quadrant gate, R = 1 m, 3 m wide)",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-quadrant-Fv", quantity: "vertical component", units: "N",
      reference: (GAMMA * Math.PI * R * R * b) / 4, observed: r.Fv, relTol: 1e-12,
      source: "F_v = γ·(πR²/4)·b = weight of the quarter-cylinder of water → 23.11 kN",
    });
  });

  test("zero moment about the pivot survives an arbitrary arc span", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    for (const span of [22.5, 45, 67.5]) {
      const r = await curved(page, { R: 2.5, hO: 4, span, b: 1.5 });
      await verify(testInfo, {
        module: MODULE, id: `curved-zero-moment-span${span}`,
        quantity: `net moment ÷ (F_R·R) at a ${span}° arc`, units: "—",
        reference: 0, observed: Math.abs(r.Mnet) / (r.FR * 2.5), relTol: 1e-12,
        source: "the radial-traction identity is a property of circular curvature, not of the "
              + "quadrant: it must hold for any span",
      });
    }
  });

  test("the resultant AS DRAWN passes through the pivot, both fluid sides", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    /* The numbers being right is not the same claim as the arrow lying on the right line.
       `DRAWN` records the endpoints the last frame actually used, so this measures the
       drawing rather than recomputing what the drawing ought to have been. */
    for (const above of [false, true]) {
      for (const cfg of [{ R: 2, hO: 3, span: 90, b: 2 }, { R: 2.5, hO: 5, span: 40, b: 1.2 }]) {
        const miss = await page.evaluate(({ c, ab }) => {
          Object.assign(st, { mode: "curved", rho: 1000, above: ab, ...c });
          clampState();
          const R = solve();
          drawCurvedScene(VP.scene, R);              // draw one frame and read what it drew
          const d = DRAWN.curved;
          const vx = d.x1 - d.x0, vy = d.y1 - d.y0, L = Math.hypot(vx, vy);
          const ux = vx / L, uy = vy / L;
          const wx = d.ox - d.x0, wy = d.oy - d.y0, t = wx * ux + wy * uy;
          const px = Math.hypot(wx - t * ux, wy - t * uy);     // perpendicular miss, pixels
          return px / (d.pxPerM * d.R);                        // ÷R, dimensionless
        }, { c: cfg, ab: above });

        await verify(testInfo, {
          module: MODULE,
          id: `drawn-resultant-through-O-${above ? "above" : "outside"}-R${cfg.R}-s${cfg.span}`,
          quantity: `perpendicular distance from O to the drawn resultant ÷ R `
                  + `(fluid ${above ? "above" : "outside"} the arc)`,
          units: "—", reference: 0, observed: miss, relTol: 1e-9,
          source: "the components act on their own lines of action, which meet at P*; the "
                + "resultant of two forces passes through their intersection, and on a circular "
                + "arc that line also contains the centre of curvature — so the drawn arrow "
                + "must miss O by nothing, whichever side the fluid is on",
        });
      }
    }
  });

  test("the resultant AS DRAWN arrives normal to the plate, at the centre of pressure", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    for (const cfg of [{ theta: 30, L: 3, b: 2, hTop: 2 }, { theta: 0, L: 2.5, b: 1, hTop: 2 },
                       { theta: 90, L: 2.5, b: 1, hTop: 0 }]) {
      const r = await page.evaluate((c) => {
        Object.assign(st, { mode: "plane", rho: 1000, ...c });
        clampState();
        const R = solve();
        drawPlaneScene(VP.scene, R);
        const d = DRAWN.plane;
        /* the arrow must be perpendicular to A→B and end on the centre of pressure */
        const px = d.x1 - d.x0, py = d.y1 - d.y0, pl = Math.hypot(px, py);
        const tx = d.bx - d.ax, ty = d.by - d.ay, tl = Math.hypot(tx, ty);
        const dotUnit = tl > 0 ? Math.abs((px * tx + py * ty) / (pl * tl)) : 0;
        /* and it must arrive from the WET side. The fluid lies on the +n side, where
           n = (sinθ, −cosθ) in these screen axes (x right, y = depth downward); the test
           builds n from its own θ rather than from anything the module computed, so a sign
           slip in the drawing cannot cancel against a matching slip in the reference. */
        const th = (c.theta * Math.PI) / 180;
        const nx = Math.sin(th), ny = -Math.cos(th);
        const signed = ((d.x0 - d.cpx) * nx + (d.y0 - d.cpy) * ny) / d.pxPerM;
        return { dotUnit, headOffCP: Math.hypot(d.x1 - d.cpx, d.y1 - d.cpy) / d.pxPerM,
                 signedStandoff: signed };
      }, cfg);

      await verify(testInfo, {
        module: MODULE, id: `drawn-plane-normal-th${cfg.theta}`,
        quantity: `|cos| between the drawn resultant and the plate at θ = ${cfg.theta}°`,
        units: "—", reference: 0, observed: r.dotUnit, relTol: 1e-9,
        source: "all the differential forces are perpendicular to the surface, so the resultant "
              + "must be too (Munson §2.8) — the drawn arrow must be exactly normal to A→B",
      });
      await verify(testInfo, {
        module: MODULE, id: `drawn-plane-head-at-CP-th${cfg.theta}`,
        quantity: `distance from the drawn arrowhead to the centre of pressure at θ = ${cfg.theta}°`,
        units: "m", reference: 0, observed: r.headOffCP, absTol: 1e-9,
        source: "the resultant acts at the centre of pressure, so that is where the arrow ends",
      });
      /* Signed, so drawing the arrow from the dry side flips it negative and fails by 2×
         its own length. An unsigned distance would be identical either way. */
      await verify(testInfo, {
        module: MODULE, id: `drawn-plane-from-wet-side-th${cfg.theta}`,
        quantity: `signed standoff of the arrow tail along the wet-side normal at θ = ${cfg.theta}°`,
        units: "m", reference: Math.abs(r.signedStandoff), observed: r.signedStandoff,
        absTol: 1e-9,
        source: "the fluid pushes ONTO the surface, so the arrow must start clear of the plate "
              + "on the wetted (+n) side and point inward — drawing it from the dry side "
              + "reverses the physics while still looking like a plausible annotation",
      });
    }
  });

  test("the module's own quadrature agrees with its closed forms", async ({ page }, testInfo) => {
    await openLab(page, MODULE);
    /* The module integrates p over 4000 strips independently of the formulas it displays
       and shows the ratio on screen. That check must itself be checked. */
    const p = await plane(page, { theta: 37, L: 4.2, b: 1.7, hTop: 1.3 });
    await verify(testInfo, {
      module: MODULE, id: "plane-selfcheck-F", quantity: "∮p dA ÷ γh_cA", units: "—",
      reference: 1, observed: p.fChk, relTol: 1e-6,
      source: "midpoint quadrature of ∮p dA over 4000 strips against γh_cA",
    });
    await verify(testInfo, {
      module: MODULE, id: "plane-selfcheck-CP", quantity: "∮s p dA / ∮p dA ÷ s_R", units: "—",
      reference: 1, observed: p.sChk, relTol: 1e-6,
      source: "first moment of the same quadrature against y_c + I_xc/(y_cA)",
    });
    const c = await curved(page, { R: 1.8, hO: 2.4, span: 72, b: 3.1 });
    await verify(testInfo, {
      module: MODULE, id: "curved-selfcheck-Fx", quantity: "∮p n_x dA ÷ γh_cA_proj", units: "—",
      reference: 1, observed: c.fxChk, relTol: 1e-6,
      source: "quadrature of the radial traction over 4000 arc elements",
    });
    await verify(testInfo, {
      module: MODULE, id: "curved-selfcheck-Fv", quantity: "∮p n_z dA ÷ γV", units: "—",
      reference: 1, observed: c.fvChk, relTol: 1e-6,
      source: "the same quadrature, vertical component, against the prism weight",
    });
  });
});
