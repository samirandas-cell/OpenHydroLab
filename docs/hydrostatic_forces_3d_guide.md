# Hydrostatic Force in Three Dimensions — teaching guide

`animations/hydrostatic_forces_3d.html` + `animations/vendor/three/` · WebGL · fully offline · MIT

Companion to the 2D module documented in `hydrostatic_forces_guide.md`. The 2D module owns the
*pressure diagram*; this one owns the *pressure solid* and the step-by-step working.

---

## 1. Purpose

Two things the flat module cannot do, and one it deliberately leaves out.

**The pressure prism is a solid, so build it as one.** In 2D the prism can only be drawn as a
profile — `p` against distance along the plate — and the student has to take on trust that its
area, times the width, is the force. In 3D it is an actual object standing on the plate,
coloured by pressure, that you can orbit around. The statement "F_R is the volume of the
pressure prism and the centre of pressure is under its centroid" stops being a slogan and
becomes something you can see from any angle. A wedge is fatter at the deep end; that is the
entire reason the centre of pressure sits below the centroid.

**The shape of the plate starts to matter.** A flat drawing has no reason to offer anything but
a rectangle. Here the plate can be a rectangle, a triangle, a circle or a semicircle — the four
entries students are handed in the standard table of geometric properties. Changing the shape
changes `A`, `ȳ` and `I_xc` and therefore moves both the force and the centre of pressure, so
the table earns its place instead of being a page to memorise. The module re-derives all three
properties numerically from each shape's own chord width and shows the comparison, which means
the table itself is verified on screen.

**The worked-solution panel.** Whatever the sliders are set to, the right-hand panel writes out
the full solution: formula, substitution with the actual numbers, result, and one plain-English
sentence saying *why* that step exists. It can be stepped through one line at a time, and the
scene follows — at "depth of the centroid" the scene shows only the centroid and its depth
line; at "resultant force" only the prism and the force. It is the missing link between a
picture and the thing a student has to write in an exam.

What is left out: the fluid-side toggle for curved surfaces (real vs imaginary volume) lives in
the 2D module, where the hatched region reads more clearly.

---

## 2. Theory

### 2.1 One formula for four shapes

```
h_c = h_top + ȳ sin θ            ȳ = centroid, measured ALONG the plane
F_R = ρ g h_c A
Δy  = I_xc /(y_c A) = I_xc sin θ /(h_c A)     ← finite as θ → 0
s_R = ȳ + Δy                     from the upper edge, along the plane
h_R = h_top + s_R sin θ
```

Writing Δy as `I_xc sinθ/(h_c A)` removes the `y_c = h_c/sinθ` singularity, so one expression
covers horizontal, inclined and vertical for every shape. `y_c` is still displayed, and still
runs off to infinity as θ → 0, which is exactly the point worth making out loud.

| shape | extent along the plane | A | ȳ from the upper edge | I_xc |
| --- | --- | --- | --- | --- |
| Rectangle | L | b L | L/2 | b L³/12 |
| Triangle, apex up | L | b L/2 | 2L/3 | b L³/36 |
| Circle | D | π D²/4 | D/2 | π D⁴/64 |
| Semicircle, flat edge up | R | π R²/2 | 4R/3π | (π/8 − 8/9π) R⁴ = 0.1098 R⁴ |

### 2.2 The research-level reading the scene is built on

The pressure field on a plane surface is an affine function of position, so the traction
distribution is a *prism* — a solid whose cross-section is the plate and whose top face is a
plane. Two facts follow immediately and are usually taught as separate results:

* the resultant equals the prism's volume, i.e. the mean of a linear function over the area,
  which is its value at the centroid: `F_R = p_c A`;
* the resultant's line of action passes through the prism's centroid, which is displaced from
  the plate's centroid by the second moment of area — the `I_xc/(y_cA)` term.

Seeing the solid makes the pair look like what they are: one statement about a wedge.

For the curved surface the module keeps the result the 2D module is built around — the traction
on a circular arc is radial, so it has no moment about the centre of curvature — but shows it
in the geometry that actually explains it. Orbit until you are sighting down the pivot axis and
every pressure arrow points at the same line.

### 2.3 Numerical scheme

Algebraic; no time stepping. What is numerical is the verification, and it uses a substitution
per shape so the quadrature is exact to machine precision rather than stalling on the square-root
edge of a circle:

| shape | integration variable | integrand |
| --- | --- | --- |
| rectangle, triangle | t directly | smooth already |
| circle | t = R(1 − cos u), u ∈ [0, π] | 2R² sin²u |
| semicircle | t = R sin v, v ∈ [0, π/2] | 2R² cos²v |

With those substitutions, 4000 midpoint nodes reproduce A, ȳ and I_xc to ~1e-8.

### 2.4 Self-checks displayed every frame

| readout | meaning |
| --- | --- |
| `A from ∫w dt ÷ table A` | the shape's area, rebuilt from its own chord width |
| `ȳ from ∫t w dt ÷ table ȳ` | its centroid |
| `I_xc from ∫(t−ȳ)²w dt ÷ table` | its second moment — the table row is being checked |
| `∮p dA ÷ ρg h_c A` | the force formula |
| `∮t p dA / ∮p dA ÷ s_R` | the centre-of-pressure formula |
| curved: two force components and `\|net moment\| ÷ (F_R·R)` | as in the 2D module |

Swept over 5364 combinations (4 shapes × θ × L × b × h_top × ρ, plus the curved gate over R,
h_O, span, b, ρ): no non-finite values, worst geometric-property disagreement 9.9 × 10⁻⁸, worst
force disagreement 2.6 × 10⁻⁸, and the moment residual about the pivot axis never exceeded
1.3 × 10⁻¹⁵.

### 2.5 Verified numbers

| preset | quantity | tool | expected |
| --- | --- | --- | --- |
| Vertical plate, 1 m × 2.5 m, top edge at the surface | F_R | 30.66 kN | 30.66 kN |
| | s_R | 1.6667 m | 2L/3 = 1.667 m |
| Dam face at 45°, 10 m deep, per metre | F_R | 693.67 kN | 693.7 kN |
| | y_R | 9.4281 m | 9.43 m |
| Inclined gate at 30°, hinged 2 m down | F_R | 161.87 kN | 161.86 kN |
| | Δy | 0.13636 m | 0.14 m |
| Radial gate, R = 2 m, 2 m wide, pivot 3 m down | F_x / F_v | 156.96 / 179.36 kN | 156.96 / 179.32 kN |
| | x̄ | 0.9480 m | 0.948 m |
| | net moment about the axis | 3 × 10⁻¹¹ N·m | 0 |

Shape properties at L = 3 m, b = 2 m: rectangle A = 6.000 m², I = 4.500 m⁴; triangle A = 3.000,
ȳ = 2.000, I = 1.500; circle (D = 3) A = 7.0686, I = 3.9761; semicircle (R = 3) A = 14.1372,
ȳ = 1.2732, I = 8.8903. All match the table to eight figures.

### 2.6 Factors table

| slider | symbol | what it controls |
| --- | --- | --- |
| Angle to free surface | θ | inclination; 0° and 90° are the horizontal and vertical cases |
| Size along the plane | L, D or R | the shape's defining dimension — the label follows the shape |
| Width | b | rectangle and triangle only; the circle and semicircle are set by their own size |
| Depth of upper edge | h_top | submergence |
| Radius / pivot depth / arc span / gate width | R, h_O, — , b | the circular gate |
| Density | ρ | water 1000, seawater 1025, oil 860, mercury 13600 |

---

## 3. Description of the tool

**The scene.** A tank drawn from the inside — only its far walls are rendered, so nothing hazes
over the subject — with the free surface marked. The plate carries the pressure prism as a
translucent solid coloured from deep blue (low pressure) to amber (high). The resultant is a
solid arrow arriving at the centre of pressure from the wetted side; the centroid and centre of
pressure are marked, with the Δy gap bracketed between them. Dashed construction lines show
`h_c` measured vertically and `y_c` measured up the plane to where the plane would cut the free
surface. Orbit, zoom and a slow turntable are available; pause stops the turntable.

Labels are HTML positioned by projecting the world point each frame, with a collision pass that
pushes overlapping captions apart. That avoids the usual 3D sprite problem, where a label sized
in world units holds a fixed pixel size while the geometry it annotates changes by orders of
magnitude across the sliders.

**The curved mode** is a real cylindrical gate of finite width with its pivot axis drawn. `F_x`
and `F_v` are placed on their true lines of action, which meet at a point; the resultant is
drawn from that point and extended, so it is seen to run through the pivot axis rather than
merely near it.

**The worked-solution panel** (default tab) writes the whole calculation out: nine steps for a
plane surface, seven for a curved one. `◀ ▶` walk through them, `Show all` returns to the full
list, and the scene hides everything not relevant to the current step — including the captions,
so at step 2 only the centroid and its depth line remain.

**The readout tab** is the conventional table of values plus the five self-checks.

---

## 4. How to use it

### Quick start

Press ▶ four times. Step 4 leaves the prism and the force arrow alone in the scene, with
`F_R = p_c A` written out beside it.

### A ~25 minute classroom sequence

1. **The solid (4 min).** Default view. Orbit around the prism. Ask what its volume is. Turn the
   prism off and on to show it is standing on the plate.
2. **Why the CP is below the centroid (4 min).** Point at the fat end. Slide `h_top` deeper: the
   wedge becomes a slab, and the centre of pressure slides up onto the centroid. Slide θ to 0
   and it becomes a slab exactly.
3. **Walk the working (6 min).** Switch to step 1 and press ▶ through to step 8, reading the
   *why* line at each. Students copy it down; it is the model answer for any settings you like.
4. **Shape matters (5 min).** Press Triangle. A and ȳ both change — the prism now tapers to a
   point at the shallow end. Compare `s_R` with the rectangle. Then Circle, then Semicircle.
   Open the Readout tab and point at the three geometric-property checks: the table on their
   formula sheet is being re-derived in front of them.
5. **The curved gate (6 min).** Press the radial-gate preset, then walk steps 1–7. At step 7,
   orbit until you sight down the pivot axis. Every arrow points at it; the net moment is zero.

### Assessment-style questions

* A triangular gate, apex up, 2 m base and 3 m high, lies at 40° with its apex 1 m below the
  surface. Find F_R and the centre of pressure. Check with the module, then explain why `s_R` is
  closer to the base than for a rectangle of the same height.
* Why does the centre of pressure of a circular plate not depend on b?
* At what depth does Δy fall below 1 % of the plate length, for a 3 m vertical rectangle?
* A radial gate's hoist is sized for the gate's weight only. Justify this from the scene.

---

## 5. Assumptions and limitations

* Static fluid, constant density, gauge pressure with the free surface as datum.
* `I_xyc = 0` for all four shapes as drawn, so the centre of pressure lies on the vertical
  centre-line and no lateral offset is shown.
* The surface is fully submerged; partially submerged plates are not modelled.
* The pressure prism's *height* is drawn to a scale chosen for legibility (its peak is set to
  0.42 × the plate's extent). Heights within one prism are exactly proportional to pressure — it
  is the prism's shape, not its absolute thickness, that is quantitative. Everything else in the
  scene is true scale.
* Force arrows and markers are drawn with depth-testing off so they stay visible where they end
  inside the translucent prism. They are annotations, not geometry.
* The tank is a container for the picture; its extent carries no physics.
* Gate weight, trunnion friction and seal friction are excluded — hydrostatic actions only.

---

## 6. Technical notes

* **Not a single file.** Three.js is vendored beside the page in `vendor/three/`
  (`three.min.js`, UMD r160, plus a mechanically rewritten `OrbitControls.js`). To share the
  module, send the folder, not just the `.html`. Nothing is loaded from a third-party host.
* Both are **classic `<script src>` tags, never ES modules**: browsers block module imports from
  a `file://` origin under CORS, so an ES-module build works over localhost and shows a blank
  page the moment a student double-clicks the file. Verified from `file://` on Chromium, Firefox
  and WebKit.
* `three.min.js` prints one upstream deprecation warning on load. It is a `console.warn`, the
  build is pinned and vendored, and it is the only console output.
* Physics is in a classic script at global scope (`st`, `SHAPES`, `solve`, `solvePlane`,
  `solveCurved`), reachable from `page.evaluate` at machine precision.
* Stable ids: readout values `o-*`, slider chips `v-*`, sliders `s-*`, classification `#chip`.
* Labels are DOM nodes under `#labels`, each tagged with `data-tag`, so overlap can be measured
  in screen space by a test rather than eyeballed.
* Sliders are clamped rather than allowed to reach impossible states; a horizontal plate is held
  at least 0.05 m below the surface.
* Panels stack below 1250 px; no horizontal page scroll at 1560, 1100 or 430 px.

---

## 7. References

* Munson, Young & Okiishi, *Fundamentals of Fluid Mechanics* — §2.8 and Fig. 2.18 (the
  geometric-property table reproduced and checked here), §2.10 for curved surfaces.
* Chadwick, Morfett & Borthwick, *Hydraulics in Civil and Environmental Engineering* — the
  plate, dam and quadrant-gate worked examples used as presets.
* USACE, *Design of Spillway Tainter Gates*, EM 1110-2-2702.
* three.js r160, MIT — vendored, see `vendor/three/README.md`.
