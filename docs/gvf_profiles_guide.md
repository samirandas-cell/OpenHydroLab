# Gradually Varied Flow Profiles — teaching guide

`animations/gvf_profiles.html` · single file · 2D canvas · fully offline · MIT

---

## 1. Purpose

Students meet gradually varied flow as a table of twelve profile names — M1, M2, M3, S1, S2,
S3, C1, C3, H2, H3, A2, A3 — to be memorised along with a rule about zones. The physics
underneath is much simpler and much more interesting, and it is what this animation puts on
screen:

> **All twelve profiles are the solution families of a single first-order ODE.** The normal
> depth is the *zero* of that equation's numerator and behaves as an **attractor**; the
> critical depth is the *pole* of its denominator, where the surface turns vertical and the
> gradually-varied assumption dies. Which family you get is set by the bed slope (where the
> zero sits relative to the pole); which member of the family you get is set by the control
> depth (which side of them you start on).

The animation answers four questions:

1. Given a channel, a discharge, a bed slope and a control depth — **what profile is this,
   and which way does the surface go?**
2. **Why** does the surface flatten onto the normal-depth line but meet the critical-depth
   line vertically?
3. **Where does the control sit, and why?** (Wave speeds V ± √(gD) answer this on screen.)
4. **How long is the backwater?** — the direct-step method, drawn as a staircase, with its
   convergence to the exact profile made visible.

---

## 2. Theory

### 2.1 The governing equation

Steady, gradually varied flow in a prismatic channel:

```
dy/dx = (S₀ − S_f) / (1 − Fr²)
```

with, for a section of area A, wetted perimeter P, top width T and hydraulic radius R = A/P:

```
S_f = [ n Q / (A R^⅔) ]²        Manning applied locally
Fr² = Q² T / (g A³)             general-section Froude number
E   = y + Q² / (2 g A²)         specific energy
```

x is measured positive downstream; g = 9.81 m/s². The animation supports rectangular,
trapezoidal and triangular sections, with

| shape | A | P | T |
|---|---|---|---|
| rectangular | b y | b + 2y | b |
| trapezoidal | (b + m y) y | b + 2y√(1+m²) | b + 2 m y |
| triangular | m y² | 2y√(1+m²) | 2 m y |

### 2.2 The research-level reading the scene is built on

Written as `dy/dx = f(y)`, the GVF equation is an **autonomous first-order ODE in y** — the
distance x appears only through the derivative. Its whole qualitative behaviour therefore
follows from the shape of f(y), which the animation plots directly as the **phase portrait**
(bottom-left panel, depth on the vertical axis so it shares an axis with the physical
profile above it):

- **Numerator zero, S_f = S₀ ⟹ y = yₙ.** Here f = 0: the surface is parallel to the bed.
  Because f changes sign across yₙ *in the direction of integration*, yₙ is a **stable fixed
  point** — every profile that can reach it approaches it asymptotically, never crossing it.
  This is why backwater curves flatten out rather than terminating.
- **Denominator zero, Fr = 1 ⟹ y = y꜀.** Here f → ±∞: the computed surface turns vertical.
  The gradually-varied assumptions (hydrostatic pressure, one-dimensional gradual change)
  are violated, so the real flow resolves it with a *rapidly* varied feature — a hydraulic
  jump, a free overfall or a gate. The pole is the honest boundary of the theory.
- **Direction of march.** Subcritical flow (y > y꜀) transmits information upstream
  (V − √(gD) < 0), so its control is downstream and integration marches upstream: dy/ds =
  −dy/dx. Supercritical flow is controlled from upstream: dy/ds = +dy/dx. The triangular
  arrows on the phase portrait show sign(dy/ds) at each depth — they always point toward yₙ
  and away from nothing else, which is the attractor statement made visible.

Slope classification then reduces to *where the zero sits relative to the pole*:
yₙ > y꜀ mild (M), yₙ < y꜀ steep (S), yₙ = y꜀ critical (C), and for S₀ ≤ 0 there is no zero
at all — the numerator is negative everywhere — giving the horizontal (H) and adverse (A)
families with only zones 2 and 3.

### 2.3 Numerical scheme

The profile is integrated from the control depth by **classical RK4** in the marching
coordinate s, with an adaptive step

```
ds = clamp( 0.0012·y / |dy/dx| , 0.02 m , 400 m )   and   ds ≤ 0.05·|y − y꜀| / |dy/dx|
```

The second limiter is what keeps the curve smooth as it approaches the pole. Integration
stops when

| condition | reported end state |
|---|---|
| \|y − yₙ\| ≤ 0.01 yₙ | "approaches the NDL asymptotically (within 1 %)" |
| \|1 − Fr²\| < 1.5×10⁻³ or \|y − y꜀\|/y꜀ < 0.004 | "meets the CDL vertically — GVF invalid" |
| y → 0, or length > 4000 × the depth scale | "depth → 0" / "(truncated…)" |

The **direct step method** is computed independently over the same depth interval:

```
Δx = (E₂ − E₁) / (S₀ − S̄_f),      S̄_f = (S_f1 + S_f2)/2
```

with N equal depth increments (N = 1, 2, 5, 10, 25, 50, 100, 250 from the slider).

### 2.4 Self-checks displayed every frame

| check | what it proves |
|---|---|
| `S_f(yₙ) ÷ S₀ = 1.0000 ✓` | the bisection normal-depth solver really solves Manning's equation |
| `Fr(y꜀) = 1.0000 ✓` | the critical-depth solver really solves Q²T/(gA³) = 1 |
| `∫(S₀ − S_f)dx ÷ ΔE = 1.0000 ✓` | the depth-form integration is consistent with the energy form dE/dx = S₀ − S_f |
| `N-step ÷ RK4 length` | the direct-step approximation converges (0.887 at N = 5 → 1.000 ✓ at N = 250 for the default M1) |

### 2.5 Verified numbers

Both worked-example presets were checked against hand calculations:

**Worked example — S1** (rectangular, b = 2 m, n = 0.014, S₀ = 0.035, Q = 0.75 m³/s,
control depth 1.25 m):

| quantity | animation | hand / notes |
|---|---|---|
| yₙ | 0.123 m | 0.1227 m |
| y꜀ | 0.243 m | 0.243 m |
| classification | S (steep), Zone 1 → **S1** | S1 |

**Worked example — M1 backwater** (rectangular, b = 50 m, n = 0.03, S₀ = 0.0005,
Q = 112.63 m³/s, afflux to 3.5 m):

| quantity | animation | hand / notes |
|---|---|---|
| yₙ | 2.003 m | 2.0 m (assumed uniform at section 1) |
| y꜀ | 0.803 m | 0.803 m |
| E₁, E₂ | 2.0670 m, 3.5211 m | 2.0646 m, 3.5211 m |
| S_f at 3.5 m | 8.355×10⁻⁵ | 8.46×10⁻⁵ |
| single-step Δx, y₀ → yₙ | **6.98 km** | 7.1 km |
| classification | M (mild), Zone 1 → **M1** | M1 |

The 6.98 km against 7.1 km is not a discrepancy in the physics: the notes round R^⅔ to four
figures at two places, which shifts S̄_f by about 1 % and the length by the same. Carrying
full precision through the identical formula gives 6.98–7.03 km depending on where you
round. This is worth showing students — it is a clean example of how a small rounding in a
*difference* of two nearly equal slopes propagates into a large relative error in the
answer.

**Solver spot check (trapezoid):** b = 3 m, m = 2, n = 0.020, S₀ = 0.002, Q = 20 m³/s gives
yₙ = 1.533 m; feeding that depth back through Manning returns Q = 19.999 m³/s, and
Fr(y꜀) = 1.000000.

### 2.6 Factors table — sliders to classical controls

| slider | classical role | what changes on screen |
|---|---|---|
| section shape, b, m | geometry A(y), P(y), T(y) | both yₙ and y꜀ move; the whole classification can flip |
| Manning n | roughness | yₙ only (y꜀ is independent of n) — the zero of the numerator slides |
| discharge Q | flow | both yₙ and y꜀; y꜀ ∝ Q^⅔ in a rectangle |
| bed slope S₀ (signed log) | the classification control | the zero moves past the pole: M → C → S; S₀ ≤ 0 removes the zero entirely (H, A) |
| control depth y₀ | the boundary condition | which zone, hence which family member; also which end controls |
| N (direct step) | discretisation | staircase resolution and its convergence ratio |

---

## 3. Description of the tool

**Left panel — controls.** Section shape and dimensions; Manning n; discharge (log slider);
bed slope on a *signed* log slider whose centre is exactly zero (left of centre = adverse);
a sweep button for the slope; the control depth; a 4 × 3 grid of one-click presets for all
twelve profile types on one channel (b = 5 m, n = 0.015, Q = 10 m³/s, so only the slope and
the control depth change between them); the direct-step N slider; and display toggles.

**Top canvas — longitudinal profile.** Bed (tilt schematic, true fall printed in the
footer), water body, free surface, energy grade line, the parallel NDL and CDL, zone
shading, the control section marked with a vertical red line, the violet direct-step
staircase, and water particles moving at the true local velocity V = Q/A(y) — they visibly
accelerate where the flow is shallower. Depths and depth lines are true to a stated vertical
scale; the reach length and vertical exaggeration are printed in the header, and the
particle time-compression factor ("1 s ≈ 89 s of real flow") is in the readout.

**Bottom-left canvas — phase portrait.** dy/dx (signed logarithmic axis) against depth,
sharing the depth axis conceptually with the profile above. The blue dot on the vertical
dy/dx = 0 line is yₙ; the amber horizontal asymptote is y꜀. Triangles give sign(dy/ds), the
direction the depth travels as you march away from the control. The red marker is the
control section — or, during a march, the travelling probe, so the same physical point is
visible in both representations at once.

**Bottom-right canvas — family map.** Every profile the current bed can carry, each
integrated from a representative control depth in its zone, drawn on one bed with the NDL
and CDL. The active one is highlighted; true lengths are printed in brackets (each curve's
horizontal scale is normalised to the panel, since an M3 is metres long and an M1 kilometres).

**Right panel — readout.** Classification (yₙ, y꜀, S꜀, slope class, zone) with the profile
name chip; the equation evaluated term by term at the control (numerator, denominator,
dy/dx, which end controls); the integrated reach length and end condition; the direct-step
results; and the four self-checks.

**Bottom buttons.** Pause (freezes all physics, not just the drawing), March from the
control, Sweep y₀, and the two worked-example presets.

---

## 4. How to use it

### Quick start
Open the file, press **March from the control**, and watch the profile being integrated
while the probe rides the dy/dx curve.

### A ~20 minute classroom sequence

1. **(2 min) Start at the default M1.** Ask: the control is a dam at the downstream end.
   Which way does the water surface go from it, and why? Read dy/dx = 7.9×10⁻⁴ > 0 from the
   readout — backwater.
2. **(3 min) Press March from the control.** *Pause when the probe is about halfway.* Ask
   what the two red/cyan markers have in common — the answer is that they are the *same
   point* in two representations. Note the tangent segment on the surface: its slope is the
   number the phase portrait is showing.
3. **(3 min) Let the march finish.** The profile flattens onto the NDL and stops at 1 % of
   yₙ. Ask why it never actually reaches yₙ. Point at the phase portrait: the curve crosses
   zero there, so dy/dx → 0 and the approach is asymptotic. Normal depth is an attractor.
4. **(2 min) Press M3.** Now the control is a sluice gate upstream, the flow is
   supercritical, and the profile ends at "meets the CDL vertically — GVF invalid". Ask what
   physically happens there. (A hydraulic jump — link to the jump topic.)
5. **(2 min) Turn on wave speeds V ± √(gD).** In the M1 case one arrow points upstream
   (green); in M3 both point downstream. *This is the entire justification for where the
   control sits and which way we integrate.*
6. **(4 min) Sweep S₀.** Watch the NDL slide down through the CDL: M → C → S. Stop at each.
   Ask the class to predict the profile name before releasing the sweep. In the phase
   portrait, the zero passes through the pole — that single event is the whole
   classification table.
7. **(2 min) Press H2, then A2.** No normal depth at all: the numerator is negative
   everywhere, so only zones 2 and 3 exist. Ask why there is no H1 or A1.
8. **(4 min) Worked example — M1 backwater.** Reproduce the classroom answer: single step
   y₀ → yₙ gives 6.98 km. Now raise N. At N = 5 the staircase is visibly cruder than the
   integrated curve and the ratio reads 0.876; at N = 250 it reads 1.000 ✓. Ask why one step
   under-estimates, and why nobody quotes a backwater length "to yₙ" without a tolerance.

### Assessment-style questions

1. A rectangular channel 5 m wide, n = 0.015, carries 10 m³/s on a bed of slope 0.001. A
   weir holds the depth at 1.8 m. Classify the profile and state whether the surface rises or
   falls in the downstream direction. Check with the animation.
2. Without changing Q or the section, what is the smallest bed slope that makes this channel
   steep? (Answer: S꜀ — read it from the readout, then set S₀ just above it and confirm the
   family flips.)
3. Explain why an M2 profile and an S2 profile both approach yₙ, yet one is a drawdown seen
   from the downstream end and the other from the upstream end.
4. In the M1 backwater example, the notes give 7.1 km and the animation gives 6.98 km. Both
   use the same equation. Identify the source of the difference and estimate how sensitive
   Δx is to a 1 % error in S̄_f.
5. Sketch dy/dx against y for a mild slope, marking the zero and the pole, and use it to
   argue that a profile in zone 2 cannot cross into zone 1.

---

## 5. Assumptions and limitations

- **Steady, prismatic, gradually varied flow.** Channel section constant along the reach,
  hydrostatic pressure, α = β = 1, Manning's equation applied locally as the friction
  closure. These are the standard textbook assumptions and are stated on the panel.
- **The bed tilt in the longitudinal panel is schematic.** Depths, the NDL, the CDL and the
  energy line are all drawn to a stated vertical scale, and the true fall or rise over the
  reach is printed in the footer; only the drawn *tilt* of the bed is clamped, because at a
  slope of 0.0005 over 7 km the true drop would otherwise dominate the picture. Nothing
  quantitative is read off the tilt.
- **The energy grade line is clipped** at 1.35 × the depth range. In supercritical flow the
  velocity head can be several times the depth, and drawing it in full would crush the water
  body out of sight. The value is always available in the readout.
- **Profile lengths are truncated** at 1 % of yₙ (or at 4000 × the depth scale for H and A
  profiles, which are formally infinite). This is stated on screen as the end condition.
- **The family map normalises each curve's horizontal scale** to the panel width, because
  members of one family differ in length by orders of magnitude. The *shapes* are exact
  integrations and the true lengths are printed; only the horizontal stretch is per-curve.
- **What happens at the CDL is not modelled here.** The animation stops honestly at the pole
  and says the theory is invalid; the hydraulic-jump module picks the story up from there.
- **Particle paths are illustrative in the vertical**: each particle is held at a fixed
  fraction of the local depth. Their *horizontal speed is exact* — V = Q/A(y) at the local
  depth — and the time compression is stated in the readout.

---

## 6. Technical notes

Single self-contained HTML file, no build step, no external libraries, no network access
required. 2D canvas, dark theme, responsive below 1150 px. RK4 integration with the adaptive
step described in §2.3; normal and critical depths by 80-iteration bisection. Pause freezes
the simulation clock, so particles, the march and the sweeps all resume exactly where they
stopped. Every readout value, slider chip and the status chip carry stable element ids
(`o-*`, `v-*`, `#chip`), and `window.LAB` exposes the state and solver for headless
verification or telemetry. MIT licensed; cite OpenHydroLab (see `CITATION.cff`).

---

## 7. References

- Chow, V. T. (1959). *Open-Channel Hydraulics.* McGraw-Hill. — Chapters 9–10: classification
  of flow profiles and methods of computation; the original systematic M/S/C/H/A treatment.
- Henderson, F. M. (1966). *Open Channel Flow.* Macmillan. — Chapter 5, for the reading of
  GVF profiles as solution families and the role of the control section.
- French, R. H. (1985). *Open-Channel Hydraulics.* McGraw-Hill. — direct step and standard
  step methods, and their error behaviour.
- Sturm, T. W. (2010). *Open Channel Hydraulics*, 2nd ed. McGraw-Hill. — numerical
  integration of the GVF equation, including the behaviour near the critical singularity.
- Subramanya, K. (2009). *Flow in Open Channels*, 3rd ed. Tata McGraw-Hill. — worked backwater
  problems of the type reproduced by the presets.
