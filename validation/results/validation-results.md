# OpenHydroLab — numerical validation results

Generated 2026-08-12T12:53:43.023Z · engines: chromium, firefox, webkit

582 recorded comparisons across 10 modules and 3 browser engine(s); 0 failing.

Each row compares a value produced by the laboratory against a reference derived independently of it — a closed-form solution, a conservation identity, or a hand-checkable textbook calculation. Errors are the worst observed across engines.

## channel_geometry

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| CG-01.circ0.4.A | circular, shallow flow area at y = 0.4 m | 0.506952 m² | 0.506952 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.circ0.4.P | circular, shallow wetted perimeter at y = 0.4 m | 2.05758 m | 2.05758 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.circ0.4.T | circular, shallow top width at y = 0.4 m | 1.83303 m | 1.83303 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.circ1.2.A | circular, part full flow area at y = 1.2 m | 2.3294 m² | 2.3294 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.circ1.2.P | circular, part full wetted perimeter at y = 1.2 m | 3.82696 m | 3.82696 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.circ1.2.T | circular, part full top width at y = 1.2 m | 2.498 m | 2.498 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.rect1.2.A | rectangular flow area at y = 1.2 m | 3.6 m² | 3.6 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.rect1.2.P | rectangular wetted perimeter at y = 1.2 m | 5.4 m | 5.4 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.rect1.2.T | rectangular top width at y = 1.2 m | 3 m | 3 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap1.2.A | trapezoidal flow area at y = 1.2 m | 5.76 m² | 5.76 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap1.2.P | trapezoidal wetted perimeter at y = 1.2 m | 7.32666 m | 7.32666 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap1.2.T | trapezoidal top width at y = 1.2 m | 6.6 m | 6.6 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap2.4.A | trapezoidal, wide batter flow area at y = 2.4 m | 18.48 m² | 18.48 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap2.4.P | trapezoidal, wide batter wetted perimeter at y = 2.4 m | 15.6789 m | 15.6789 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.trap2.4.T | trapezoidal, wide batter top width at y = 2.4 m | 14.9 m | 14.9 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.tri1.2.A | triangular flow area at y = 1.2 m | 2.16 m² | 2.16 m² | 0 | rel ≤ 1e-12 | Pass |
| CG-01.tri1.2.P | triangular wetted perimeter at y = 1.2 m | 4.32666 m | 4.32666 m | 0 | rel ≤ 1e-12 | Pass |
| CG-01.tri1.2.T | triangular top width at y = 1.2 m | 3.6 m | 3.6 m | 0 | rel ≤ 1e-12 | Pass |
| CG-02 | Hydraulic radius R | 0.78617 m | 0.78617 m | 0 | rel ≤ 1e-12 | Pass |
| CG-03 | Hydraulic depth D | 0.872727 m | 0.872727 m | 0 | rel ≤ 1e-12 | Pass |
| CG-04 | Wave celerity c | 2.926 m/s | 2.926 m/s | 0 | rel ≤ 1e-12 | Pass |
| CG-05 | Froude number | 0.341764 – | 0.341764 – | 0 | rel ≤ 1e-12 | Pass |
| CG-06 | Discharge Q | 5.76 m³/s | 5.76 m³/s | 0 | rel ≤ 1e-12 | Pass |
| CG-07 | Reynolds number | 786170 – | 786170 – | 0 | rel ≤ 1e-12 | Pass |
| CG-08 | Worst Froude-number error over 64 states | 0 – | 0 – | — | abs ≤ 1e-12 | Pass |
| CG-09.linear.alpha | linear profile: energy α coefficient | 2 – | 2 – | < 1e-9 | abs ≤ 1e-12 | Pass |
| CG-09.linear.beta | linear profile: momentum β coefficient | 1.33333 – | 1.33333 – | 0 | abs ≤ 1e-12 | Pass |
| CG-09.linear.mean | linear profile: normalised mean | 1 – | 1 – | 0 | abs ≤ 1e-12 | Pass |
| CG-09.power.alpha | power profile: energy α coefficient | 1.0449 – | 1.04487 – | 2.81e-5 | abs ≤ 0.0005 | Pass |
| CG-09.power.beta | power profile: momentum β coefficient | 1.01587 – | 1.01578 – | 9.10e-5 | abs ≤ 0.0005 | Pass |
| CG-09.power.mean | power profile: normalised mean | 1 – | 0.99972 – | 2.80e-4 | abs ≤ 0.0005 | Pass |
| CG-09.uniform.alpha | uniform profile: energy α coefficient | 1 – | 1 – | 0 | abs ≤ 1e-12 | Pass |
| CG-09.uniform.beta | uniform profile: momentum β coefficient | 1 – | 1 – | 0 | abs ≤ 1e-12 | Pass |
| CG-09.uniform.mean | uniform profile: normalised mean | 1 – | 1 – | 0 | abs ≤ 1e-12 | Pass |
| CG-10 | Flow area A | 5.76 m² | 5.76 m² | 0 | abs ≤ 0.005 | Pass |
| CG-11 | Wetted perimeter P | 7.32666 m | 7.33 m | 4.56e-4 | abs ≤ 0.005 | Pass |
| CG-12 | Hydraulic radius R | 0.78617 m | 0.786 m | 2.16e-4 | abs ≤ 0.0005 | Pass |
| CG-13 | Top width T | 6.6 m | 6.6 m | 0 | abs ≤ 0.005 | Pass |
| CG-14 | Hydraulic depth D | 0.872727 m | 0.873 m | 3.12e-4 | abs ≤ 0.0005 | Pass |
| CG-15 | Wave celerity c | 2.926 m/s | 2.93 m/s | 1.37e-3 | abs ≤ 0.005 | Pass |
| CG-16 | Froude number | 0.341764 – | 0.342 – | 6.91e-4 | abs ≤ 0.0005 | Pass |
| CG-17 | Discharge Q | 5.76 m³/s | 5.76 m³/s | 0 | abs ≤ 0.005 | Pass |
| CG-18 | β: displayed numeric vs displayed analytic | 1.016 – | 1.016 – | 0 | abs ≤ 0.0015 | Pass |
| CG-19 | α: displayed numeric vs displayed analytic | 1.045 – | 1.045 – | 0 | abs ≤ 0.0015 | Pass |

<details><summary>Reference derivations</summary>

- **CG-01.circ0.4.A** — Chow (1959) Table 2-1 for a circular, shallow section, {"d":2.5}, y = 0.4 m
- **CG-01.circ0.4.P** — Chow (1959) Table 2-1 for a circular, shallow section, {"d":2.5}, y = 0.4 m
- **CG-01.circ0.4.T** — Chow (1959) Table 2-1 for a circular, shallow section, {"d":2.5}, y = 0.4 m
- **CG-01.circ1.2.A** — Chow (1959) Table 2-1 for a circular, part full section, {"d":2.5}, y = 1.2 m
- **CG-01.circ1.2.P** — Chow (1959) Table 2-1 for a circular, part full section, {"d":2.5}, y = 1.2 m
- **CG-01.circ1.2.T** — Chow (1959) Table 2-1 for a circular, part full section, {"d":2.5}, y = 1.2 m
- **CG-01.rect1.2.A** — Chow (1959) Table 2-1 for a rectangular section, {"b":3}, y = 1.2 m
- **CG-01.rect1.2.P** — Chow (1959) Table 2-1 for a rectangular section, {"b":3}, y = 1.2 m
- **CG-01.rect1.2.T** — Chow (1959) Table 2-1 for a rectangular section, {"b":3}, y = 1.2 m
- **CG-01.trap1.2.A** — Chow (1959) Table 2-1 for a trapezoidal section, {"b":3,"m":1.5}, y = 1.2 m
- **CG-01.trap1.2.P** — Chow (1959) Table 2-1 for a trapezoidal section, {"b":3,"m":1.5}, y = 1.2 m
- **CG-01.trap1.2.T** — Chow (1959) Table 2-1 for a trapezoidal section, {"b":3,"m":1.5}, y = 1.2 m
- **CG-01.trap2.4.A** — Chow (1959) Table 2-1 for a trapezoidal, wide batter section, {"b":0.5,"m":3}, y = 2.4 m
- **CG-01.trap2.4.P** — Chow (1959) Table 2-1 for a trapezoidal, wide batter section, {"b":0.5,"m":3}, y = 2.4 m
- **CG-01.trap2.4.T** — Chow (1959) Table 2-1 for a trapezoidal, wide batter section, {"b":0.5,"m":3}, y = 2.4 m
- **CG-01.tri1.2.A** — Chow (1959) Table 2-1 for a triangular section, {"m":1.5}, y = 1.2 m
- **CG-01.tri1.2.P** — Chow (1959) Table 2-1 for a triangular section, {"m":1.5}, y = 1.2 m
- **CG-01.tri1.2.T** — Chow (1959) Table 2-1 for a triangular section, {"m":1.5}, y = 1.2 m
- **CG-02** — R = A/P = 5.76 / 7.32666
- **CG-03** — D = A/T = 5.76 / 6.60
- **CG-04** — c = √(gD), the shallow-water wave speed
- **CG-05** — Fr = V/√(gD)
- **CG-06** — Q = VA (continuity)
- **CG-07** — Re = VR/ν with ν = 1×10⁻⁶ m²/s at 20 °C
- **CG-08** — Fr = V/√(gA/T) over 4 shapes × y ∈ {0.3, 0.8, 1.2, 2.0} m × V ∈ {0.4, 1, 2.5, 6} m/s (worst at null)
- **CG-09.linear.alpha** — Simpson integration of ∫₀¹ u(ξ)³dξ against the closed form (α = 2, β = 4/3); the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-09.linear.beta** — Simpson integration of ∫₀¹ u(ξ)²dξ against the closed form (α = 2, β = 4/3); the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-09.linear.mean** — ∫₀¹ u(ξ)dξ = 1 by construction — the profile is normalised by the mean velocity; the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-09.power.alpha** — Simpson integration of ∫₀¹ u(ξ)³dξ against the closed form (α = 512/490, β = 64/63); Simpson convergence is limited to ~O(h^(8/7)) by the unbounded derivative of ξ^(1/7) at the bed
- **CG-09.power.beta** — Simpson integration of ∫₀¹ u(ξ)²dξ against the closed form (α = 512/490, β = 64/63); Simpson convergence is limited to ~O(h^(8/7)) by the unbounded derivative of ξ^(1/7) at the bed
- **CG-09.power.mean** — ∫₀¹ u(ξ)dξ = 1 by construction — the profile is normalised by the mean velocity; Simpson convergence is limited to ~O(h^(8/7)) by the unbounded derivative of ξ^(1/7) at the bed
- **CG-09.uniform.alpha** — Simpson integration of ∫₀¹ u(ξ)³dξ against the closed form (α = β = 1); the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-09.uniform.beta** — Simpson integration of ∫₀¹ u(ξ)²dξ against the closed form (α = β = 1); the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-09.uniform.mean** — ∫₀¹ u(ξ)dξ = 1 by construction — the profile is normalised by the mean velocity; the integrand is a polynomial of degree ≤ 3, which Simpson integrates exactly
- **CG-10** — the panel readout must agree with hydraulics() to the 2 decimals it displays
- **CG-11** — the panel readout must agree with hydraulics() to the 2 decimals it displays
- **CG-12** — the panel readout must agree with hydraulics() to the 3 decimals it displays
- **CG-13** — the panel readout must agree with hydraulics() to the 2 decimals it displays
- **CG-14** — the panel readout must agree with hydraulics() to the 3 decimals it displays
- **CG-15** — the panel readout must agree with hydraulics() to the 2 decimals it displays
- **CG-16** — the panel readout must agree with hydraulics() to the 3 decimals it displays
- **CG-17** — the panel readout must agree with hydraulics() to the 2 decimals it displays
- **CG-18** — β by numerical integration must match the closed form printed beside it
- **CG-19** — α by numerical integration must match the closed form printed beside it

</details>

## gvf_profiles

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| GV-01 | Friction slope at normal depth | 0.001 – | 1.000e-3 – | < 1e-9 | rel ≤ 0.000001 | Pass |
| GV-02 | Fr² at critical depth | 1 – | 1 – | < 1e-9 | rel ≤ 0.000001 | Pass |
| GV-03 | Critical depth | 0.741533 m | 0.741533 m | 0 | rel ≤ 0.000001 | Pass |
| GV-04 | Normal depth | 1.12402 m | 1.12402 m | 0 | rel ≤ 0.000001 | Pass |
| GV-05 | dy/dx at normal depth | 0 – | 3.042e-19 – | — | abs ≤ 1e-9 | Pass |
| GV-06.M1 | ∫(S₀ − S_f)dx ÷ ΔE, M1 backwater | 1 – | 1.00001 – | 1.31e-5 | rel ≤ 0.005 | Pass |
| GV-06.M2 | ∫(S₀ − S_f)dx ÷ ΔE, M2 drawdown | 1 – | 1.0001 – | 1.03e-4 | rel ≤ 0.005 | Pass |
| GV-06.M3 | ∫(S₀ − S_f)dx ÷ ΔE, M3 jet | 1 – | 1 – | 1.29e-6 | rel ≤ 0.005 | Pass |
| GV-07 | Direct-step self-convergence (N = 1000 → 4000) | 0 – | 2.304e-5 – | — | abs ≤ 0.005 | Pass |
| GV-08 | Direct step vs RK4 reach length | 1693.54 m | 1693.54 m | 1.63e-6 | rel ≤ 0.02 | Pass |

<details><summary>Reference derivations</summary>

- **GV-01** — definition of normal depth: S_f(y_n) = S₀ = 0.001
- **GV-02** — definition of critical depth: Q²T/(gA³) = 1
- **GV-03** — y_c = (q²/g)^(1/3) with q = 10/5 = 2 m²/s → 0.74166 m
- **GV-04** — independent bisection on (1/n)AR^(2/3)√S₀ = 10 m³/s, b = 5 m, n = 0.015
- **GV-05** — the GVF numerator S₀ − S_f is zero at y = y_n
- **GV-06.M1** — the GVF equation dE/dx = S₀ − S_f must hold along the integrated profile
- **GV-06.M2** — the GVF equation dE/dx = S₀ − S_f must hold along the integrated profile
- **GV-06.M3** — the GVF equation dE/dx = S₀ − S_f must hold along the integrated profile
- **GV-07** — reach length from the direct-step method must converge as the depth increment is refined (1693.50 m → 1693.54 m)
- **GV-08** — the converged direct-step length must match the RK4-integrated profile length

</details>

## hydraulic_jump

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| HJ-01 | Sequent depth y₂ | 0.131774 m | 0.131774 m | 0 | rel ≤ 1e-9 | Pass |
| HJ-02 | Approach specific energy E₁ | 0.27 m | 0.27 m | 0 | rel ≤ 1e-9 | Pass |
| HJ-03 | Momentum residual |M₁ − M₂| / M₁ | 0 – | 1.701e-16 – | — | abs ≤ 1e-9 | Pass |
| HJ-04 | Energy loss, momentum closed form | 0.132467 m | 0.132467 m | 0 | rel ≤ 1e-9 | Pass |
| HJ-05 | y₁ recovered from Fr₂ | 0.02 m | 0.02 m | < 1e-9 | rel ≤ 1e-8 | Pass |
| HJ-06 | Critical depth y_c | 0.0584804 m | 0.0584804 m | < 1e-9 | rel ≤ 1e-9 | Pass |
| HJ-07 | Worst momentum residual over 21 states | 0 – | 2.090e-16 – | — | abs ≤ 1e-9 | Pass |
| HJ-08 | Worst energy-route disagreement over 21 states | 0 – | 4.180e-15 – | — | abs ≤ 1e-8 | Pass |

<details><summary>Reference derivations</summary>

- **HJ-01** — Bélanger: y₂ = y₁·½(√(1+8Fr₁²) − 1) = 0.020 × ½(√201 − 1) = 0.131775 m
- **HJ-02** — E₁ = y₁ + V₁²/2g = y₁(1 + Fr₁²/2) = 0.020 × (1 + 12.5) = 0.270 m
- **HJ-03** — specific force M = q²/(gy) + y²/2 must be equal either side of the jump
- **HJ-04** — h_L = (y₂ − y₁)³/(4y₁y₂) must equal E₁ − E₂
- **HJ-05** — y₁ = y₂·½(√(1+8Fr₂²) − 1) — the jump relation is symmetric
- **HJ-06** — y_c = (q²/g)^(1/3) with q = V₁y₁ = 0.044294 m²/s
- **HJ-07** — y₁ ∈ {0.010, 0.020, 0.040} m × Fr₁ ∈ {1.5, 2, 3, 4.5, 6, 8, 10} (worst at {"y1":0.02,"Fr":4.5})
- **HJ-08** — |(E₁−E₂) − (y₂−y₁)³/(4y₁y₂)| / h_L across the same grid (worst at {"y1":0.01,"Fr":1.5})

</details>

## hydrostatic_forces

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| curved-FR | resultant | 238340 N | 238340 N | 0 | rel ≤ 1e-12 | Pass |
| curved-Fv | vertical component | 179358 N | 179358 N | 0 | rel ≤ 1e-12 | Pass |
| curved-Fx | horizontal component | 156960 N | 156960 N | 0 | rel ≤ 1e-12 | Pass |
| curved-Fx-arm | line of action of F_x below the pivot | 1.08333 m | 1.08333 m | < 1e-9 | rel ≤ 1e-12 | Pass |
| curved-quadrant-Fv | vertical component | 23114.3 N | 23114.3 N | 0 | rel ≤ 1e-12 | Pass |
| curved-quadrant-xbar | line of action of F_v | 0.424413 m | 0.424413 m | < 1e-9 | rel ≤ 1e-12 | Pass |
| curved-selfcheck-Fv | ∮p n_z dA ÷ γV | 1 — | 1 — | 3.74e-9 | rel ≤ 0.000001 | Pass |
| curved-selfcheck-Fx | ∮p n_x dA ÷ γh_cA_proj | 1 — | 1 — | 8.17e-9 | rel ≤ 0.000001 | Pass |
| curved-xbar | line of action of F_v from the pivot | 0.948048 m | 0.948048 m | 0 | rel ≤ 1e-12 | Pass |
| curved-zero-moment | net moment ÷ (F_R·R) | 0 — | 6.106e-17 — | — | rel ≤ 1e-12 | Pass |
| curved-zero-moment-span22.5 | net moment ÷ (F_R·R) at a 22.5° arc | 0 — | 6.301e-17 — | — | rel ≤ 1e-12 | Pass |
| curved-zero-moment-span45 | net moment ÷ (F_R·R) at a 45° arc | 0 — | 0 — | — | rel ≤ 1e-12 | Pass |
| curved-zero-moment-span67.5 | net moment ÷ (F_R·R) at a 67.5° arc | 0 — | 4.772e-17 — | — | rel ≤ 1e-12 | Pass |
| drawn-plane-from-wet-side-th0 | signed standoff of the arrow tail along the wet-side normal at θ = 0° | 1.08574 m | 1.08574 m | 0 | abs ≤ 1e-9 | Pass |
| drawn-plane-from-wet-side-th30 | signed standoff of the arrow tail along the wet-side normal at θ = 30° | 1.73103 m | 1.73103 m | 0 | abs ≤ 1e-9 | Pass |
| drawn-plane-from-wet-side-th90 | signed standoff of the arrow tail along the wet-side normal at θ = 90° | 1.2757 m | 1.2757 m | 0 | abs ≤ 1e-9 | Pass |
| drawn-plane-head-at-CP-th0 | distance from the drawn arrowhead to the centre of pressure at θ = 0° | 0 m | 0 m | — | abs ≤ 1e-9 | Pass |
| drawn-plane-head-at-CP-th30 | distance from the drawn arrowhead to the centre of pressure at θ = 30° | 0 m | 0 m | — | abs ≤ 1e-9 | Pass |
| drawn-plane-head-at-CP-th90 | distance from the drawn arrowhead to the centre of pressure at θ = 90° | 0 m | 0 m | — | abs ≤ 1e-9 | Pass |
| drawn-plane-normal-th0 | |cos| between the drawn resultant and the plate at θ = 0° | 0 — | 0 — | — | rel ≤ 1e-9 | Pass |
| drawn-plane-normal-th30 | |cos| between the drawn resultant and the plate at θ = 30° | 0 — | 3.170e-16 — | — | rel ≤ 1e-9 | Pass |
| drawn-plane-normal-th90 | |cos| between the drawn resultant and the plate at θ = 90° | 0 — | 0 — | — | rel ≤ 1e-9 | Pass |
| drawn-resultant-through-O-above-R2-s90 | perpendicular distance from O to the drawn resultant ÷ R (fluid above the arc) | 0 — | 5.440e-16 — | — | rel ≤ 1e-9 | Pass |
| drawn-resultant-through-O-above-R2.5-s40 | perpendicular distance from O to the drawn resultant ÷ R (fluid above the arc) | 0 — | 2.329e-16 — | — | rel ≤ 1e-9 | Pass |
| drawn-resultant-through-O-outside-R2-s90 | perpendicular distance from O to the drawn resultant ÷ R (fluid outside the arc) | 0 — | 4.784e-16 — | — | rel ≤ 1e-9 | Pass |
| drawn-resultant-through-O-outside-R2.5-s40 | perpendicular distance from O to the drawn resultant ÷ R (fluid outside the arc) | 0 — | 4.842e-16 — | — | rel ≤ 1e-9 | Pass |
| plane-dam45-CP | CP along the face | 9.42809 m | 9.42809 m | 0 | rel ≤ 1e-12 | Pass |
| plane-dam45-F | resultant force per metre | 693672 N/m | 693672 N/m | < 1e-9 | rel ≤ 1e-12 | Pass |
| plane-dy-invariant | Δy·h_c at 20 m ÷ at 1 m | 1 — | 1 — | 0 | rel ≤ 1e-12 | Pass |
| plane-horiz-dy | shift of the CP below the centroid | 0 m | 0 m | — | rel ≤ 1e-15 | Pass |
| plane-horiz-F | resultant force | 49050 N | 49050 N | 0 | rel ≤ 1e-12 | Pass |
| plane-incl-CP | centre of pressure from the upper edge | 1.63636 m | 1.63636 m | < 1e-9 | rel ≤ 1e-12 | Pass |
| plane-incl-F | resultant force | 161865 N | 161865 N | 0 | rel ≤ 1e-12 | Pass |
| plane-selfcheck-CP | ∮s p dA / ∮p dA ÷ s_R | 1 — | 1 — | 8.82e-9 | rel ≤ 0.000001 | Pass |
| plane-selfcheck-F | ∮p dA ÷ γh_cA | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| plane-vertical-CP | centre of pressure from the upper edge | 1.66667 m | 1.66667 m | 0 | rel ≤ 1e-12 | Pass |
| plane-vertical-F | resultant force | 30656.3 N | 30656.3 N | 0 | rel ≤ 1e-12 | Pass |

<details><summary>Reference derivations</summary>

- **curved-FR** — F_R = √(F_x² + F_v²)
- **curved-Fv** — F_v = γV with V = b(h_O R + πR²/4) = 18.2832 m³, the prism between the arc and the free-surface level → 179.36 kN
- **curved-Fx** — F_x = γ h_c A_proj on the vertical projection, h_c = h_O + R/2 = 4 m, A_proj = R·b = 4 m² → 156.96 kN (tutorial radial gate)
- **curved-Fx-arm** — R/2 + I_xc/(y_cA) for the vertical projection = 1 + 2²/(12·4) = 1.08333 m
- **curved-quadrant-Fv** — F_v = γ·(πR²/4)·b = weight of the quarter-cylinder of water → 23.11 kN
- **curved-quadrant-xbar** — with h_O = 0 the prism is a quarter disc, whose centroid is 4R/3π = 0.4244 m from the centre (worked example: quadrant gate, R = 1 m, 3 m wide)
- **curved-selfcheck-Fv** — the same quadrature, vertical component, against the prism weight
- **curved-selfcheck-Fx** — quadrature of the radial traction over 4000 arc elements
- **curved-xbar** — centroid of that prism: (h_O R²/2 + R³/3)/(h_O R + πR²/4) = 0.9480 m
- **curved-zero-moment** — pressure on a circular arc acts along the radius, so it has no moment about the centre of curvature: F_v x̄ − F_x·arm ≡ 0 for every head, radius and span
- **curved-zero-moment-span22.5** — the radial-traction identity is a property of circular curvature, not of the quadrant: it must hold for any span
- **curved-zero-moment-span45** — the radial-traction identity is a property of circular curvature, not of the quadrant: it must hold for any span
- **curved-zero-moment-span67.5** — the radial-traction identity is a property of circular curvature, not of the quadrant: it must hold for any span
- **drawn-plane-from-wet-side-th0** — the fluid pushes ONTO the surface, so the arrow must start clear of the plate on the wetted (+n) side and point inward — drawing it from the dry side reverses the physics while still looking like a plausible annotation
- **drawn-plane-from-wet-side-th30** — the fluid pushes ONTO the surface, so the arrow must start clear of the plate on the wetted (+n) side and point inward — drawing it from the dry side reverses the physics while still looking like a plausible annotation
- **drawn-plane-from-wet-side-th90** — the fluid pushes ONTO the surface, so the arrow must start clear of the plate on the wetted (+n) side and point inward — drawing it from the dry side reverses the physics while still looking like a plausible annotation
- **drawn-plane-head-at-CP-th0** — the resultant acts at the centre of pressure, so that is where the arrow ends
- **drawn-plane-head-at-CP-th30** — the resultant acts at the centre of pressure, so that is where the arrow ends
- **drawn-plane-head-at-CP-th90** — the resultant acts at the centre of pressure, so that is where the arrow ends
- **drawn-plane-normal-th0** — all the differential forces are perpendicular to the surface, so the resultant must be too (Munson §2.8) — the drawn arrow must be exactly normal to A→B
- **drawn-plane-normal-th30** — all the differential forces are perpendicular to the surface, so the resultant must be too (Munson §2.8) — the drawn arrow must be exactly normal to A→B
- **drawn-plane-normal-th90** — all the differential forces are perpendicular to the surface, so the resultant must be too (Munson §2.8) — the drawn arrow must be exactly normal to A→B
- **drawn-resultant-through-O-above-R2-s90** — the components act on their own lines of action, which meet at P*; the resultant of two forces passes through their intersection, and on a circular arc that line also contains the centre of curvature — so the drawn arrow must miss O by nothing, whichever side the fluid is on
- **drawn-resultant-through-O-above-R2.5-s40** — the components act on their own lines of action, which meet at P*; the resultant of two forces passes through their intersection, and on a circular arc that line also contains the centre of curvature — so the drawn arrow must miss O by nothing, whichever side the fluid is on
- **drawn-resultant-through-O-outside-R2-s90** — the components act on their own lines of action, which meet at P*; the resultant of two forces passes through their intersection, and on a circular arc that line also contains the centre of curvature — so the drawn arrow must miss O by nothing, whichever side the fluid is on
- **drawn-resultant-through-O-outside-R2.5-s40** — the components act on their own lines of action, which meet at P*; the resultant of two forces passes through their intersection, and on a circular arc that line also contains the centre of curvature — so the drawn arrow must miss O by nothing, whichever side the fluid is on
- **plane-dam45-CP** — upper edge at the free surface, so y_R = 2L/3 = 9.428 m along the face — independent of the inclination
- **plane-dam45-F** — F = γ(H/2)(L·b) with wetted slant L = H/sin45° = 14.142 m → 693.66 kN/m (worked example: rockfill dam, reservoir depth 10 m)
- **plane-dy-invariant** — Δy = I_xc/(y_cA) = L² sinθ/(12 h_c), so the product Δy·h_c depends only on L and θ; the ratio between any two submergences is therefore exactly 1
- **plane-horiz-dy** — uniform pressure has no first moment about the centroid, so Δy = 0 exactly; the module must reach this limit without dividing by sinθ
- **plane-horiz-F** — uniform pressure p = ρgh = 19.62 kPa over 2.5 m² → 49.05 kN (worked example: plate lying flat 2 m down)
- **plane-incl-CP** — centroid of the trapezoidal pressure prism, s_R = L(2p_bot + p_top)/(3(p_bot + p_top)) — an independent route to the CP that never uses I_xc
- **plane-incl-F** — F = γ h_c A, h_c = h_top + (L/2) sinθ = 2.75 m, A = 6 m² → 161.865 kN (tutorial gate AB hinged 2 m below the surface)
- **plane-selfcheck-CP** — first moment of the same quadrature against y_c + I_xc/(y_cA)
- **plane-selfcheck-F** — midpoint quadrature of ∮p dA over 4000 strips against γh_cA
- **plane-vertical-CP** — the pressure prism is a triangle, so its centroid is at 2L/3 = 1.6667 m
- **plane-vertical-F** — F = γ h_c A with h_c = L/2 for a plate whose upper edge is at the free surface (Munson Eq. 2.18); = ½γL²b = 30656.25 N for L = 2.5 m, b = 1 m

</details>

## hydrostatic_forces_3d

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| circ-dy | shift of the CP below the centroid | 0.0560023 m | 0.0560023 m | 0 | rel ≤ 1e-12 | Pass |
| circ-F | resultant force | 119147 N | 119147 N | 0 | rel ≤ 1e-12 | Pass |
| drawn-resultant-through-pivot-R1-hO0-s90 | perpendicular distance from the pivot to the drawn resultant ÷ R | 0 — | 3.140e-16 — | — | rel ≤ 1e-12 | Pass |
| drawn-resultant-through-pivot-R2-hO3-s90 | perpendicular distance from the pivot to the drawn resultant ÷ R | 0 — | 1.110e-16 — | — | rel ≤ 1e-12 | Pass |
| drawn-resultant-through-pivot-R2.5-hO5-s40 | perpendicular distance from the pivot to the drawn resultant ÷ R | 0 — | 1.986e-16 — | — | rel ≤ 1e-12 | Pass |
| gate3d-Fv | vertical component | 179358 N | 179358 N | 0 | rel ≤ 1e-12 | Pass |
| gate3d-Fx | horizontal component | 156960 N | 156960 N | 0 | rel ≤ 1e-12 | Pass |
| gate3d-zero-moment | net moment ÷ (F_R·R) | 0 — | 6.106e-17 — | — | rel ≤ 1e-12 | Pass |
| horiz-circ-dy | Δy for a horizontal circ | 0 m | 0 m | — | rel ≤ 1e-15 | Pass |
| horiz-rect-dy | Δy for a horizontal rect | 0 m | 0 m | — | rel ≤ 1e-15 | Pass |
| horiz-semi-dy | Δy for a horizontal semi | 0 m | 0 m | — | rel ≤ 1e-15 | Pass |
| horiz-tri-dy | Δy for a horizontal tri | 0 m | 0 m | — | rel ≤ 1e-15 | Pass |
| semi-centroid | centroid from the flat edge | 0.848826 m | 0.848826 m | 0 | rel ≤ 1e-12 | Pass |
| shape-circ-A | area | 7.06858 m² | 7.06858 m² | 0 | rel ≤ 1e-12 | Pass |
| shape-circ-I | second moment about the centroidal axis | 3.97608 m⁴ | 3.97608 m⁴ | 0 | rel ≤ 1e-12 | Pass |
| shape-circ-selfcheck-A | area from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-circ-selfcheck-I | second moment from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-circ-selfcheck-yc | centroid from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-circ-yc | centroid from the upper edge | 1.5 m | 1.5 m | 0 | rel ≤ 1e-12 | Pass |
| shape-rect-A | area | 6 m² | 6 m² | 0 | rel ≤ 1e-12 | Pass |
| shape-rect-I | second moment about the centroidal axis | 4.5 m⁴ | 4.5 m⁴ | 0 | rel ≤ 1e-12 | Pass |
| shape-rect-selfcheck-A | area from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-rect-selfcheck-I | second moment from ∫w dt ÷ table | 1 — | 1 — | 6.25e-8 | rel ≤ 0.000001 | Pass |
| shape-rect-selfcheck-yc | centroid from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-rect-yc | centroid from the upper edge | 1.5 m | 1.5 m | 0 | rel ≤ 1e-12 | Pass |
| shape-semi-A | area | 14.1372 m² | 14.1372 m² | 0 | rel ≤ 1e-12 | Pass |
| shape-semi-I | second moment about the centroidal axis | 8.89031 m⁴ | 8.89031 m⁴ | 0 | rel ≤ 1e-12 | Pass |
| shape-semi-selfcheck-A | area from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-semi-selfcheck-I | second moment from ∫w dt ÷ table | 1 — | 1 — | 9.94e-8 | rel ≤ 0.000001 | Pass |
| shape-semi-selfcheck-yc | centroid from ∫w dt ÷ table | 1 — | 1 — | 1.93e-8 | rel ≤ 0.000001 | Pass |
| shape-semi-yc | centroid from the upper edge | 1.27324 m | 1.27324 m | 0 | rel ≤ 1e-12 | Pass |
| shape-tri-A | area | 3 m² | 3 m² | 0 | rel ≤ 1e-12 | Pass |
| shape-tri-I | second moment about the centroidal axis | 1.5 m⁴ | 1.5 m⁴ | 0 | rel ≤ 1e-12 | Pass |
| shape-tri-selfcheck-A | area from ∫w dt ÷ table | 1 — | 1 — | < 1e-9 | rel ≤ 0.000001 | Pass |
| shape-tri-selfcheck-I | second moment from ∫w dt ÷ table | 1 — | 1 — | 3.13e-8 | rel ≤ 0.000001 | Pass |
| shape-tri-selfcheck-yc | centroid from ∫w dt ÷ table | 1 — | 1 — | 1.56e-8 | rel ≤ 0.000001 | Pass |
| shape-tri-yc | centroid from the upper edge | 2 m | 2 m | 0 | rel ≤ 1e-12 | Pass |
| tri-CP | centre of pressure from the apex | 2.1293 m | 2.1293 m | 0 | rel ≤ 1e-12 | Pass |
| worked-solution-answer | F_R quoted by the panel | 161.865 kN | 161.87 kN | 3.09e-5 | rel ≤ 0.0005 | Pass |

<details><summary>Reference derivations</summary>

- **circ-dy** — Δy = I_xc sinθ /(h_c A) with I_xc = πD⁴/64 — the form of I_xc/(y_cA) that stays finite as θ → 0
- **circ-F** — F = γ h_c A, h_c = 3 + 1·sin60° = 3.8660 m, A = πD²/4 = 3.1416 m² → 119.15 kN
- **drawn-resultant-through-pivot-R1-hO0-s90** — the two components act on their own lines of action, which intersect at P*; the resultant of two forces passes through their intersection, and for a circular arc that line must also contain the centre of curvature — so the drawn arrow must miss the pivot by exactly nothing
- **drawn-resultant-through-pivot-R2-hO3-s90** — the two components act on their own lines of action, which intersect at P*; the resultant of two forces passes through their intersection, and for a circular arc that line must also contain the centre of curvature — so the drawn arrow must miss the pivot by exactly nothing
- **drawn-resultant-through-pivot-R2.5-hO5-s40** — the two components act on their own lines of action, which intersect at P*; the resultant of two forces passes through their intersection, and for a circular arc that line must also contain the centre of curvature — so the drawn arrow must miss the pivot by exactly nothing
- **gate3d-Fv** — F_v = γ b (h_O R + πR²/4) → 179.36 kN
- **gate3d-Fx** — F_x = γ h_c A_proj on the vertical projection → 156.96 kN
- **gate3d-zero-moment** — the traction on a circular arc is radial, so it exerts no moment about the pivot axis — the property a Tainter gate is designed around
- **horiz-circ-dy** — uniform pressure has no first moment about the centroid, whatever the shape; Δy = I_xc sinθ/(h_cA) reaches this without dividing by sinθ
- **horiz-rect-dy** — uniform pressure has no first moment about the centroid, whatever the shape; Δy = I_xc sinθ/(h_cA) reaches this without dividing by sinθ
- **horiz-semi-dy** — uniform pressure has no first moment about the centroid, whatever the shape; Δy = I_xc sinθ/(h_cA) reaches this without dividing by sinθ
- **horiz-tri-dy** — uniform pressure has no first moment about the centroid, whatever the shape; Δy = I_xc sinθ/(h_cA) reaches this without dividing by sinθ
- **semi-centroid** — standard table: the centroid of a semicircle lies 4R/3π = 0.8488 m from its diameter, which is why its CP is not at mid-height
- **shape-circ-A** — standard table of geometric properties, circ: A = 7.068583 m² at L = 3 m, b = 2 m
- **shape-circ-I** — standard table, circ: I_xc = 3.976078 m⁴
- **shape-circ-selfcheck-A** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-circ-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-circ-selfcheck-yc** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-circ-yc** — standard table, circ: ȳ = 1.500000 m
- **shape-rect-A** — standard table of geometric properties, rect: A = 6.000000 m² at L = 3 m, b = 2 m
- **shape-rect-I** — standard table, rect: I_xc = 4.500000 m⁴
- **shape-rect-selfcheck-A** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-rect-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-rect-selfcheck-yc** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-rect-yc** — standard table, rect: ȳ = 1.500000 m
- **shape-semi-A** — standard table of geometric properties, semi: A = 14.137167 m² at L = 3 m, b = 2 m
- **shape-semi-I** — standard table, semi: I_xc = 8.890314 m⁴
- **shape-semi-selfcheck-A** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-semi-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-semi-selfcheck-yc** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-semi-yc** — standard table, semi: ȳ = 1.273240 m
- **shape-tri-A** — standard table of geometric properties, tri: A = 3.000000 m² at L = 3 m, b = 2 m
- **shape-tri-I** — standard table, tri: I_xc = 1.500000 m⁴
- **shape-tri-selfcheck-A** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-tri-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-tri-selfcheck-yc** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-tri-yc** — standard table, tri: ȳ = 2.000000 m
- **tri-CP** — direct integration of the first moment of pressure over the triangle, s_R = L(4h_top + 3L sinθ)/[2(3h_top + 2L sinθ)] — independent of I_xc
- **worked-solution-answer** — the worked-solution panel must quote the model's own resultant, to the two decimals it displays

</details>

## idf_frequency

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| ID-01 | Worst Gumbel scale α error over 6 durations | 0 – | 0 – | — | abs ≤ 1e-12 | Pass |
| ID-02 | Worst Gumbel location ξ error over 6 durations | 0 – | 0 – | — | abs ≤ 1e-12 | Pass |
| ID-03 | Gumbel reduced variate at T = 100 yr | 4.60015 – | 4.60015 – | 0 | rel ≤ 1e-12 | Pass |
| ID-04 | Gumbel reduced variate at T = 2 yr | 0.366513 – | 0.366513 – | 0 | rel ≤ 1e-12 | Pass |
| ID-05 | 1-h, 100-yr design intensity | 17.3131 mm/h | 17.3131 mm/h | 0 | rel ≤ 1e-12 | Pass |
| ID-06 | Sherman fit RMSE relative to mean intensity | 0 – | 0.0391294 – | — | abs ≤ 0.1 | Pass |
| ID-07 | Worst single-point Sherman deviation | 0 – | 0.115011 – | — | abs ≤ 0.25 | Pass |
| ID-08 | Time of concentration (Kirpich) | 1.48377 h | 1.48377 h | 0 | rel ≤ 1e-12 | Pass |
| ID-09 | Rational Method peak discharge | 16.5958 m³/s | 16.5958 m³/s | 0 | rel ≤ 1e-12 | Pass |
| ID-10 | Rational Method via base SI units | 16.5958 m³/s | 16.5958 m³/s | 0 | rel ≤ 1e-12 | Pass |
| ID-11 | Worst AMS extraction error over 6 durations | 0 – | 1.563e-5 – | — | abs ≤ 0.00005 | Pass |

<details><summary>Reference derivations</summary>

- **ID-01** — α = √6·s/π recomputed in Node from the published annual maxima (worst at D = null h)
- **ID-02** — ξ = x̄ − 0.5772·α recomputed in Node from the published annual maxima (worst at D = null h)
- **ID-03** — y_T = −ln(−ln(1 − 1/T)) = −ln(−ln 0.99) = 4.600149
- **ID-04** — y_T = −ln(−ln 0.5) = 0.366513
- **ID-05** — i(D,T) = ξ_D + α_D·y_T evaluated from the fitted 1-h parameters
- **ID-06** — Levenberg–Marquardt fit of i = a·T^m/(D+b)^n to 36 Gumbel quantiles; RMSE 0.2534 mm/h against a mean intensity of 6.48 mm/h
- **ID-07** — max |i_Sherman − i_Gumbel| / i_Gumbel over the 6 durations × 6 return periods
- **ID-08** — t_c = 0.0195·L^0.77·S^(−0.385)/60 with L = 4000 m, S = 0.005 → 1.4830 h
- **ID-09** — Q_p = C·i·A/3.6 with C = 0.45, A = 10 km², i = i_Sherman(t_c, 100 yr) = 13.277 mm/h
- **ID-10** — C·(i/1000/3600 m/s)·(A×10⁶ m²) must equal C·i·A/3.6
- **ID-11** — maximum D-hour intensity found by sliding a window over the 2022 hourly record must equal the published annual maximum for 2022; the published table is rounded to four decimals, which bounds the agreement at ~3×10⁻⁵ (worst at D = 24 h)

</details>

## manning_uniform_flow

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| MN-01 | Normal depth (round trip) | 2 m | 2 m | 0 | rel ≤ 0.000001 | Pass |
| MN-02 | Flow area at normal depth | 10 m² | 10 m² | 0 | rel ≤ 0.000001 | Pass |
| MN-03 | Hydraulic radius at normal depth | 1.11111 m | 1.11111 m | 0 | rel ≤ 0.000001 | Pass |
| MN-04 | Critical depth | 1.27763 m | 1.27763 m | < 1e-9 | rel ≤ 0.000001 | Pass |
| MN-05 | Froude number at critical depth | 1 – | 1 – | 0 | rel ≤ 0.000001 | Pass |
| MN-06 | Q from Manning at (y_c, S_c) | 22.6159 m³/s | 22.6159 m³/s | 0 | rel ≤ 0.000001 | Pass |
| MN-07 | Q from Manning at (y_n, S₀) | 22.6159 m³/s | 22.6159 m³/s | 0 | rel ≤ 0.000001 | Pass |
| MN-08.rect.A | rect area at y = 0.8 m | 3.2 m² | 3.2 m² | 0 | rel ≤ 1e-9 | Pass |
| MN-08.rect.P | rect wetted perimeter at y = 0.8 m | 5.6 m | 5.6 m | 0 | rel ≤ 1e-9 | Pass |
| MN-08.rect.T | rect top width at y = 0.8 m | 4 m | 4 m | 0 | rel ≤ 1e-9 | Pass |
| MN-08.trap.A | trap area at y = 1.4 m | 7.42 m² | 7.42 m² | 0 | rel ≤ 1e-9 | Pass |
| MN-08.trap.P | trap wetted perimeter at y = 1.4 m | 8.76099 m | 8.76099 m | 0 | rel ≤ 1e-9 | Pass |
| MN-08.trap.T | trap top width at y = 1.4 m | 8.1 m | 8.1 m | 0 | rel ≤ 1e-9 | Pass |
| MN-08.tri.A | tri area at y = 1.1 m | 2.42 m² | 2.42 m² | 0 | rel ≤ 1e-9 | Pass |
| MN-08.tri.P | tri wetted perimeter at y = 1.1 m | 4.91935 m | 4.91935 m | 0 | rel ≤ 1e-9 | Pass |
| MN-08.tri.T | tri top width at y = 1.1 m | 4.4 m | 4.4 m | 0 | rel ≤ 1e-9 | Pass |
| MN-09 | Worst normal-depth round-trip error over 81 states | 0 – | 2.961e-16 – | — | abs ≤ 0.000001 | Pass |

<details><summary>Reference derivations</summary>

- **MN-01** — Q = (1/n)AR^(2/3)√S₀ = 22.6159 m³/s computed independently at y = 2.000 m in a 5 m rectangular channel, n = 0.015, S₀ = 0.001
- **MN-02** — A = b·y = 5 × 2 = 10 m²
- **MN-03** — R = A/P = 10 / (5 + 2×2) = 1.11111 m
- **MN-04** — y_c = (q²/g)^(1/3) with q = Q/b = 4.5232 m²/s
- **MN-05** — by definition Fr = V/√(gD) = 1 at y = y_c
- **MN-06** — definition of the critical slope: uniform flow at y = y_c carries the same Q
- **MN-07** — definition of normal depth: Manning at (y_n, S₀) returns the design Q
- **MN-08.rect.A** — Chow (1959) Table 2-1 section properties for a rect channel, {"b":4}, y = 0.8 m
- **MN-08.rect.P** — Chow (1959) Table 2-1 section properties for a rect channel, {"b":4}, y = 0.8 m
- **MN-08.rect.T** — Chow (1959) Table 2-1 section properties for a rect channel, {"b":4}, y = 0.8 m
- **MN-08.trap.A** — Chow (1959) Table 2-1 section properties for a trap channel, {"b":2.5,"m":2}, y = 1.4 m
- **MN-08.trap.P** — Chow (1959) Table 2-1 section properties for a trap channel, {"b":2.5,"m":2}, y = 1.4 m
- **MN-08.trap.T** — Chow (1959) Table 2-1 section properties for a trap channel, {"b":2.5,"m":2}, y = 1.4 m
- **MN-08.tri.A** — Chow (1959) Table 2-1 section properties for a tri channel, {"m":2}, y = 1.1 m
- **MN-08.tri.P** — Chow (1959) Table 2-1 section properties for a tri channel, {"m":2}, y = 1.1 m
- **MN-08.tri.T** — Chow (1959) Table 2-1 section properties for a tri channel, {"m":2}, y = 1.1 m
- **MN-09** — 3 shapes × S₀ ∈ {1e-4, 1e-3, 1e-2} × n ∈ {0.011, 0.015, 0.030} × y ∈ {0.5, 1.5, 3.0} m (worst at {"shape":"rect","S":0.0001,"n":0.011,"y":1.5})

</details>

## specific_energy

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| SE-01 | E from the subcritical root | 0.1 m | 0.1 m | 0 | rel ≤ 1e-9 | Pass |
| SE-02 | E from the supercritical root | 0.1 m | 0.1 m | < 1e-9 | rel ≤ 1e-9 | Pass |
| SE-03 | Critical depth | 0.0355568 m | 0.0355568 m | 0 | rel ≤ 1e-9 | Pass |
| SE-04 | Minimum specific energy | 0.0533353 m | 0.0533353 m | 0 | rel ≤ 1e-9 | Pass |
| SE-05 | E evaluated at y_c | 0.0533353 m | 0.0533353 m | 0 | rel ≤ 1e-9 | Pass |
| SE-06 | Worst |E₁ − E₂|/E₁ across 9 gate settings | 0 – | 3.250e-16 – | — | abs ≤ 1e-9 | Pass |
| SE-07.10mm | Max head residual over the reach, Δz = 10 mm (subcritical) | 0 m | 2.776e-17 m | — | abs ≤ 0.000001 | Pass |
| SE-07.30mm | Max head residual over the reach, Δz = 30 mm (near choking) | 0 m | 2.776e-17 m | — | abs ≤ 0.000001 | Pass |
| SE-07.60mm | Max head residual over the reach, Δz = 60 mm (choked) | 0 m | 2.776e-17 m | — | abs ≤ 0.000001 | Pass |
| SE-08 | Critical hump height Δz_c | 0.117442 m | 0.117442 m | 0 | rel ≤ 1e-9 | Pass |

<details><summary>Reference derivations</summary>

- **SE-01** — y + q²/2gy² evaluated at the subcritical root must return E = 0.100 m
- **SE-02** — y + q²/2gy² evaluated at the supercritical root must return E = 0.100 m
- **SE-03** — y_c = (q²/g)^(1/3) with q = Q/B = 0.0042/0.20 = 0.021 m²/s
- **SE-04** — E_min = 1.5·y_c for a rectangular section
- **SE-05** — substituting y_c into the specific-energy equation must give E_min
- **SE-06** — sluice-gate discharge is derived from E₁ = E₂; y₁ ∈ {0.12, 0.17, 0.24} m × a ∈ {8, 12, 20} mm (worst at {"y1":0.17,"a":0.012})
- **SE-07.10mm** — max |y + q²/2gy² + z − E₁| over 121 stations along the flume
- **SE-07.30mm** — max |y + q²/2gy² + z − E₁| over 121 stations along the flume
- **SE-07.60mm** — max |y + q²/2gy² + z − E₁| over 121 stations along the flume
- **SE-08** — Δz_c = E_approach − E_min: the largest step the flow can climb without choking

</details>

## storm_hydrograph

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| SH-01 | Excess rainfall depth | 60 mm | 60 mm | 0 | rel ≤ 0.000001 | Pass |
| SH-02 | Infiltrated depth | 30 mm | 30 mm | 0 | rel ≤ 0.000001 | Pass |
| SH-03 | Runoff coefficient | 0.666667 – | 0.666667 – | 0 | rel ≤ 0.000001 | Pass |
| SH-04 | Volume closure (depth from ∫Q dt) | 60 mm | 60 mm | 1.75e-9 | rel ≤ 0.002 | Pass |
| SH-05 | Direct-runoff volume | 1.2 10⁶ m³ | 1.2 10⁶ m³ | 1.75e-9 | rel ≤ 0.002 | Pass |
| SH-06 | Direct runoff at the end of the rain | 19.2621 m³/s | 19.2621 m³/s | < 1e-9 | rel ≤ 0.002 | Pass |
| SH-07 | Direct-runoff peak | 29.9562 m³/s | 29.9562 m³/s | 1.04e-6 | rel ≤ 0.002 | Pass |
| SH-08 | Worst volume-closure error over 99 parameter sets | 0 – | 0.00408709 – | — | abs ≤ 0.005 | Pass |
| SH-09 | Pre-storm baseflow | 1 m³/s | 1 m³/s | 0 | rel ≤ 1e-9 | Pass |

<details><summary>Reference derivations</summary>

- **SH-01** — φ-index: (i − φ)·D = (30 − 10) mm/h × 3 h = 60 mm
- **SH-02** — φ-index: min(i, φ)·D = 10 mm/h × 3 h = 30 mm
- **SH-03** — ER / P = 60 mm / 90 mm = 0.6667
- **SH-04** — ∫Q_d dt / A must return the 60 mm of excess rainfall that generated it
- **SH-05** — 60 mm × 20 km² = 0.060 m × 20×10⁶ m² = 1.20×10⁶ m³
- **SH-06** — Nash n=2, constant input: q(D) = I[1 − e^(−D/k)(1 + D/k)] = 111.11 × 0.17336 = 19.262 m³/s, D = 3 h, k = 4 h
- **SH-07** — Nash n=2 cascade peaks where q₁ = q₂, at τ* = k[1 − q₂(D)/q₁(D)] = 2.686 h after the rain stops → 29.956 m³/s
- **SH-08** — sweep of i ∈ {15,30,60,100} mm/h, D ∈ {1,3,6} h, φ ∈ {0,10,25} mm/h, k ∈ {0.5,4,12} h; closure required at every point (worst at {"i":60,"dur":6,"phi":10,"A":20,"k":12,"u":0,"bf":"res"})
- **SH-09** — documented rule q₀ = 0.05 × A = 0.05 × 20 km² = 1.0 m³/s

</details>

## unit_hydrograph

| Case | Quantity | Reference | OpenHydroLab | Rel. error | Tolerance | Status |
|---|---|---|---|---|---|---|
| UH-01 | S-curve equilibrium discharge | 195.833 m³/s | 195.833 m³/s | 0 | rel ≤ 1e-9 | Pass |
| UH-02 | S-curve asymptote S(t→∞) | 195.833 m³/s | 195.833 m³/s | 0 | rel ≤ 1e-9 | Pass |
| UH-03 | Worst unit-volume error over 9 durations | 0 cm | 2.631e-14 cm | — | abs ≤ 0.002 | Pass |
| UH-04 | Recovered runoff depth | 3 cm | 3 cm | < 1e-9 | rel ≤ 0.005 | Pass |
| UH-05 | Volume of the derived UH | 1 cm | 1 cm | < 1e-9 | rel ≤ 0.005 | Pass |
| UH-06.12 | S-curve vs superposition, D' = 12 h | 0 m³/s | 1.421e-14 m³/s | — | abs ≤ 0.000001 | Pass |
| UH-06.18 | S-curve vs superposition, D' = 18 h | 0 m³/s | 1.421e-14 m³/s | — | abs ≤ 0.000001 | Pass |
| UH-06.24 | S-curve vs superposition, D' = 24 h | 0 m³/s | 7.105e-15 m³/s | — | abs ≤ 0.000001 | Pass |
| UH-07 | Convolved runoff volume | 25.38 10⁶ m³ | 25.38 10⁶ m³ | < 1e-9 | rel ≤ 0.005 | Pass |

<details><summary>Reference derivations</summary>

- **UH-01** — Q_eq = A·(1 cm)/D₀ = 423×10⁶ m² × 0.01 m / (6 × 3600 s) = 195.833 m³/s
- **UH-02** — S(t) = Q_eq·P(t) with P a gamma CDF, so S(∞) = Q_eq
- **UH-03** — ∫UH_D' dt / A = 1.00 cm required for D' ∈ {1, 2, 3, 4, 6, 8, 12, 18, 24} h (worst at D' = 24 h, giving 1.00000 cm)
- **UH-04** — storm synthesised as 3.00 cm × UH₆ + 10 m³/s baseflow; d = V_DRH/A must return 3.00 cm
- **UH-05** — the derived unit hydrograph must itself carry unit volume
- **UH-06.12** — max |UH from S-curve − UH from averaging 2 lagged 6-h UHs| over 0–140 h
- **UH-06.18** — max |UH from S-curve − UH from averaging 3 lagged 6-h UHs| over 0–140 h
- **UH-06.24** — max |UH from S-curve − UH from averaging 4 lagged 6-h UHs| over 0–140 h
- **UH-07** — ΣR = 6 cm over 423 km² = 0.06 m × 423×10⁶ m² = 25.38×10⁶ m³

</details>

## Cross-browser software test matrix

| Test | chromium | firefox | webkit |
|---|---|---|---|
| accessibility.spec.mjs › channel_geometry — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › channel_geometry — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › channel_geometry — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › channel_geometry — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › documentation guides exist for every laboratory | Pass | Pass | Pass |
| accessibility.spec.mjs › gvf_profiles — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › gvf_profiles — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › gvf_profiles — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › gvf_profiles — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › hydraulic_jump — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › hydraulic_jump — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › hydraulic_jump — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › hydraulic_jump — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces_3d — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces_3d — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces_3d — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › hydrostatic_forces_3d — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › idf_frequency — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › idf_frequency — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › idf_frequency — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › idf_frequency — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › manning_uniform_flow — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › manning_uniform_flow — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › manning_uniform_flow — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › manning_uniform_flow — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › specific_energy — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › specific_energy — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › specific_energy — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › specific_energy — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › storm_hydrograph — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › storm_hydrograph — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › storm_hydrograph — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › storm_hydrograph — sliders are operable from the keyboard | Pass | Pass | Pass |
| accessibility.spec.mjs › unit_hydrograph — every interactive control has an accessible name | Pass | Pass | Pass |
| accessibility.spec.mjs › unit_hydrograph — focus order reaches the controls by Tab alone | Pass | Pass | Pass |
| accessibility.spec.mjs › unit_hydrograph — layout does not overflow horizontally | Pass | Pass | Pass |
| accessibility.spec.mjs › unit_hydrograph — sliders are operable from the keyboard | Pass | Pass | Pass |
| file-protocol.spec.mjs › channel_geometry builds its 3D scene from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › channel_geometry renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › channel_geometry works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › gvf_profiles renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › gvf_profiles works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydraulic_jump renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydraulic_jump works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydrostatic_forces renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydrostatic_forces works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydrostatic_forces_3d renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › hydrostatic_forces_3d works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › idf_frequency renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › idf_frequency works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › manning_uniform_flow renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › manning_uniform_flow works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › specific_energy renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › specific_energy works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › storm_hydrograph renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › storm_hydrograph works when opened directly from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › unit_hydrograph renders from disk | Pass | Pass | Pass |
| file-protocol.spec.mjs › unit_hydrograph works when opened directly from disk | Pass | Pass | Pass |
| label-layout.spec.mjs › channel_geometry labels never overlap at 1366×768 | Pass | Pass | Pass |
| label-layout.spec.mjs › channel_geometry labels never overlap at 1600×950 | Pass | Pass | Pass |
| label-layout.spec.mjs › every 3D label is tagged with its text | Pass | Pass | Pass |
| loads-clean.spec.mjs › channel_geometry loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › channel_geometry renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › every link on the landing page resolves | Pass | Pass | Pass |
| loads-clean.spec.mjs › gvf_profiles loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › gvf_profiles renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydraulic_jump loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydraulic_jump renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydrostatic_forces loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydrostatic_forces renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydrostatic_forces_3d loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › hydrostatic_forces_3d renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › idf_frequency loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › idf_frequency renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › manning_uniform_flow loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › manning_uniform_flow renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › specific_energy loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › specific_energy renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › storm_hydrograph loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › storm_hydrograph renders its canvas and keeps animating | Pass | Pass | Pass |
| loads-clean.spec.mjs › the landing page links to every laboratory | Pass | Pass | Pass |
| loads-clean.spec.mjs › unit_hydrograph loads without console or runtime errors | Pass | Pass | Pass |
| loads-clean.spec.mjs › unit_hydrograph renders its canvas and keeps animating | Pass | Pass | Pass |
| self-contained.spec.mjs › channel_geometry requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › channel_geometry still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › gvf_profiles requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › gvf_profiles still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › hydraulic_jump requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › hydraulic_jump still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › hydrostatic_forces requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › hydrostatic_forces still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › hydrostatic_forces_3d requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › hydrostatic_forces_3d still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › idf_frequency requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › idf_frequency still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › manning_uniform_flow requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › manning_uniform_flow still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › no animation references a third-party host in its source | Pass | Pass | Pass |
| self-contained.spec.mjs › specific_energy requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › specific_energy still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › storm_hydrograph requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › storm_hydrograph still works with the network cut | Pass | Pass | Pass |
| self-contained.spec.mjs › unit_hydrograph requests nothing from outside the origin | Pass | Pass | Pass |
| self-contained.spec.mjs › unit_hydrograph still works with the network cut | Pass | Pass | Pass |
