# OpenHydroLab

Physics-accurate, interactive, single-file HTML animations for teaching undergraduate
hydraulics and hydrology.

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
| `animations/Lec9_idf_frequency.html` | IDF pipeline on a real gauge (Drumalbin 00987, 27 yr hourly, embedded): ① sliding-window annual-maximum extraction (self-checked against the archived AMS), ② Gumbel/EV1 by method of moments on probability paper + binomial design-life risk, ③ IDF family + fitted Sherman equation, ④ rational-method bridge with the Q_p(D)-peaks-at-t_c demonstration. **[Full guide](docs/idf_frequency_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/Lec10_storm_hydrograph.html` | Storm hydrograph: rainfall → φ-index losses → Nash-cascade routing → live streamflow response; drops travel the network with IUH-sampled times; limbs, lag, baseflow separation, mass balance, urbanization comparison. **[Full guide](docs/storm_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |
| `animations/Lec11_unit_hydrograph.html` | Unit Hydrograph Workbench — three modes on one gamma-IUH foundation: derive UH from an observed storm (interactive baseflow separation + rain-gauge reconciliation check), apply UH by superposition (stacked bands, variable pulse duration), change duration via S-curve with the superposition method overlaid at integer multiples. **[Full guide](docs/unit_hydrograph_guide.md)** — theory, description, classroom use | 2D, fully offline |

In final verification (released as they are confirmed): channel geometry & Froude number
(3D), Manning uniform flow, specific energy & critical depth, hydraulic jump, gradually
varied flow profiles, water balance, rational method, and steady well drawdown. Further
concepts in development: weirs and sluice gates, channel transitions, Thiessen polygons,
unsteady well drawdown (Theis).

## Using in your course

Open `index.html` (or the live site) and launch any animation — or copy a single
animation file onto a USB stick / VLE; each one is standalone. Suggested uses:

- **Lecture demonstrations** — project and vary parameters live while deriving the theory.
- **Pre-lab / pre-tutorial preparation** — each animation reproduces worked lecture
  examples so students can check their hand calculations against it.
- **Independent study** — students explore parameter space (e.g., change a storm's
  duration and watch the unit hydrograph respond).

## Citing

If you use OpenHydroLab in teaching or research, please cite the archived release
(DOI added at first Zenodo release) — see `CITATION.cff`.

## Contributing

Issues and pull requests are welcome — especially reports of any physics error (these are
treated as critical bugs) and requests for new concepts.

## License

MIT — see [LICENSE](LICENSE).
