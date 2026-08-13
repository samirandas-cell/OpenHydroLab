# OpenHydroLab

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21635797.svg)](https://doi.org/10.5281/zenodo.21635797)

Physics-accurate, interactive HTML animations for teaching undergraduate fluid mechanics,
hydraulics and hydrology. Every module runs offline in any modern browser with nothing to
install and no third-party host to reach — eight are a single self-contained file, and the
two 3D modules ship with a vendored copy of Three.js alongside them.

**Live site:** https://samirandas-cell.github.io/OpenHydroLab/

## What this is

Each animation is a self-contained HTML file that runs in any modern browser with no
installation. They are designed for classroom projection and independent student
exploration. The core design rule is **physics integrity**: every number on screen is
computed live from the real governing equation — never faked motion — and each animation is
verified by hand against worked textbook examples before release.

## Animations

| File | Concept | Notes |
|---|---|---|
| `animations/hydrostatic_forces.html` | Hydrostatic forces on submerged surfaces, built on one idea in two linked pictures: the resultant is the **volume of the pressure prism** and the centre of pressure is its centroid. A true-scale section and its p-vs-distance diagram are tied by a leader line so the CP is visibly the same point in both. Horizontal, vertical and inclined plates on one continuous θ slider — Δy written as L²sinθ/(12h_c) so the θ → 0 limit is finite rather than a special case — plus curved surfaces decomposed into F_x on the vertical projection and F_v = γV, with the lines of action drawn so the resultant is seen to pass through the pivot. A **step-by-step worked solution** is generated from the current sliders and dims everything in the drawing the current step is not about. Force and centre of pressure are recomputed each frame by quadrature over 4000 strips and displayed as ✓ ratios; the net moment about a circular arc's centre is zero to machine precision at every setting. **[Full guide](docs/hydrostatic_forces_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/hydrostatic_forces_3d.html` | Hydrostatic force in three dimensions: the pressure prism built as an orbitable **solid** coloured by pressure, so "F_R is the volume of the prism and the CP is under its centroid" becomes something you can look at from any angle. Four plate shapes — rectangle, triangle, circle, semicircle — whose A, ȳ and I_xc are re-derived from each shape's own chord width (with a substitution that keeps the circular integrands smooth) and compared with the standard table on screen, so the property table is verified rather than memorised. A real cylindrical gate shows every pressure arrow meeting the pivot axis. Carries the same step-by-step worked solution, whose walk-through hides the scene elements and captions the current step is not about. **[Full guide](docs/hydrostatic_forces_3d_guide.md)** — theory, description, classroom use | 3D, fully offline (Three.js r160 vendored) |
| `animations/channel_geometry.html` | Channel geometry (A, P, R, T, D) for four section shapes; selectable velocity-profile models with α, β computed by numerical integration (self-checking, reproduces α = 2, β = 4/3 for the linear profile); Reynolds & Froude classification; plan-view wave demo — ripples spread at c = √(gD) while advected at V, showing the upstream news front (c − V) in subcritical flow and the Froude wedge sin θ = 1/Fr in supercritical flow. One-click worked-example presets. **[Full guide](docs/channel_geometry_guide.md)** — theory, description, classroom use | 3D, fully offline (Three.js r160 vendored) |
| `animations/specific_energy.html` | Specific energy, critical depth & choking: a flume and its E–y diagram live-linked by a travelling probe. Sluice-gate alternate depths (set y₁ & a, or hold Q and sweep the gate to critical) plus flow over a hump — subcritical surface drop, and choking past Δz_crit = E₁ − E_min with the upstream rise shown against the pre-choke level. Exact sub/supercritical branch solutions; energy budget max\|E+z−E₁\| self-checks every frame. **[Full guide](docs/specific_energy_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/hydraulic_jump.html` | Hydraulic jump: all five types (undular → strong) in a live flume with roller turbulence, plus paired E–y and M–y diagrams on a shared depth axis — sequent depths on one vertical line of the M–y curve (momentum conserved; independent \|M₁−M₂\|/M₁ self-check every frame) while the E–y diagram brackets h_L. Second view: theoretical curves (efficiency, relative height, length) vs Fr₁ with jump-type bands. Bélanger sequent depths; h_L computed by two independent routes that agree exactly. **[Full guide](docs/hydraulic_jump_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/manning_uniform_flow.html` | Manning uniform flow & normal depth: the gravity–friction force balance made visible. "Find normal depth" experiment — release the reach at ½yₙ or 1.6yₙ and a lumped continuity + momentum model (dA/dt = (Q−VA)/L, dV/dt = g(S₀−S_f)) relaxes onto yₙ, whose equilibrium is exactly Manning's equation; force arrows and the τ₀P/ρgAS₀ = 1 ✓ self-check track it live. Normal & critical depth bisection solvers, yₙ(S₀) chart with mild/steep shading and S꜀ marker, best hydraulic section, Chezy C, worked-example presets incl. a critical-slope channel. **[Full guide](docs/manning_uniform_flow_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/gvf_profiles.html` | Gradually varied flow profiles: the water surface integrated by RK4 away from its control section from dy/dx = (S₀−S_f)/(1−Fr²), with a **linked phase portrait** of dy/dx against depth — the numerator's zero is yₙ (an attractor in the marching direction), the denominator's pole is y꜀ (where the profile turns vertical and GVF fails), and direction arrows make the twelve classical profiles read as one ODE's solution families. One-click M1…A3 presets on a single channel (b = 5 m, n = 0.015, Q = 10 m³/s), a family map of every profile a given bed can carry, wave speeds V ± √(gD) showing why subcritical control sits downstream, and the **direct-step method as a staircase** whose length converges onto the RK4 reach as N grows (0.887 → 1.000 ✓). Rect/trapezoid/triangle sections; energy consistency ∫(S₀−S_f)dx ÷ ΔE, S_f(yₙ)/S₀ and Fr(y꜀) self-checked every frame. **[Full guide](docs/gvf_profiles_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/idf_frequency.html` | IDF pipeline on a real gauge (Drumalbin 00987, 27 yr hourly, embedded): ① sliding-window annual-maximum extraction (self-checked against the archived AMS), ② Gumbel/EV1 by method of moments on probability paper + binomial design-life risk, ③ IDF family + fitted Sherman equation, ④ rational-method bridge with the Q_p(D)-peaks-at-t_c demonstration. **[Full guide](docs/idf_frequency_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/storm_hydrograph.html` | Storm hydrograph: rainfall → φ-index losses → Nash-cascade routing → live streamflow response; drops travel the network with IUH-sampled times; limbs, lag, baseflow separation, mass balance, urbanization comparison. **[Full guide](docs/storm_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/unit_hydrograph.html` | Unit Hydrograph Workbench — three modes on one gamma-IUH foundation: derive UH from an observed storm (interactive baseflow separation + rain-gauge reconciliation check), apply UH by superposition (stacked bands, variable pulse duration), change duration via S-curve with the superposition method overlaid at integer multiples. **[Full guide](docs/unit_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |

In final verification (released as they are confirmed): water balance, rational method, and
steady well drawdown. Further concepts in development: weirs and sluice gates, channel
transitions, Thiessen polygons, unsteady well drawdown (Theis).

## Using in your course

Open `index.html` (or the live site) and launch any animation — or copy an animation file
onto a USB stick / VLE. Eight of the ten are standalone single files; the two 3D ones
(`channel_geometry.html` and `hydrostatic_forces_3d.html`) need `animations/vendor/three/`
copied alongside them. All ten run fully offline, with no installation and no third-party
host. Suggested uses:

- **Lecture demonstrations** — project and vary parameters live while deriving the theory.
- **Pre-lab / pre-tutorial preparation** — each animation reproduces worked lecture
  examples so students can check their hand calculations against it.
- **Independent study** — students explore parameter space (e.g., change a storm's
  duration and watch the unit hydrograph respond).

## Verification

Every displayed quantity is checked against a reference derived independently of the
code — a closed-form solution, a conservation identity, or a hand-checkable textbook
calculation — across Chromium, Firefox and WebKit.

```bash
npm install
npm run install-browsers
npm test
```

The run writes a machine-readable validation dataset to `validation/results/`:
`validation-results.json` (one record per comparison per engine, with reference,
observed value, error, tolerance and the derivation used), `validation-results.md`
(the same as tables) and `browser-matrix.json`.

`validation/validation-protocol.md` states what is verified, where each reference value
comes from, how tolerances are set, and — deliberately — what is *not* established:
this protocol covers computational fidelity and reproducibility, not learning outcomes.

Known gaps are listed at the end of that protocol rather than hidden; the corresponding
tests are left failing until they are closed.

## Citing

If you use OpenHydroLab in teaching or research, please cite the archived release — see
`CITATION.cff` for the full record.

- **Latest archived version (1.0.4):** [10.5281/zenodo.21915552](https://doi.org/10.5281/zenodo.21915552)
- **All versions:** [10.5281/zenodo.21635797](https://doi.org/10.5281/zenodo.21635797)

Cite the version DOI to pin the exact code your results depend on; cite the concept DOI to
point readers at whatever the current release is.

> Das, S. (2026). *OpenHydroLab: interactive, physics-accurate animations for teaching
> fluid mechanics, hydraulics and hydrology* (Version 1.0.4) [Computer software].
> https://doi.org/10.5281/zenodo.21915552

## Contributing

Issues and pull requests are welcome — especially reports of any physics error (these are
treated as critical bugs) and requests for new concepts.

## License

MIT — see [LICENSE](LICENSE).
