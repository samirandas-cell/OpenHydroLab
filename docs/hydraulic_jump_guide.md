# Hydraulic Jump — guide

Animation: [`animations/hydraulic_jump.html`](../animations/hydraulic_jump.html) · 2D, fully offline, single file.

## 1. Purpose

The hydraulic jump is where a first course in open-channel flow usually fractures.
Students have just spent two weeks being told that energy is the organising principle,
and are now told to abandon it. The animation is built to answer the three questions
that fracture creates:

1. **Why is momentum conserved across a jump but energy is not?** Not "because the book
   says so", but because the *external forces* on a control volume spanning the jump are
   all computable, while the *internal* energy conversion in the roller is not.
2. **What is the difference between alternate and sequent depths?** Two depths carrying
   the same discharge, paired two different ways: a sluice gate pairs them at equal
   specific energy, a jump pairs them at equal specific force. Seeing both pairings on
   two diagrams that share a depth axis is the point of the module.
3. **Where does the lost energy actually go, and how much of it?** Roughly half of the
   approach energy at Fr₁ = 5 — a number worth feeling rather than memorising, because
   it is the entire design rationale for stilling basins.

## 2. Theory

### The jump as a momentum problem

Take a control volume spanning the jump in a rectangular channel of unit width, on a
horizontal bed. Three things make momentum the tractable choice:

- the bed is horizontal, so the weight has no streamwise component;
- the jump is short, so boundary friction over its length is negligible;
- the pressure distribution at sections 1 and 2 is hydrostatic, because the streamlines
  there are essentially parallel (they are emphatically *not* parallel inside the roller,
  which is exactly why we place the control-volume faces outside it).

The streamwise momentum equation then contains only the two hydrostatic pressure forces
and the two momentum fluxes:

ρq²/y₁ + ρg y₁²/2 = ρq²/y₂ + ρg y₂²/2.

Dividing by ρg defines the **specific force** (momentum function) per unit width:

M = q²/(gy) + y²/2,  and the jump requires M₁ = M₂.

Nothing about the internal structure of the roller enters. That is the whole argument:
we cannot compute the energy loss *a priori*, but we never need to.

### Bélanger's equation

Setting M₁ = M₂ and eliminating q with Fr₁² = q²/(gy₁³) gives a quadratic in y₂/y₁ whose
positive root is the **sequent-depth ratio**:

y₂/y₁ = ½(√(1 + 8Fr₁²) − 1).

It is symmetric: reading it backwards from the downstream side with Fr₂ returns y₁. The
tool checks this both ways. A jump exists only for Fr₁ > 1 — at Fr₁ = 1 the ratio is 1
and the two depths coincide at y꜀.

### Energy loss falls out afterwards

Only *once* the sequent depth is known from momentum can the energy loss be computed, as
the difference of two specific energies. Algebra then collapses it to a remarkably clean
closed form:

h_L = E₁ − E₂ = (y₂ − y₁)³ / (4y₁y₂).

The tool computes h_L both ways — as an energy difference and from this formula — every
frame, and prints both. They agree to machine precision, which is the module's central
self-check: it fails the instant the sequent depth and the specific-force curve come
apart. The cube in the numerator is why dissipation grows so steeply with jump height,
and why strong jumps are such effective energy destroyers.

Two further closed forms are plotted in the second view:

- efficiency E₂/E₁ = [(1 + 8Fr₁²)^{3/2} − 4Fr₁² + 1] / [8Fr₁²(2 + Fr₁²)],
- relative height h_j/E₁ = (√(1 + 8Fr₁²) − 3)/(2 + Fr₁²).

### Sequent versus alternate depths — the pairing that matters

This is the conceptual core, and the reason the E–y and M–y diagrams share a vertical
depth axis:

| | Paired by | Same | Different | Physical device |
|---|---|---|---|---|
| **Alternate** depths | specific energy | E | M | sluice gate (frictionless) |
| **Sequent** depths | specific force | M | E | hydraulic jump |

On screen, y₁ and y₂ sit on **one vertical line of the M–y diagram** (M conserved) but on
**two different E values of the E–y diagram** — and the horizontal gap between them *is*
h_L. Students who have met the sluice gate in the specific-energy module see the mirror
image of the same picture, which is the intended pairing between the two laboratories.

Note also that y꜀ always lies strictly between y₁ and y₂: the jump straddles critical
depth, which is another way of saying it is the flow's only route from supercritical back
to subcritical.

### Classification and length

Jump behaviour changes character with Fr₁, and the tool bands the chart accordingly
(USBR classification, after Bradley & Peterka):

| Fr₁ | Type | Character |
|---|---|---|
| 1.0 – 1.7 | Undular | standing waves, almost no loss |
| 1.7 – 2.5 | Weak | smooth surface rollers |
| 2.5 – 4.5 | Oscillating | unstable jet, surface waves travel downstream — the range stilling-basin designers avoid |
| 4.5 – 9.0 | Steady | well-balanced, stable, the design target |
| > 9.0 | Strong | very rough, effective but erosive |

Jump length has no closed form; the tool uses the standard empirical fit
L/y₁ = 9.75(Fr₁ − 1)^1.01 and labels it as empirical on screen.

### Sliders → classical controls, with verified numbers

| Control | Classical role | Verified value |
|---|---|---|
| Default: y₁ = 20 mm, Fr₁ = 5 | textbook steady jump | q = 0.0443 m²/s, Q = 8.86 L/s, V₁ = 2.215 m/s, y₂ = **131.8 mm**, y꜀ = 58.5 mm, Fr₂ = 0.296 |
| Hand check on E₁ | E₁ = y₁(1 + Fr₁²/2) | 20 × 13.5 = **270.0 mm** exactly, as displayed |
| Momentum self-check | M₁ vs M₂, computed independently | both 102.000×10⁻⁴ m²; \|M₁−M₂\|/M₁ = 1.7×10⁻¹⁴ ✓ |
| Energy loss, two independent routes | E₁ − E₂ vs (y₂−y₁)³/(4y₁y₂) | **132.5 mm = 132.5 mm** (49.1 % of E₁ destroyed) |
| Efficiency vs closed form | E₂/E₁ | 0.509 (theory 0.509) |
| Relative height vs closed form | h_j/E₁ | 0.414 (theory 0.414) |
| Length | L = 9.75·y₁(Fr₁−1)^1.01 | 791 mm, L/y₁ = 39.5 |
| Fr₁ sweep → classification | jump type and dissipation | 1.30 undular (0.6 %), 2.00 weak (9.1 %), 3.50 oscillating (32.9 %), 6.50 steady (59.4 %), 9.50 strong (71.4 %) |

Every figure above is produced by the module at run time and re-checked by the automated
suite on three browser engines; see [`validation/validation-protocol.md`](../validation/validation-protocol.md).

## 3. Description of the tool

- **Left panel** — inflow depth y₁ (8–50 mm) and approach Froude number Fr₁ (1.05–10.9).
  The Fr₁ slider's upper limit is capped dynamically so the sequent depth stays inside the
  300 mm flume, and the cap is stated in a note under the slider — a deep y₁ leaves less
  Froude headroom, which is itself worth pointing out. Display toggles: particles, energy
  grade line with the h_L drop, critical-depth line, roller foam.
- **Flume (top canvas)** — the jump in elevation: supercritical sheet, roller with
  turbulent foam, subcritical tailwater, particle velocities set by continuity u = q/h
  (fast and shallow before, slow and deep after). The energy grade line steps down across
  the roller by exactly h_L, drawn to scale.
- **Chart (bottom canvas), two views:**
  - **E–y & M–y diagrams** (default) — the two curves side by side on a *shared depth
    axis*, with y₁ and y₂ marked on both. The vertical line through the M–y curve and the
    horizontal gap on the E–y curve are the whole lesson in one image.
  - **Curves vs Fr₁** — efficiency, relative height and relative length plotted against
    Fr₁ with the five jump-type bands shaded, and the current state marked.
- **Right panel** — flow quantities, jump geometry, the jump-type banner, the momentum
  table with its self-check, the energy table with h_L computed *both* ways, and the
  governing formulas.
- **Bottom buttons** — the two chart views, sweep Fr₁, pause, reset.

## 4. How to use

Quick start: open the file and press **▶ Sweep Fr₁** with the E–y & M–y view showing.
Watch the vertical line on the M–y diagram stay vertical while the E–y gap opens up.

Suggested ~20-min classroom sequence:

1. (2 min) Default state, flume only. Ask what would happen if you tried to apply
   Bernoulli across the roller. Let someone say "you can't" and ask *why not* — the
   answer is that the streamlines are not parallel and the loss is unknown.
2. (4 min) Derive the control-volume momentum balance on the board while pointing at the
   flume: horizontal bed → no weight component; short jump → no friction; parallel
   streamlines *at the faces* → hydrostatic pressure. Arrive at M = q²/(gy) + y²/2.
3. (3 min) Switch to the **M–y diagram**. Show y₁ and y₂ on one vertical line, and read
   the two M values: 102.000×10⁻⁴ m² and 102.000×10⁻⁴ m². Point at the self-check.
4. (3 min) Now the **E–y diagram** beside it. Same two depths, *different* E. Measure the
   gap: 132.5 mm, and 49 % of E₁ is gone. Ask where it went.
5. (4 min) Sweep Fr₁ slowly. Stop at 1.3 (undular, 0.6 % lost — barely a jump at all),
   3.5 (oscillating), 6.5 (steady), 9.5 (strong, 71 % lost). Ask which band you would
   design a stilling basin for, and why 2.5–4.5 is the one to avoid.
6. (4 min) Switch to **Curves vs Fr₁** and connect the shapes to what was just seen.
   Then return to the specific-energy module's sluice gate and put the two pictures
   side by side: same E different M, versus same M different E.

Assessment-style questions:
(a) For y₁ = 20 mm and Fr₁ = 5, verify y₂ = 131.8 mm by hand from Bélanger, then verify
h_L = 132.5 mm from (y₂−y₁)³/(4y₁y₂). (b) Show that E₁ = y₁(1 + Fr₁²/2) and use it to
get 270 mm in one line. (c) Why must y꜀ lie between y₁ and y₂? (d) A jump forms with
Fr₁ = 2; the designer doubles the approach velocity at the same depth. What happens to
the fraction of energy destroyed, and why is the change so much larger than the change in
Fr₁? (e) Explain why the momentum equation needs the bed to be horizontal, and what you
would have to add on a sloping apron.

## 5. Assumptions and limitations

- **Horizontal, frictionless, rectangular, prismatic** channel. On a sloping apron the
  weight component re-enters the momentum balance and the sequent depths change; the tool
  does not model that case.
- Hydrostatic pressure is assumed **at the control-volume faces only**. Inside the roller
  it is emphatically not hydrostatic, which is why no attempt is made to compute anything
  there — the roller is drawn indicatively.
- Jump **length is empirical** (L/y₁ = 9.75(Fr₁−1)^1.01) and is labelled as such on
  screen. Unlike every other number in the module it is a fit, not a derivation, and
  quoted lengths in the literature vary by ±10 %.
- The classification boundaries are the conventional USBR bands; real jumps transition
  gradually rather than at sharp Froude numbers.
- Air entrainment, scale effects and the surface waves that persist downstream of an
  oscillating jump are visualised qualitatively, not modelled.
- The Fr₁ range is capped so y₂ fits the 300 mm flume; this is a display constraint, not
  a physical one.

## 6. Technical notes

Single self-contained HTML file, no dependencies, fully offline; canvas 2D. All
quantities are computed from the governing equations every frame — Bélanger in closed
form, specific force and specific energy evaluated independently at both depths so their
agreement is a genuine check rather than a restatement. The momentum residual
\|M₁−M₂\|/M₁ and the two independent h_L routes are displayed live and are asserted by
the automated suite at a tolerance of 1×10⁻⁹ across 21 states spanning
y₁ ∈ {10, 20, 40} mm × Fr₁ ∈ {1.5 … 10}. MIT License; cite via the repository
`CITATION.cff`.

## 7. References

- Chow, V.T. (1959). *Open-Channel Hydraulics*. McGraw-Hill, ch. 15 (the hydraulic jump,
  specific force, jump types).
- Henderson, F.M. (1966). *Open Channel Flow*. Macmillan, ch. 3 — the clearest available
  treatment of why momentum rather than energy closes the problem.
- Bélanger, J.B. (1841). *Notes sur l'Hydraulique*. École Royale des Ponts et Chaussées.
- Bradley, J.N. & Peterka, A.J. (1957). The hydraulic design of stilling basins.
  *Journal of the Hydraulics Division, ASCE*, 83(5) — the USBR jump classification.
- Hager, W.H. (1992). *Energy Dissipators and Hydraulic Jump*. Kluwer — jump length and
  roller structure.
