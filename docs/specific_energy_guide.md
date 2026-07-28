# Specific Energy, Critical Depth & Choking — guide

Animation: [`animations/specific_energy.html`](../animations/specific_energy.html) · 2D, fully offline, single file.

## 1. Purpose

Specific energy is the first genuinely non-obvious idea in open-channel flow: a single
quantity that is *not* monotone in depth, so one value of it corresponds to two possible
flows. The animation targets the three places students reliably come unstuck:

1. **Why does one specific energy give two depths?** The E–y curve is drawn live beside
   the flume, and a travelling probe links a station in the water to its point on the
   curve, so "alternate depths" stops being a phrase and becomes two marks on one
   vertical line.
2. **Why does the water surface *drop* over a hump?** Almost every student predicts it
   rises. The module makes the prediction, then shows the operating point sliding
   **left** along a *fixed* E–y curve as the bed lifts, and the subcritical depth falling
   faster than the bed rises.
3. **What is choking, and why does it back water up?** When the hump is too tall for the
   available energy, the crest is forced to critical and the *upstream* level must rise to
   supply the extra head. The tool marks the original level with a ghost line so the rise
   is visible rather than asserted.

## 2. Theory

### The specific-energy curve

Specific energy is the head measured from the channel bed:

E = y + V²/2g = y + q²/(2gy²)  (rectangular channel, q = Q/b).

Two limits shape the curve. As y grows, the velocity head vanishes and E → y (the
45° asymptote). As y → 0, the velocity head blows up and E → ∞. Something in between must
be a minimum, and differentiating gives it:

dE/dy = 1 − q²/(gy³) = 0  ⟹  y꜀ = (q²/g)^⅓,  and then E_min = 1.5·y꜀.

The condition q²/(gy³) = 1 is precisely Fr = 1, so **the minimum of the specific-energy
curve is critical flow** — the two definitions of "critical" are the same statement. Above
y꜀ the flow is subcritical (depth-dominated, on the upper branch); below it,
supercritical (velocity-dominated, lower branch). For any E > E_min the two branch
depths are the **alternate depths**: same discharge, same specific energy, different
distribution between depth and velocity head.

### The sluice gate: alternate depths made physical

A frictionless gate does no work on the flow and adds no bed elevation, so specific energy
is conserved across it: E₁ = E₂. The upstream depth is subcritical, the depth under the
gate supercritical — the two are alternate depths, the same vertical line on the E–y
diagram. Setting E₁ = E₂ with y₂ ≈ a and solving for the discharge gives the rating used
in the lab:

q = a·√( 2gy₁ / (1 + a/y₁) ),  so  C_d = Q/Q_ideal = 1/√(1 + a/y₁), with Q_ideal = b·a·√(2gy₁).

The discharge coefficient is therefore not an empirical fudge here but a direct
consequence of retaining the approach velocity head — it tends to 1 as the gate opening
becomes small relative to the upstream depth. Substituting the rating back into either
side yields a pleasant hand-checkable identity:

E₁ = E₂ = (y₁² + a·y₁ + a²)/(y₁ + a).

### Flow over a hump: the operating point slides, the curve does not

This is the module's central move. Over a hump of height z(x) with no energy loss, the
*total* head is constant, so the **local** specific energy is

E(x) = E₁ − z(x),

while q is unchanged — so the E–y curve itself never moves. Raising the bed slides the
operating point **leftward** along a fixed curve. On the subcritical branch, moving left
means the depth *falls*, and it falls faster than the bed rises, so the water surface
elevation z + y goes **down**. That is why a smooth hump produces a dip, and it is
entirely counter-intuitive until the diagram is in front of you.

The margin available is E₁ − E_min. Once the bed lift consumes it, the crest reaches the
nose of the curve and can go no further left:

Δz_crit = E₁ − E_min.

For Δz > Δz_crit the flow **chokes**. The crest is pinned at critical, and since it now
requires E_min plus the bed lift, the upstream energy is forced up to E_up = E_min + Δz —
which raises the upstream depth. The hump has become the control: it now dictates the
upstream level rather than responding to it. Past the crest the flow continues on the
supercritical branch (in a real channel a hydraulic jump follows — the pairing to the
[hydraulic jump module](hydraulic_jump_guide.md)).

### Sliders → classical controls, with verified numbers

| Control | Classical role | Verified value |
|---|---|---|
| Gate default: y₁ = 170 mm, a = 12 mm | lab sluice-gate setup | q = 0.0212 m²/s, Q = 4.24 L/s, V₁ = 0.125 m/s (Fr₁ = 0.096), V₂ = 1.765 m/s (Fr₂ = 5.144) |
| Energy conservation across the gate | E₁ = E₂ | **170.8 mm = 170.8 mm**, residual 0.000 mm ✓ |
| Hand check on that number | E = (y₁² + ay₁ + a²)/(y₁ + a) | (28900 + 2040 + 144)/182 = **170.8 mm** |
| Critical depth and its minimum | y꜀ = (q²/g)^⅓, E_min = 1.5y꜀ | 35.8 mm and 53.6 mm |
| Gate rating | C_d = 1/√(1 + a/y₁) | Q_ideal = 4.38 L/s, C_d = **0.966** (hand: 1/√1.0706 = 0.9665) |
| Hump default: Q = 4.2 L/s, y₁ = 170 mm, Δz = 40 mm | subcritical dip | crest depth 129.4 mm, surface **drops 0.6 mm**, not choked |
| Choking limit | Δz_crit = E₁ − E_min | **117.4 mm** (= 170.8 − 53.3) |
| Just below the limit, Δz = 117 mm | approaching critical | crest depth 39.0 mm, surface drop 14.0 mm, still not choked |
| Just above it, Δz = 125 mm | choked | crest depth **35.6 mm = y꜀** exactly, upstream **raised 7.6 mm** |
| Energy budget along the reach | max\|E + z − E₁\| over 121 stations | 0.0000 mm ✓ in every configuration |

Every figure above is produced by the module at run time and re-checked by the automated
suite on three browser engines; see [`validation/validation-protocol.md`](../validation/validation-protocol.md).

## 3. Description of the tool

- **Left panel — three experiments** selected by radio button:
  - *Sluice gate — set y₁ & a* (the lab setup): the discharge follows from E₁ = E₂.
  - *Sluice gate — hold Q, vary a*: q is fixed, so the E–y curve is frozen while both
    depths slide along it and converge on the critical point as a → y꜀.
  - *Flow over a hump — choking*: approach depth and hump height, with Δz sweeping
    through Δz_crit.

  Sliders adapt to the mode (y₁ 100–250 mm, Q 1–12 L/s, gate opening a 5–40 mm, hump
  height Δz 0–140 mm). Display toggles: particles at u = q/h, energy grade line,
  critical-depth line, a second discharge curve for comparison, and the travelling probe.
- **Flume (top canvas)** — elevation view with the gate or hump in place, the water
  surface drawn from the exact branch solution at every station, particle speeds set by
  continuity, the energy grade line, and — when choked — a dashed ghost line at the
  original upstream level so the backwater rise is measurable on screen.
- **E–y diagram (bottom canvas)** — the specific-energy curve for the current q with the
  45° asymptote, y꜀ and E_min marked, and the operating points for both depths. In hump
  mode a **travelling probe** sweeps the flume and its mirror point rides the curve, so
  the leftward slide is seen as it happens rather than inferred.
- **Right panel** — flow quantities with sub/supercritical chips, the energy and
  critical-depth table, the governing formulas, and then a mode-dependent section: the
  gate rating (Q_ideal, C_d, energy check) or the hump table (Δz, Δz_crit, crest depth,
  surface drop, upstream rise, energy-budget residual) with a status banner reading
  either "SUBCRITICAL DIP" or "CHOKED — crest critical (Fr = 1)".
- **Bottom buttons** — sweep, pause, reset to lab defaults.

## 4. How to use

Quick start: open the file, switch to **Flow over a hump**, and press **▶ Sweep**. Watch
the crest point ride down the E–y curve and the status banner flip to CHOKED.

Suggested ~20-min classroom sequence:

1. (3 min) Gate mode, default. Point at the two chips: y₁ subcritical, y₂ supercritical.
   Read E₁ and E₂ — identical. Establish that a frictionless gate conserves specific
   energy, so these are alternate depths.
2. (3 min) On the diagram, show the single vertical line through both points. Then read
   C_d = 0.966 and derive 1/√(1 + a/y₁) on the board. Ask why C_d → 1 for a small gate.
3. (3 min) Switch to **Hold Q** and sweep the gate opening. The curve does not move — only
   the points do — and the two depths converge on the nose. Ask what happens physically
   when they meet.
4. (2 min) **Before switching to hump mode, take a vote:** does the water surface rise or
   fall over a smooth bump? Most of the room will say rise. Record the vote.
5. (5 min) Switch to hump mode, Δz = 40 mm. The surface drops 0.6 mm. Resolve the vote
   with the diagram: E(x) = E₁ − z(x) slides the point left along a fixed curve, and on
   the subcritical branch leftward means shallower — faster than the bed rises. Turn on
   the travelling probe and sweep it through the hump.
6. (4 min) Raise Δz towards Δz_crit = 117.4 mm. At 117 mm the crest is nearly critical and
   the dip is 14 mm. Cross to 125 mm: the banner flips to CHOKED, the crest sits exactly
   at y꜀ = 35.6 mm, and the upstream level rises 7.6 mm above the ghost line. State the
   conclusion plainly — the hump is now the control.

Assessment-style questions:
(a) Verify E₁ = 170.8 mm for the default gate setting by hand from
(y₁² + ay₁ + a²)/(y₁ + a). (b) Show that E_min = 1.5y꜀ follows from dE/dy = 0, and hence
that the nose of the curve is Fr = 1. (c) For the default hump case compute Δz_crit
yourself and confirm 117.4 mm. (d) A weir is to be built in a canal without raising the
upstream water level. What is the design constraint, in one inequality? (e) Explain why
the E–y curve does not move when the hump height changes, but does move when Q changes.
(f) After the flow chokes, what has happened to the discharge — and what would have to
change for it to stay constant?

## 5. Assumptions and limitations

- **Frictionless and rectangular.** No energy loss along the flume, across the gate, or
  over the hump; b = 0.20 m throughout. Real gates and humps lose a little head, so
  measured C_d values sit slightly below the ideal curve.
- **Hydrostatic pressure and parallel streamlines.** Over a sharply curved crest the
  streamlines are not parallel and the hydrostatic assumption weakens; the cosine-squared
  hump used here is deliberately gentle.
- y₂ ≈ a at the gate: the vena contracta is not modelled separately, following the lab
  manual convention. A contraction coefficient would multiply the opening in practice.
- **The downstream state is not resolved.** Past a choked crest the module shows the flow
  continuing supercritical; in a real channel the tailwater would force a hydraulic jump,
  which is the subject of a separate laboratory.
- The approach flow in hump mode is held subcritical (y₁ is floored at 1.05y꜀); a
  supercritical approach over a hump behaves differently and is out of scope.
- Choking is detected at Δz_crit within a 10⁻⁹ m tolerance; exactly *at* the threshold the
  crest is critical and the distinction between the two regimes is formal rather than
  physical.

## 6. Technical notes

Single self-contained HTML file, no dependencies, fully offline; canvas 2D. Both branch
depths are found by 60-step bisection on y + q²/(2gy²) = E, bracketed by y꜀ so the
correct root is guaranteed on each branch — a fixed-point iteration is retained only for
the legacy gate modes. The water surface in hump mode is the exact branch solution
evaluated at every drawn station, subcritical before the crest and supercritical after.
The energy budget max\|y + q²/2gy² + z − E₁\| is recomputed over 121 stations every frame
and displayed; the automated suite asserts it below 10⁻⁶ m for unchoked, near-critical and
choked configurations alike, and separately verifies that both roots reproduce E to
machine precision. MIT License; cite via the repository `CITATION.cff`.

## 7. References

- Chow, V.T. (1959). *Open-Channel Hydraulics*. McGraw-Hill, ch. 3 (specific energy,
  critical flow, channel transitions).
- Henderson, F.M. (1966). *Open Channel Flow*. Macmillan, ch. 2 — specific energy, humps
  and the choking condition.
- Massey, B.S. & Ward-Smith, J. (2012). *Mechanics of Fluids*, 9th ed., ch. 10 — sluice
  gate rating and the discharge coefficient.
- White, F.M. (2016). *Fluid Mechanics*, 8th ed., ch. 10 — critical depth, the E–y
  diagram and flow over a bump.
- Rajaratnam, N. & Subramanya, K. (1967). Flow equation for the sluice gate.
  *Journal of the Irrigation and Drainage Division, ASCE*, 93(3).
