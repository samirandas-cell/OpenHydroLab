# Open-Channel Geometry, Velocity Distribution & the Froude Number — Guide

Animation: `animations/channel_geometry.html` (3D, Three.js via CDN — needs
internet on first load; everything else is self-contained in the single file).

Supports an introductory open-channel hydraulics lecture, typically the sections 3–7.

## 1. Purpose

The animation answers three questions that anchor the whole open-channel module:

1. **What do the geometry elements A, P, R, T, D actually measure** on a real channel
   cross-section, and how do they change with shape and depth?
2. **Why is the mean velocity V a fiction** — and what do the correction coefficients
   α and β repair when we use it anyway?
3. **What does the Froude number physically mean?** Not "V over root-g-D", but: *can a
   surface wave carry information upstream?* This is the deepest idea in the lecture —
   it is why subcritical flow is controlled from downstream (backwater; see the GVF-profiles module) and
   supercritical flow from upstream (hydraulic jump, Lab 2).

## 2. Theory

### Geometry elements (Chow, 1959)

| Shape | A | P | T |
|---|---|---|---|
| Rectangular | b·y | b + 2y | b |
| Trapezoidal | (b + m·y)·y | b + 2y√(1+m²) | b + 2m·y |
| Triangular | m·y² | 2y√(1+m²) | 2m·y |
| Circular (θ = 2 cos⁻¹(1 − 2y/d)) | (d²/8)(θ − sin θ) | θ·d/2 | d·sin(θ/2) |

Derived: hydraulic radius R = A/P (friction length scale, → the Manning uniform-flow module) and
hydraulic depth D = A/T (wave length scale, → Froude number).

### Velocity distribution and the correction coefficients

The point velocity u varies over the section; V = (1/A)∫u dA is the one-dimensional
stand-in. Using V in the momentum and energy fluxes under-counts them, so

β = ∫u²dA / (V²A),  α = ∫u³dA / (V³A).

The animation offers three profile models u(ξ), ξ = y/D, each constructed so its
depth-average is exactly V:

| Model | u(ξ) | α (analytic) | β (analytic) |
|---|---|---|---|
| 1/7-power (turbulent) | (8/7)·V·ξ^(1/7) | 512/490 ≈ 1.045 | 64/63 ≈ 1.016 |
| Linear (Lecture Example 2) | 2V·ξ | 2 | 4/3 |
| Uniform (plug) | V | 1 | 1 |

**Self-check:** the readout integrates the chosen profile numerically (Simpson's rule,
400 panels) and displays ∫u dA/(V·A), β and α next to their analytic values with a ✓.
At any setting the mean closure returns 1.000 and the linear profile reproduces
Example 2's α = 2, β = 4/3 exactly.

### Froude number as an information speed ratio

A small surface disturbance in still water spreads at the shallow-water celerity
c = √(gD). In flowing water the wavefront speeds are V + c (downstream) and V − c
(upstream). Hence

Fr = V / √(gD):
- **Fr < 1 (subcritical):** V − c < 0 — waves reach upstream; the flow "hears" what is
  downstream, so downstream conditions control it (this is the mechanism behind
  backwater curves).
- **Fr = 1 (critical):** waves are frozen at their source.
- **Fr > 1 (supercritical):** nothing propagates upstream. A steady disturbance sheds
  its circles into a wedge whose half-angle satisfies **sin θ = c/V = 1/Fr** — the exact
  analogue of the Mach cone in supersonic gas dynamics (Apsley; Henderson, 1966).

The animation's ripple kinematics are exact: each ripple's radius grows at c while its
centre is advected at V. The green "news front" (subcritical) is the leftmost tangent of
the ripple family and moves upstream at precisely c − V; the amber wedge (supercritical)
is drawn at θ = asin(1/Fr) and is visibly tangent to every ripple — the geometry proves
the formula on screen.

### Classification readouts

Re = VR/ν (ν = 10⁻⁶ m²/s) with the lecture's thresholds (laminar < 500,
turbulent > 2000) — students see that any real channel is deep into the turbulent
regime; and Fr with the sub/critical/supercritical banner, which also tints the water
surface (blue / amber / red).

### Verified numbers (against the worked examples)

| Case | Animation | Lecture answer |
|---|---|---|
| Example 1 (trapezoid b = 6, m = 0.75, y = 4, drop 3 over 50) | A = 36.00, P = 16.00, R = 2.250, S₀ = 0.060 | A = 36, P = 16, R = 2.25, S₀ = 0.06 ✓ |
| Example 2 (linear profile) | α = 2.000, β = 1.333 (numeric ∫) | α = 2, β = 4/3 ✓ |
| Example 3 (rect b = 3, y = 2, V = 1.5) | c = 4.43, V+c = 5.93, V−c = −2.93 m/s, Fr = 0.339 | c ≈ 4.43, 5.93, −2.93, Fr ≈ 0.34 ✓ |
| Supercritical check (V = 6, y = 2) | Fr = 1.355, θ = 47.6° | asin(1/1.355) = 47.6° ✓ |

## 3. Description of the tool

- **Left panel** — channel shape selector; geometry sliders (b, m or d, y, S₀); mean
  velocity V; velocity-profile model; display toggles; the two lecture-example preset
  buttons; the Aha-demo note.
- **Right panel** — geometry elements with the governing formulas for the active shape;
  the self-checking velocity-distribution block (uₛ, mean closure, β, α); flow & regime
  block (Q, Re, c, V±c, Fr, wedge half-angle θ); regime banner and a one-line physical
  interpretation chip.
- **Bottom buttons** — camera presets: *3D view*, *Cross-section* (dimensioned slice),
  *Plan (wave demo)* (straight-down, whole reach), and *Pause*, which freezes the
  physics (simulation time stops; the scene does not drift while you talk).
- **Scene** — true-scale channel reach (20 m) with bed slope, datum line and slope
  label; dimensioned cross-section slice (T, y, b/m/d, P highlighted in yellow along the
  wetted boundary); velocity-profile arrows at the slice; surface drift particles moving
  at the chosen profile's surface velocity; stone-ripple wave demo with news front /
  Froude wedge annotations.

## 4. How to use

Quick start: open the file, press **Example 3 (waves)** — it sets the lecture's canal,
turns the stones on and switches to plan view.

Suggested ~20-minute classroom sequence:

1. Start on defaults (trapezoid). Orbit the 3D view; ask: *which of A, P, R, T, D can
   you point at?* Switch shapes and watch the formulas change in the readout. (4 min)
2. Press **Example 1** — the cross-section view reproduces the lecture's numbers
   exactly. Have students verify P = 16 by hand while it is on screen. (3 min)
3. Toggle the velocity profile through uniform → linear → 1/7-power. Ask *why does α
   grow as the profile gets more skewed?* Point at the ✓ marks: the machine is doing the
   integral from Example 2 live. (4 min)
4. Press **Example 3**, plan view. Pause. Ask: *if I drop a stone, where can the ripples
   go?* Play — the green news front crawls upstream at 2.93 m/s. (4 min)
5. Slide V up slowly. At V = c = 4.43 the front stalls (critical). Beyond it the wedge
   appears; read θ off the screen and check sin θ = 1/Fr on the board. Connect: *this is
   why a downstream gate cannot influence supercritical flow — remember this in the
   hydraulic-jump lab.* (5 min)

Assessment-style questions: (a) For the default trapezoid at y = 1.2 m, compute D and c
by hand and check against the readout. (b) A stone makes ripples that just barely hold
their ground upstream — what is Fr? (c) Why does α = 1 make the kinetic-energy flux
wrong for the linear profile, and by how much?

## 5. Assumptions and limitations

- Uniform-flow scene: the water surface is drawn parallel to the bed (normal-depth
  condition); no GVF surface curvature (that is the GVF-profiles module).
- Ripple kinematics (radius c·t, centre advected V·t) are exact for small-amplitude
  shallow-water waves; ripple amplitude, fading, and the faint surface shimmer are
  cosmetic. Celerity uses the section-average D = A/T everywhere (the ripple is treated
  as a long wave; short-wave dispersion is not modelled).
- The velocity profiles are one-dimensional u(y/D) models applied across the whole
  section (as in the lecture's Example 2); real sections have 2-D isovel patterns with
  the maximum slightly below the surface.
- α and β are integrated over depth with dA = B dy (rectangular assumption), matching
  the lecture derivation.

## 6. Technical notes

Single self-contained HTML file; Three.js 0.160.0 loaded from the jsdelivr CDN
(internet needed on first load, cached afterwards). SI units, g = 9.81 m/s²,
ν = 10⁻⁶ m²/s. All readouts have stable element ids (`o-*`, `v-*`, `chip`) and a
`window.LAB` hook (state, forced render, manual sim tick) for scripted verification and
telemetry. MIT license — cite via `CITATION.cff`.

## 7. References

- Chow, V. T. (1959). *Open-Channel Hydraulics*. McGraw-Hill. (Geometry elements; α, β.)
- Henderson, F. M. (1966). *Open Channel Flow*. Macmillan. (Froude number, wave celerity,
  the Mach-cone analogy.)
- Apsley, D. *Open-Channel Flow 4: Wave Speed and Analogy with Compressible Flow*,
  lecture notes, University of Manchester.
- Das, S. (2025). *Hydraulics and Hydrology* lecture notes, University of Glasgow (Singapore).
  Singapore. (Worked Examples 1–3 reproduced by the preset buttons.)
