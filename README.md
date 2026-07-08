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
| `animations/Lec1_open_channel_geometry.html` | Channel geometry (A, P, R, T, D), velocity profile, Froude number / wave propagation | 3D (Three.js via CDN — needs internet on first load) |
| `animations/Lec2_manning_uniform_flow.html` | Manning uniform flow: normal & critical depth solvers, mild–steep slope classification | 2D, fully offline |
| `animations/Lab1_specific_energy_critical_depth.html` | Specific energy diagram, alternate depths, critical depth, sluice gate & choking | 2D, fully offline |
| `animations/Lab2_hydraulic_jump.html` | Hydraulic jump: sequent depths (momentum), all five jump types, energy loss vs theory | 2D, fully offline |
| `animations/Lec5_gvf_profiles.html` | Gradually varied flow: numerical integration of the GVF equation, auto-classification of all 12 profile types | 2D, fully offline |

In development: weirs and sluice gates, channel transitions, IDF curves, unit hydrograph.

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
