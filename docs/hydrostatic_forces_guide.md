# Hydrostatic Forces on Submerged Surfaces — teaching guide

`animations/hydrostatic_forces.html` · single file · 2D canvas · fully offline · MIT

---

## 1. Purpose

Students meet this topic as three disconnected recipes: `F = γh_cA` for a plane, a strange
correction `y_R = y_c + I_xc/(y_cA)` that nobody can motivate, and a completely different
procedure for curved surfaces involving an "imaginary" volume of water. Exams are then failed
in predictable places — the centre of pressure is put at the centroid, `y` is confused with
`h`, the vertical component is given the wrong sign, and the horizontal component of a curved
surface is computed on the curve's own area instead of its projection.

The module replaces all of that with **one idea seen in two linked pictures**:

> The resultant force is the **volume of the pressure prism**, and the centre of pressure is
> the **centroid of that prism**.

Everything else follows. A horizontal surface has a rectangular prism, so the centre of
pressure *is* the centroid. A vertical surface breaking the free surface has a triangular
prism, so it sits at 2L/3. An inclined surface interpolates continuously between them. And a
curved surface cannot have a single prism at all — which is exactly why it must be split into
a horizontal component (a plane-surface problem on the projection) and a vertical component
(the weight of the prism of fluid standing over the surface).

The module's payoff is a result students never see derived: because the pressure on a circular
arc is everywhere **radial**, its resultant passes through the centre of curvature, so a radial
(Tainter) gate carries **zero hydrostatic moment about its pivot at any head**. The animation
proves this numerically, live, at every slider setting.

---

## 2. Theory

### 2.1 Plane surfaces

With the free surface as datum and `h` measured downward,

```
p(h) = ρ g h                                     (gauge)
F_R  = ∫ p dA = ρ g h_c A                        h_c = depth of the centroid
y_R  = y_c + I_xc /(y_c A)                       y measured along the plane
I_xc = b L³/12                                   rectangle, width b, length L
```

`y_c = h_c / sinθ` diverges as θ → 0, which is why the horizontal case is usually taught
separately. It does not have to be. Substituting `y_c = h_c/sinθ` and `A = Lb`,

```
Δy = I_xc /(y_c A) = L² sinθ / (12 h_c)
```

which is finite for every θ and correctly gives **Δy = 0 for a horizontal surface**. The module
computes Δy from this form, so a single expression covers horizontal, inclined and vertical
without a special case, and the slider can be swept continuously through θ = 0.

Two limits worth pointing at on screen:

* `h_top = 0` (upper edge at the surface) gives Δy = L/6 and hence `s_R = 2L/3` — **independent
  of θ**. The prism is a triangle whatever the inclination.
* `h_top → ∞` gives Δy → 0. Deeply submerged surfaces feel an almost uniform pressure, so the
  centre of pressure migrates onto the centroid.

### 2.2 Curved surfaces

For an arc of radius `R` and span `span`, running from its invert `C` (directly below the pivot
`O`, at depth `h_O + R`) up to `A`:

```
F_x = ρ g h_c A_proj      on the VERTICAL PROJECTION of the surface
      A_proj = R(1 − sinψ)·b ,  h_c = h_O + R(1 + sinψ)/2
F_v = ρ g V               V = the vertical prism between the surface and the
                              free-surface level, upward if the fluid is below
      V = b [ h_O R c + R²(cs + arcsin c)/2 ]
      x̄ = [ h_O R²c²/2 + R³(1 − s³)/3 ] / [ h_O R c + R²(cs + arcsin c)/2 ]
F_R = √(F_x² + F_v²) ,    tan α = F_v / F_x
```

with `s = sinψ`, `c = cosψ` and ψ the angular position of the upper end. For a quadrant
(span = 90°, s = 0, c = 1) these collapse to the textbook `V = b(h_O R + πR²/4)` and, when
`h_O = 0`, to `x̄ = 4R/3π`.

### 2.3 The research-level reading the scene is built on

The traction on any surface element is `p n`, normal to the surface. On a **circular** arc,
`n` is radial, so `r × p n dA = 0` pointwise about the centre of curvature. The moment of the
whole pressure field about `O` is therefore identically zero — not approximately, not for a
particular head, but as an algebraic identity. Segmental (Tainter) gates are designed around
this: the hoist has to lift the gate's own weight and beat the trunnion friction, and nothing
else, however deep the reservoir. That is the "aha" the curved scene is arranged to deliver.

The animation shows the identity as a *cancellation of two large numbers* rather than as an
absence, because the cancellation is the instructive part:

```
moment of F_x about O = F_x · (h_c + Δh − h_O)      (clockwise)
moment of F_v about O = F_v · x̄                    (anticlockwise)
```

Both grow with the head; their difference stays at zero to machine precision.

The same fact is drawn a second way. The two components act on their own lines of action,
which intersect at a point P\*. The resultant of two forces passes through their intersection,
so drawing `F_R` from P\* and extending it must — and visibly does — pass through `O`.

### 2.4 Numerical scheme

There is no time integration; the state is algebraic and exact. What *is* numerical is the
verification. Every frame, alongside the closed forms above, the module evaluates

* plane: `Σ p ΔA` and `Σ s p ΔA / Σ p ΔA` over 4000 strips of the plate;
* curved: `∮ p n_x dA`, `∮ p n_z dA` and the two moments about O over 4000 arc elements.

These are independent computations from the same physical law, not rearrangements of the
formulas being checked.

### 2.5 Self-checks displayed every frame

| readout | meaning | value |
| --- | --- | --- |
| `∮p dA ÷ ρg h_cA` | plane force, quadrature vs formula | 1.000000 ✓ |
| `∮s·p dA / ∮p dA ÷ s_R` | plane centre of pressure | 1.000000 ✓ |
| `∮p·n_x dA ÷ γh_cA_proj` | curved horizontal component | 1.000000 ✓ |
| `∮p·n_z dA ÷ γV` | curved vertical component | 1.000000 ✓ |
| `\|net moment\| ÷ (F_R·R)` | zero-moment identity, dimensionless | ~1e-16 ✓ |

Swept over 4050 parameter combinations (θ, L, h_top, R, h_O, span, b, ρ, both fluid sides), the
worst disagreement was 2.6 × 10⁻⁸ and the worst moment residual 1.2 × 10⁻¹⁵. No combination
produced a non-finite value.

### 2.6 Verified numbers

Every preset reproduces the answer from the worked problem it is named after.

| preset | quantity | tool | expected |
| --- | --- | --- | --- |
| Vertical plate, B=1 m, L=2.5 m, top edge at surface | F_R | 30.66 kN | 30.66 kN |
| | y_R | 1.667 m | 1.667 m |
| Dam face at 45°, 10 m deep, per metre width | F_R | 693.66 kN | 693.7 kN |
| | y_R along the face | 9.428 m | 9.43 m |
| Inclined gate at 30°, hinged 2 m down | F_R | 161.87 kN | 161.86 kN |
| | Δy | 0.136 m | 0.14 m |
| | moment about the upper edge | 264.87 kN·m | → B = 88.5 kN with the gate weight |
| Gate on a shaft at 53.13°, 3.5 m × 2 m, h = 3.065 m | F_R | 114.34 kN | 114.3 kN |
| | Δy | 0.490 m | 0.49 m |
| Quadrant gate, R=1 m, 3 m wide, O at the surface | F_x | 14.72 kN | 14.72 kN |
| | F_v | 23.11 kN | 23.1 kN |
| | x̄ = 4R/3π | 0.424 m | 0.424 m |
| | F_R | 27.40 kN | 27.4 kN |
| Radial gate, R=2 m, 2 m wide, O at 3 m | F_x | 156.96 kN | 156.96 kN |
| | line of action below O | 1.083 m | 1.08333 m |
| | F_v | 179.36 kN | 179.32 kN |
| | x̄ | 0.948 m | 0.948 m |

Small differences (693.66 vs 693.7, 179.36 vs 179.32) come from rounding in the printed
solutions — 14.14 for 10√2, and a rounded prism volume — not from the model.

The horizontal-plate case is also exact: a 1 m × 2.5 m plate lying flat at 2 m depth gives
p = 19.62 kPa and F = 49.05 kN, with the centre of pressure on the centroid.

### 2.7 Factors table — sliders to physical controls

| slider | symbol | what it controls in practice |
| --- | --- | --- |
| Angle to free surface | θ | plate inclination; 0° and 90° are the horizontal and vertical cases |
| Plate length along plane | L | the dimension in the plane of the surface, *not* the depth |
| Depth of upper edge | h_top | submergence; drives Δy → 0 |
| Radius | R | arc radius = the gate's radial arm |
| Depth of pivot | h_O | head on a radial gate |
| Arc span | — | from a shallow segment to a full quadrant |
| Width into the page | b | gate width; scales F but not the centre of pressure |
| Density | ρ | water 1000, seawater 1025, oil 860, mercury 13600 |

---

## 3. Description of the tool

**Left viewport — the physical section.** A tank (or reservoir, wall and gate) drawn to true
scale. Pressure arrows are drawn normal to the surface with lengths proportional to the local
`p = ρgh`, and their tails trace the pressure prism *in place*. The centroid and the centre of
pressure are both marked, with the Δy gap bracketed between them, and the resultant is drawn
arriving at the centre of pressure from the wetted side.

**Right viewport — the diagram.** For a plane surface, the pressure prism plotted as `p`
against distance `s` along the plate, with the prism area shaded, the plate's centroid marked
with a dashed line and the prism's centroid — the centre of pressure — with a solid one. A
faint dashed tie-line links the centre of pressure in the section to the same point on the
diagram, so the two pictures are visibly the same object.

For a curved surface, the diagram becomes a two-step construction: *Step 1* draws the pressure
prism on the vertical projection (an ordinary plane-surface problem), *Step 2* draws the force
triangle and the two opposing moments about O as bars that cancel.

**Travelling probe.** A marker sweeps the wetted surface and can be dragged. It reports the
local depth and pressure and, on the arc, states that the traction is normal to the surface and
therefore aimed at O. On a plane surface it appears simultaneously on the section and on the
pressure diagram.

**Fluid-side toggle (curved only).** Switches the water from outside the arc to above it. The
prism volume is unchanged; only the *direction* of `F_v` flips, and the hatched region changes
from imaginary to real. This is the single most common sign error in the topic, shown as the
one-click change it actually is.

**Sweep submergence.** Drives h_top (or h_O) up and down so the class can watch quantities move
rather than recompute them.

**Worked solution (right panel, default tab).** Whatever the sliders are set to, the panel
writes out the full solution: the formula, the substitution with the actual numbers, the boxed
result, and one plain-English sentence saying *why* that step exists. Nine steps for a plane
surface, seven for a curved one. `◀ ▶` walk through them one at a time and **the drawing follows**
— everything the current step is not about fades back, so at "slope distance to the centroid"
only the plate, the centroid, the vertical h_c drop and the y_c line up the plane remain lit,
and on the diagram the prism dims while the centre-of-pressure line stays. `Show all` returns to
the complete list and the complete scene. The `Readout` tab is the conventional table of values
plus the self-checks.

Two construction lines exist only for that walk-through and are drawn when their step is
selected: the green vertical drop to the centroid (`h_c`) and the violet line running up the
plane to where the plane would cut the free surface (`y_c`). Seeing the second one leave the
tank is the point — it is why `y_c → ∞` as θ → 0.

---

## 4. How to use it

### Quick start

Press **Vertical plate**, then **▶ Sweep submergence**, and watch Δy collapse as the plate goes
deeper. Then press **Radial gate** and watch the two moment bars stay equal and opposite.

To hand out a model answer for any configuration: set the sliders, press ▶ nine times, and read
the panel. It is the same calculation the class has to write, with their numbers in it.

### A ~25 minute classroom sequence

0. **The method, once (5 min).** Before touching anything, press ▶ through the nine steps of the
   worked solution with the default settings. The class copies it down as the template; every
   configuration afterwards is the same nine steps with different numbers.
1. **Horizontal (2 min).** Press *Horizontal*. Uniform pressure, rectangular prism, centre of
   pressure on the centroid, Δy = 0. Establish that F = pressure at the centroid × area.
2. **Vertical (5 min).** Press *Vertical plate*. The prism is now a triangle. Ask where the
   resultant acts before revealing it; most of the room will say mid-depth. Read off 2L/3.
   Point out that this is the centroid *of the prism*, not of the plate.
3. **Why the correction exists (4 min).** Press *▶ Sweep submergence*. The prism turns from a
   triangle into a near-rectangle as h_top grows, and the centre of pressure slides up onto
   the centroid. Δy is not a mysterious additive term — it is the prism's skew.
4. **Inclined (4 min).** Slide θ continuously from 90° to 0°. Watch `y_c = h_c/sinθ` run away
   to infinity while Δy stays finite and goes to zero. This is where the `y` versus `h`
   confusion is best killed: the *depth* of the centre of pressure changes smoothly the whole
   time.
5. **A real gate (4 min).** Press *Inclined gate at 30°* and read the moment about the upper
   edge, 264.87 kN·m. Ask the class to close the tutorial problem themselves by adding the
   gate's own weight (10 kg at 1.5 cos30° m) and dividing by the 3 m arm — 88.5 kN.
6. **Curved (6 min).** Press *Radial gate*. Follow Step 1 and Step 2 in the right-hand panel.
   Then toggle *Fluid above the arc* and ask what changed — magnitude or direction?
7. **The punchline.** Sweep submergence, change R, change the arc span. The net moment about O
   never leaves zero. Ask why, then drag the probe along the arc: every arrow points at O.

### Assessment-style questions

* A 2 m × 3 m plate is vertical with its top edge 1 m below the surface. Where is the centre of
  pressure? Now push it to 20 m depth. By what factor did the force change, and by what factor
  did Δy? (Force ∝ h_c; Δy ∝ 1/h_c.)
* For a plane surface whose upper edge is at the free surface, prove that the centre of
  pressure is at 2L/3 for *every* inclination. Verify with the θ slider.
* A radial gate has R = 2 m, is 2 m wide and the pivot is 3 m below the surface. Compute F_x,
  F_v and the resultant, and show the hoist load is independent of the reservoir depth.
* The fluid-side toggle changes F_v from 179.36 kN up to 179.36 kN down. Explain, in one
  sentence, why the magnitude is the same.

---

## 5. Assumptions and limitations

* Static fluid, constant density, gauge pressure with the free surface as datum. Atmospheric
  pressure acts on both faces of a real gate and cancels; adding it would change F but not the
  net thrust on the structure.
* The plane surface is a rectangle, so `I_xc = bL³/12`. Other shapes change only `I_xc` and the
  centroid position; the method is identical.
* `I_xyc = 0` is assumed, i.e. the surface is symmetric about a vertical centre-line, so the
  centre of pressure lies on that line and no lateral offset is drawn.
* The curved surface is a circular arc. The zero-moment result is a property of *circular*
  curvature and does not generalise to an arbitrary curve.
* The surface is fully submerged. Partially submerged plates are not modelled.
* The gate's own weight, trunnion friction and seal friction are not included — the module
  reports hydrostatic actions only. The classroom sequence above deliberately leaves adding
  the weight to the student.
* The free-surface ripple is cosmetic (≈1.4 px) and is stated as such; nothing else on screen
  moves without a physical reason.

---

## 6. Technical notes

* Single self-contained HTML file, no libraries, no network access, no build step. Opens by
  double-clicking; verified from `file://` as well as over http on Chromium, Firefox and WebKit.
* The physics lives in a classic `<script>` at global scope (`st`, `solve`, `solvePlane`,
  `solveCurved`), so every quantity is reachable from `page.evaluate` at machine precision
  rather than at display precision.
* Readout values carry stable `o-*` ids, slider chips `v-*`, sliders `s-*`, and the
  classification chip is `#chip`. The worked solution's controls are `#w-prev`, `#w-next`,
  `#w-all` and `#stepPos`; the current step lives in `st.step` (0 = show all) and the drawing's
  emphasis key in `stepHL`.
* The worked-solution HTML is rebuilt at most every 120 ms, so a running submergence sweep does
  not re-render the panel on every frame. The step buttons sit outside the rebuilt region, so a
  click is never lost mid-render.
* Step emphasis is applied by multiplying `ctx.globalAlpha` per element group, so `chipLabel`
  and `hatch` multiply the inherited alpha rather than setting it absolutely — otherwise dimmed
  captions would keep full-strength backgrounds and borders.
* Pause freezes the physics: the probe sweep, the submergence sweep and the surface ripple all
  advance on accumulated simulation time, never on `performance.now()` directly.
* Canvas is scaled by `devicePixelRatio`; the two viewports switch from side-by-side to stacked
  below an aspect ratio of 1.02, and the panels stack below 1250 px.
* Sliders are clamped rather than allowed to reach impossible states; a horizontal plate is held
  at least 0.05 m below the surface so it carries a non-zero force.

---

## 7. References

* Munson, Young & Okiishi, *Fundamentals of Fluid Mechanics* — §2.8 (plane surfaces, Eqs.
  2.17–2.20 and Fig. 2.18 geometric properties) and §2.10 (curved surfaces).
* Chadwick, Morfett & Borthwick, *Hydraulics in Civil and Environmental Engineering* —
  worked examples on the plate, the rockfill dam and the quadrant gate.
* USACE, *Design of Spillway Tainter Gates*, EM 1110-2-2702 — the engineering consequence of
  the radial-pressure identity.
