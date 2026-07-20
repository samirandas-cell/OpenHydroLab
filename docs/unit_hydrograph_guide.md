# The Unit Hydrograph Workbench — Theory, Description, and User Guide

**Tool:** `animations/unit_hydrograph.html` (OpenHydroLab)
**Course context:** undergraduate hydraulics & hydrology (unit hydrograph and flood estimation)
**Author:** Samiran Das, University of Glasgow (Singapore)
**Requirements:** any modern browser; fully offline; no installation.

---

## 1. Purpose

Unit-hydrograph theory is usually taught as three separate recipes: derive a UH from an
observed storm, apply a UH to predict a flood, and change a UH's duration with the
S-curve. Students execute the arithmetic without seeing that the recipes are one idea.

The Workbench teaches that idea explicitly: **the catchment is a linear time-invariant
system**. Deriving a UH is *system identification* (measure the output, recover the
response function). Applying it is *convolution* (push any input through the response).
The S-curve is the *step response*, from which the response at any duration follows by
lag-and-subtract. A pipeline graphic — *effective rainfall → catchment u(t) → streamflow*
— sits above the chart and highlights which link each mode exercises.

All three modes are computed from one underlying response function, so they are exactly
consistent: the UH you derive in mode 1 is the function mode 2 convolves with and mode 3
re-expresses. Every conservation law the theory imposes is checked numerically on screen.

---

## 2. Theory

### 2.1 The unit hydrograph and its assumptions

The D-hour unit hydrograph u(t) is the direct-runoff hydrograph (DRH) produced by
**1 unit (1 cm) of effective rainfall** falling uniformly over the catchment at a uniform
rate for D hours. Its use rests on three assumptions (all exercised by the tool):

1. **Linearity (proportionality):** DRH ordinates scale with the effective-rain depth —
   if 1 cm gives u(t), then R cm gives R·u(t).
2. **Time invariance:** the catchment's response does not change from storm to storm.
3. **Superposition:** the response to a sequence of rain pulses is the sum of the lagged,
   scaled responses to each pulse.

The defining constraint is volumetric: the area under u(t) must equal exactly 1 cm over
the catchment area, $\int_0^\infty u\,dt = A \times 0.01\ \text{m}$.

### 2.2 Mode 1 — deriving a UH from an observed storm (identification)

Given an observed storm hydrograph and the effective-rain depth from the rain gauges,
the textbook procedure is:

1. **Separate baseflow** (here: the straight-line method) → DRH = observed − baseflow;
2. **Integrate** the DRH to the direct-runoff volume V;
3. **Convert** to a runoff depth d = V/A;
4. **Divide** every DRH ordinate by d → the D-hour UH.

Step 1 is a judgment call — the literature is explicit that different separation methods
give different answers and the constant-discharge line tends to misallocate flow. The
Workbench therefore makes the baseflow line a **student-controlled slider** and adds the
professional's sanity check: the runoff depth d must **reconcile with the independently
measured effective rainfall** (3.0 cm for the built-in storm). Choose the correct line
(10 m³/s) and d = 3.00 cm ✓; choose 5 m³/s and d = 3.60 cm with a red ✗ — the data are
telling you your separation, not the rain, is wrong. (Note that the *derived UH's* volume
is 1 cm by construction whatever you choose — dividing by your own d guarantees it — so
the reconciliation with measured rainfall is the only real check. The tool is honest
about this.)

### 2.3 Mode 2 — applying a UH (convolution / superposition)

For M sequential D-hour pulses of effective rain R₁, R₂, …:

$$Q_d(t) = \sum_{i=1}^{M} R_i\, u\big(t-(i-1)D\big), \qquad Q(t)=Q_d(t)+\text{baseflow}.$$

The Workbench draws each term as a **stacked colored band** rather than an overlapping
line, so superposition is visible as geometry: the flood is literally the bands piled up.
The self-check is volumetric: ∫Q_d dt must equal ΣRᵢ × A (e.g. 5 cm × 423 km² =
21.15×10⁶ m³), which the readout verifies at any setting.

**Variable rainfall duration.** A pulse-duration slider Dᵣ (1–12 h) changes how fast the
same rain depths arrive. Because a UH may only be applied to pulses of *its own*
duration, the tool automatically switches to the Dᵣ-hour UH — generated internally by
the S-curve method of mode 3 (the modes genuinely share machinery). The same 5 cm of
rain gives a flood peak of 425.6 m³/s at 12.0 h when Dᵣ = 3 h, 366.6 at 15.6 h when
Dᵣ = 6 h, and 247.2 at 19.4 h when Dᵣ = 12 h — while the volume check stays pinned at
21.15×10⁶ m³. Same water, different clock.

### 2.4 Mode 3 — changing duration: superposition and the S-curve

**Superposition method (integer multiples only).** To get the nD-hour UH: sum n copies of
the D-hour UH, each lagged by D, and divide by n.

**S-curve method (any duration).** The S-curve is the response to *continuous* effective
rain at 1 cm per D hours — an endless train of lagged D-hour UHs:

$$S(t) = \sum_{k\ge 0} u(t-kD) \;\longrightarrow\; Q_{eq} = \frac{A \times 0.01}{D\cdot 3600}
\;(= 195.8\ \text{m}^3/\text{s here}).$$

In systems language, S(t) is the **step response**. Any-duration UH follows by
lag-and-subtract:

$$u_{D'}(t) = \big[S(t) - S(t-D')\big]\cdot \frac{D}{D'}.$$

The two methods are not merely similar — at integer multiples they are **algebraically
identical**, because the superposition sum telescopes:
$\sum_{k=0}^{n-1}\big[S(t-kD)-S(t-kD-D)\big] = S(t)-S(t-nD)$. The Workbench demonstrates
this: at D′ = 12, 18 or 24 h it draws both constructions and reports the maximum
difference — 0.00 m³/s. At D′ = 9 h it reports the superposition method *unavailable*,
which is precisely the argument for the S-curve's existence.

The duration effect itself is the teaching payoff: the same 1 cm delivered faster gives
a taller, peakier UH. The built-in catchment gives peaks of **86.5 / 83.1 / 71.8 / 47.4
m³/s for D′ = 3 / 6 / 12 / 24 h**, every one conserving exactly 1.00 cm (checked
numerically and displayed).

### 2.5 The underlying response function — and a modelling trap worth teaching

All three modes are computed from one smooth **gamma IUH** (a Nash cascade with n = 4
reservoirs, k = 3 h), whose cumulative form has the closed expression

$$P(t) = 1 - e^{-x}\Big(1 + x + \tfrac{x^2}{2} + \tfrac{x^3}{6}\Big),\quad x = t/k,
\qquad S(t) = Q_{eq}\,P(t).$$

The 6-h UH, the observed storm of mode 1 (3 cm × UH₆ + 10 m³/s baseflow), and every
D′-hour UH are all derived from this single S(t) — which is why the modes agree exactly.

The smooth foundation is not a cosmetic choice. An earlier version of this tool used a
piecewise-**linear** UH table, and the S-curve method then returned a 3-h UH with the
*same peak* as the 6-h UH — mathematically inevitable (a piecewise-linear S-curve has
constant slope between knots, so short-window differences saturate), but pedagogically
poisonous: it would teach students that duration doesn't matter. With the gamma
foundation the duration effect emerges correctly. This is a nice example, worth a
minute in class, of how a discretization choice can silently break the physics a tool
is supposed to demonstrate.

### 2.6 Verified numbers (reproduced by the tool at its defaults)

| Quantity | Value | Check |
|---|---|---|
| Runoff depth, correct separation (10 m³/s) | d = 3.00 cm | reconciles with rain gauges ✓ |
| Runoff depth, wrong separation (5 m³/s) | d = 3.60 cm | flagged ✗ |
| Derived 6-h UH peak | 83.1 m³/s at 12.4 h | UH₆(12 h) = 82.97 vs hand calc 82.96 ✓ |
| Derived UH volume | 1.00 cm | ✓ |
| Q_eq | 195.8 m³/s | = A·(1 cm)/6 h ✓ |
| UH peaks at D′ = 3/6/12/24 h | 86.5 / 83.1 / 71.8 / 47.4 m³/s | volume = 1.00 cm at every D′ ✓ |
| Superposition vs S-curve at n = 2, 3 | Δmax = 0.00 m³/s | identical ✓ |
| Flood (3+2 cm, 6-h pulses, BF 10) | 366.6 m³/s at 15.6 h | ∫Q_d dt = 5 cm × A = 21.15×10⁶ m³ ✓ |

---

## 3. Description of the tool

**Pipeline strip (top of canvas).** Three linked nodes — *effective rainfall ER(t)* →
*CATCHMENT u(t)* → *streamflow Q(t)* — with the active link highlighted and a one-line
caption: mode 1 "system identification (deconvolution)", mode 2 "prediction
(convolution)", mode 3 "change of basis: S-curve = step response".

**Left panel (controls, changes with mode).**
- *Mode 1:* the givens (observed hydrograph, A = 423 km², rain-gauge ER = 3.0 cm); four
  step buttons (Separate baseflow → DRH → Volume → ÷ d); the baseflow slider.
- *Mode 2:* pulse-duration slider Dᵣ; three pulse-depth sliders (labels re-range with
  Dᵣ); baseflow slider; toggle for the UH-in-use overlay.
- *Mode 3:* target-duration slider D′ (1–24 h, continuous); toggles for the construction
  train, the 6-h comparison UH, and the superposition-method overlay; a replay button for
  the S-curve summation animation.

**Chart (centre).** One time–discharge chart serves all modes: mode 1 shows the observed
hydrograph, baseflow shading, DRH, and the UH morphing out of the DRH as it is divided by
d; mode 2 shows ER bars, stacked component bands over the baseflow band, the white total
curve and the dashed UH in use; mode 3 shows the lagged-UH train summing into the
S-curve, the equilibrium line, the lagged copy S(t−D′), the shaded difference, the
resulting D′-hour UH (amber), and — at integer multiples — the superposition method's
white dashed curve landing on top of it.

**Right panel (readout).** Catchment constants; the governing formula for the active
mode; a mode-specific ledger (derivation ledger / predicted-flood table / S-curve &
new-UH table) in which every conservation check is displayed with ✓/✗; and the honesty
note stating the gamma-IUH foundation.

---

## 4. How to use

### Quick start
Open the file, and you are in mode 1 with an observed storm on screen. Click the four
step buttons in order — you have derived a unit hydrograph. Switch to *2 · Apply UH* and
drag the pulse sliders; switch to *3 · Change duration* and drag D′.

### Suggested classroom sequence (≈ 25 min)

1. **Derive (7 min).** Walk the four steps at the default baseflow. Then hand a student
   the baseflow slider: set it to 5 m³/s. The ledger's d jumps to 3.60 cm ✗. Ask: *the
   rain gauges say 3.0 cm — what did we do wrong?* This lands the point that separation
   is a judgment call with a professional sanity check, not a ritual.
2. **Apply (6 min).** Reproduce the lecture's two-storm example (3 cm + 2 cm). Toggle R₂
   to zero and back — its whole band vanishes and reappears while nothing else moves:
   linearity and superposition in one gesture. Check the volume ledger: ∫Q dt = ΣR·A.
3. **Duration matters (5 min).** Still in mode 2, shorten Dᵣ from 6 h to 3 h. Same rain
   depths, peak up 16 % and 3.6 h earlier. Ask *why the tool refused to keep using the
   6-h UH* — the answer is the definition of the UH.
4. **S-curve (7 min).** Mode 3. Replay the summation and watch lagged UHs pile up into
   S(t) → Q_eq. Set D′ = 12 h: two constructions, one curve, Δmax = 0.00 — superposition
   *is* the S-curve at integer multiples. Set D′ = 9 h: superposition unavailable — the
   S-curve is the general tool. Finish by sweeping D′ from 1 to 24 h and watching the UH
   flatten while its volume readout never leaves 1.00 cm.

### Questions to set students

- In mode 1, the derived UH's volume reads 1.00 cm even when the baseflow separation is
  clearly wrong. Why is that check *guaranteed* to pass, and what is the real check?
- Prove (two lines) that summing n lagged D-hour UHs and dividing by n is identical to
  the S-curve lag-and-subtract formula with D′ = nD.
- Why can the superposition method not produce a 9-h UH from a 6-h UH? Why can it not
  produce a 3-h UH?
- In mode 2 the flood volume is the same for Dᵣ = 3, 6, 12 h but the peaks differ by
  almost a factor of two. Which hydraulic structures care about volume, and which about
  peak?

---

## 5. Assumptions and limitations

- **Linearity and time invariance** — the assumptions of UH theory itself; real
  catchments are only approximately linear (peaks ±10 %, base time ±20 % per the
  lecture's accuracy note).
- **Straight-line baseflow separation** — deliberately the simplest method, because the
  point of mode 1 is the judgment call; concave and recession-based methods exist.
- **Synthetic catchment** — the built-in storm is generated from the gamma IUH
  (423 km², chosen to echo the lecture's Example 1 area), not from the lecture's data
  table. This is what makes all three modes exactly consistent; to work the lecture's
  numerical examples, use the lecture tables by hand as before.
- **Uniform ER in space and time within each pulse** — as UH theory assumes.

---

## 6. Technical notes

- Single self-contained HTML file, 2D canvas, no libraries, fully offline.
- The gamma CDF is closed-form (integer Nash n), so there is no numerical integration in
  the definition of S(t); volumes and peaks are computed by direct quadrature
  (Δt = 0.05 h over 140 h) and displayed as self-checks.
- Stable element ids (`o-*`, `v-*`, `chip`) make the readouts scriptable for automated
  verification and future classroom telemetry.
- Part of **OpenHydroLab** (MIT License). Please cite the library (see `CITATION.cff`)
  if used in teaching or publications.

## 7. References

- Sherman, L.K. (1932). *Streamflow from rainfall by the unit-graph method.* Engineering
  News-Record 108, 501–505. (The original UH proposal.)
- Nash, J.E. (1957). *The form of the instantaneous unit hydrograph.* IAHS Publ. 45,
  114–121. (The gamma-cascade IUH used as this tool's foundation.)
- Chow, V.T., Maidment, D.R. & Mays, L.W. (1988). *Applied Hydrology.* McGraw-Hill.
  (Ch. 7: UH derivation, S-curve, superposition.)
- Das, S. *Hydraulics and Hydrology* lecture notes, University of Glasgow
  (Singapore).
