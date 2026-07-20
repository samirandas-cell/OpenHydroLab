# Manning Uniform Flow & Normal Depth — guide

Animation: [`animations/manning_uniform_flow.html`](../animations/manning_uniform_flow.html) · 2D, fully offline, single file.

## 1. Purpose

The animation answers three questions students routinely leave a first course unable to
answer:

1. **What *is* normal depth, physically?** Not "the depth that solves Manning's equation",
   but the equilibrium depth at which the gravity component driving the flow exactly
   balances boundary friction — and, crucially, an equilibrium the flow *finds by itself*
   (an attractor), the open-channel analogue of a falling raindrop's terminal velocity.
2. **Why does the mild/steep slope classification exist?** Because yₙ depends on S₀ while
   y꜀ does not; their crossing defines the critical slope S꜀.
3. **How do the standard design computations fit together?** Normal-depth and
   critical-depth solvers, bed shear, Chezy C, and the best hydraulic section, all live.

## 2. Theory

### Uniform flow as a force balance

For steady uniform flow in a prismatic channel, a control volume of length L carries no
net momentum change, so the streamwise weight component balances boundary friction:

ρ g A L S₀ = τ₀ P L  ⟹  τ₀ = ρ g R S₀,  R = A/P.

Manning's equation is this balance closed with the empirical resistance law
τ₀ ∝ V²/R^⅓ (n constant for a surface):

V = (1/n) R^⅔ S₀^½,  Q = V A.

Solving Q(y) = Q_design for depth (monotone in y; bisection in the tool) gives the
normal depth yₙ. The friction slope generalizes the closure to non-uniform velocity:
S_f = n²V²/R^{4/3}; uniform flow is the state S_f = S₀, which is why bed, water surface
and energy line are parallel.

### Normal depth as an attractor (the "find normal depth" experiment)

The research-level interpretation the scene is built on (Dingman, *Physical Hydrology*,
ch. 6; Apsley, open-channel notes): water entering a reach away from equilibrium
accelerates or decelerates until friction — which grows as V² — matches gravity. The
tool integrates a lumped (single-cell) St-Venant reach of length L = 30 m:

- Continuity: dA/dt = (Q − V·A)/L (the reach stores or releases water),
- Momentum: dV/dt = g(S₀ − S_f), S_f = n²V²/R^{4/3}.

Its equilibrium requires **both** V·A = Q and S_f = S₀ — which is exactly Manning's
equation, so the dynamic system relaxes onto the same yₙ the bisection solver returns
(the tool checks this and prints ✓). The approach is a damped gravity–friction
oscillation with damping timescale ≈ V/(2gS₀) — genuinely minutes on mild slopes, which
the tool handles honestly with a displayed time-compression factor (fill phase at ×3,
residual ringing compressed up to ×60).

### Critical depth and slope classification

y꜀ solves Q²T/(gA³) = 1 (Fr = 1, minimum specific energy) and is independent of S₀ and n.
S꜀ = [nQ/(A꜀R꜀^⅔)]². S₀ < S꜀: mild (yₙ > y꜀, subcritical normal flow); S₀ > S꜀: steep.

### Sliders → classical controls, with verified numbers

| Control | Classical role | Verified value |
|---|---|---|
| Preset A: trapezoid b=2.5 m, m=2, n=0.013, S₀=0.0009, Q=26 m³/s | textbook uniform-flow computation | yₙ=1.799 m, A=10.97 m², P=10.55 m, R=1.040 m, V=2.369 m/s (hand: 1.8 / 10.98 / 10.55 / 1.04 / 2.37) |
| Preset B: rectangle b=20 m, n=0.035, Q=5.6 m³/s, S₀=0.021 | critical-slope channel | yₙ = y꜀ = 0.200 m, V=1.398 m/s, S꜀=0.0211 — classified CRITICAL |
| Independent spot check: rectangle b=4 m, n=0.015, Q=10 m³/s, S₀=10⁻²·⁵ | fresh hand calculation | yₙ=0.911 m, y꜀=0.860 m, S꜀=0.0037, mild — matches hand solution |
| Force self-check | τ₀P / ρgAS₀ | 1.000 ✓ at equilibrium (97 N/m = 97 N/m for preset A) |
| Experiment convergence | relaxed depth vs bisection yₙ | 1.799 = 1.799 m ✓ from both shallow (½yₙ) and deep (1.6yₙ) releases |

## 3. Description of the tool

- **Left panel** — channel shape (trapezoidal / rectangular / triangular), geometry
  sliders, Manning n by material or custom, discharge, log-scaled bed slope; the
  "find normal depth" release buttons; display toggles (particles, y꜀ line, force arrows).
- **Longitudinal profile (top canvas)** — the reach at its live depth with bed, water
  surface and energy line (parallel in uniform flow), particle drift at the live mean
  velocity, and the control-volume force arrows: gravity drive ρgAS₀ (green, downslope)
  vs friction resist τ₀P (red, upslope). During the experiment a ghost line marks the
  target yₙ. Vertical exaggeration is stated on screen.
- **Cross-section (bottom left)** — true scale, wetted perimeter highlighted in amber,
  live A, R, T, y labels; ghost yₙ surface during the experiment.
- **Chart (bottom right)** — yₙ(S₀) curve with the horizontal y꜀ line, mild/steep
  shading split at the S꜀ marker; the current-state dot slides vertically onto the
  yₙ(S₀) curve as the experiment converges (same point, two representations).
- **Right panel** — solved depths, slope classification banner, the force-balance
  readout with its ✓, full section hydraulics (A, P, R, T, V, Fr, τ₀, Chezy C, best
  hydraulic section), governing formulas, status chip.
- **Bottom buttons** — Pause (freezes all physics), slope sweep (yₙ falls, y꜀ stays,
  classification flips at S꜀), and the two worked-example presets.

## 4. How to use

Quick start: open the file, press **▶ Release too shallow** and watch the chip, the
force arrows and the chart dot until "UNIFORM FLOW reached ✓".

Suggested ~20-min classroom sequence:

1. (2 min) Preset A idle. Point at the three parallel lines. Ask: *why parallel?*
2. (3 min) Toggle the force arrows. Read the two numbers: equal. State the balance
   ρgAS₀ = τ₀P and derive τ₀ = ρgRS₀ on the board.
3. (5 min) **Release too shallow.** Pause mid-fill: outflow < inflow, the reach is
   filling; arrows unequal. Ask: *which force wins right now, and what will it do to
   depth?* Resume; note the overshoot and slow ringing (real timescale V/2gS₀ — ask
   students to compute it: ≈134 s here) and the ✓ when it locks onto yₙ.
4. (3 min) Release too deep — same attractor from the other side. Normal depth is not
   an imposed condition; it is where the physics settles.
5. (4 min) Sweep the slope. yₙ falls, y꜀ doesn't move. Stop at the crossing: S꜀.
   Then Preset B — a channel *built* at its critical slope (yₙ = y꜀ = 0.200 m).
6. (3 min) Change n from concrete to natural stream at fixed Q: yₙ rises. Ask what that
   means for flood levels when a channel is left unmaintained.

Assessment-style questions: (a) For preset A verify V by hand from R = 1.04 m.
(b) Why is y꜀ independent of both S₀ and n? (c) A channel has S₀ = S꜀ at design Q —
what happens to the classification when Q doubles? Check with the sliders.
(d) From the momentum equation, show the damping timescale near equilibrium is
V/(2gS₀), and explain why steep channels reach uniform flow faster.

## 5. Assumptions and limitations

- The relaxation experiment is a **lumped single-cell** model: one depth and one
  velocity for the whole reach, and the advective momentum-flux imbalance of the cell
  is neglected (dV/dt = g(S₀ − S_f) only). The equilibrium is unaffected — it is
  exactly Manning's yₙ — but the transient is indicative, not a full St-Venant routing.
- Time compression during the experiment is explicit on screen (chip shows ×N); the
  clock is honest simulation time.
- Manning n constant with depth; prismatic channel; hydrostatic pressure; small-slope
  approximation sin θ ≈ tan θ = S₀ (fine for S₀ ≤ 0.05, the slider limit).
- Particle motion uses the true mean velocity (no velocity-profile distribution).

## 6. Technical notes

Single self-contained HTML file, no dependencies, fully offline; canvas 2D. Depth
solvers: 70-step bisection. Experiment integrator: explicit Euler with 4 ms substeps
(stable well below the oscillation period). A `window.LAB` hook exposes state, solvers
and a headless `step(ms)` for verification and telemetry. MIT License; cite via the
repository `CITATION.cff`.

## 7. References

- Chow, V.T. (1959). *Open-Channel Hydraulics*. McGraw-Hill. (Uniform flow, Manning n
  tables, best hydraulic section.)
- Dingman, S.L. (2015). *Physical Hydrology*, 3rd ed., ch. 6 — uniform flow as the
  equilibrium of gravity and flow resistance.
- Apsley, D. — *Hydraulics 3: Open-Channel Flow* lecture notes, University of
  Manchester (normal depth, friction slope).
- Manning, R. (1891). On the flow of water in open channels and pipes. *Trans. Inst.
  Civil Engineers of Ireland*, 20, 161–207.
