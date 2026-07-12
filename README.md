# OpenChannelLab

Physics-accurate, interactive, single-file HTML animations for teaching undergraduate
open-channel hydraulics.

**Live site:** https://USERNAME.github.io/OpenChannelLab/

## What this is

Each animation is a self-contained HTML file that runs in any modern browser with no
installation. They are designed for classroom projection and independent student
exploration. The core design rule is **physics integrity**: every number on screen is
computed live from the real governing equation (continuity, energy, momentum, the Manning
equation, the gradually-varied-flow equation) — never faked motion — and each animation is
verified by hand against worked textbook examples before release.

## Animations

| File | Concept | Notes |
|---|---|---|
| `animations/Lec1_open_channel_geometry.html` | Channel geometry (A, P, R, T, D) for four section shapes; selectable velocity-profile models with α, β computed by numerical integration (self-checking, reproduces α = 2, β = 4/3 for the linear profile); Reynolds & Froude classification; plan-view wave demo — ripples spread at c = √(gD) while advected at V, showing the upstream news front (c − V) in subcritical flow and the Froude wedge sin θ = 1/Fr in supercritical flow. Lecture Examples 1 & 3 as one-click presets. **[Full guide](docs/open_channel_geometry_guide.md)** — theory, description, classroom use | 3D (Three.js via CDN — needs internet on first load) |
| `animations/Lec2_manning_uniform_flow.html` | Manning uniform flow: normal & critical depth solvers, mild–steep slope classification | 2D, fully offline |
| `animations/Lab1_specific_energy_critical_depth.html` | Specific energy diagram, alternate depths, critical depth, sluice gate & choking | 2D, fully offline |
| `animations/Lab2_hydraulic_jump.html` | Hydraulic jump: sequent depths (momentum), all five jump types, energy loss vs theory | 2D, fully offline |
| `animations/Lec5_gvf_profiles.html` | Gradually varied flow: numerical integration of the GVF equation, auto-classification of all 12 profile types | 2D, fully offline |
| `animations/Lec6_water_balance.html` | Catchment/lake water balance: P + I − O − E = ΔS animated as a moving lake level | 2D, fully offline |
| `animations/Lec9_idf_frequency.html` | IDF pipeline on a real gauge (Drumalbin 00987, 27 yr hourly, embedded): ① sliding-window annual-maximum extraction (self-checked against the archived AMS), ② Gumbel/EV1 by method of moments on probability paper + binomial design-life risk, ③ IDF family + fitted Sherman equation, ④ rational-method bridge with the Q_p(D)-peaks-at-t_c demonstration. **[Full guide](docs/idf_frequency_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/Lec10_rational_method.html` | Rational method: composite runoff coefficient, IDF intensity at t_c, peak flow — with an urbanization demo | 2D, fully offline |
| `animations/Lec10_storm_hydrograph.html` | Storm hydrograph: rainfall → φ-index losses → Nash-cascade routing → live streamflow response; drops travel the network with IUH-sampled times; limbs, lag, baseflow separation (reservoir or uniform), mass balance, urbanization comparison. **[Full guide](docs/storm_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/Lec11_unit_hydrograph.html` | Unit Hydrograph Workbench — three modes on one gamma-IUH foundation: derive UH from an observed storm (interactive baseflow separation + rain-gauge reconciliation check), apply UH by superposition (stacked bands, variable pulse duration), change duration via S-curve with the superposition method overlaid at integer multiples. **[Full guide](docs/unit_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/Lec12_well_drawdown.html` | Steady radial flow to a well: Thiem (confined) & Dupuit–Thiem (unconfined) cones of depression, Darcy vs seepage velocity | 2D, fully offline |

In development: weirs and sluice gates, channel transitions, Thiessen polygons, unsteady well drawdown (Theis).

## Using in your course

Open `index.html` (or the live site) and launch any animation — or copy a single
animation file onto a USB stick / VLE; each one is standalone. Suggested uses:

- **Lecture demonstrations** — project and vary parameters live while deriving the theory.
- **Pre-lab preparation** — the two `Lab*` animations mirror standard flume experiments
  (specific energy; hydraulic jump).
- **Independent study** — students explore parameter space (e.g., push the Froude number
  through 1 and watch the regime change).

## Citing

If you use OpenChannelLab in teaching or research, please cite the archived release
(DOI added at first Zenodo release) — see `CITATION.cff`.

## Contributing

Issues and pull requests are welcome — especially reports of any physics error (these are
treated as critical bugs) and requests for new concepts.

## License

MIT — see [LICENSE](LICENSE).
