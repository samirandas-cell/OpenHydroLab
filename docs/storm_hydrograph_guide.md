# The Storm Hydrograph Animation — Theory, Description, and User Guide

**Tool:** `animations/Lec10_storm_hydrograph.html` (OpenChannelLab)
**Course context:** CVE2142 Hydraulics & Hydrology, Lecture 10 (Rainfall–Runoff Methods and Hydrograph)
**Author:** Samiran Das, University of Glasgow (Singapore)
**Requirements:** any modern browser; fully offline; no installation.

---

## 1. Purpose

This animation answers the question every hydrology student asks when first shown a storm
hydrograph: *why does the river keep rising after the rain has stopped, and why does the
curve have that particular shape?*

It does so by making the deepest interpretation of the hydrograph visible: **a hydrograph
is the arrival-time distribution of the rain**. Every drop that becomes runoff takes a
journey — hillslope, tributary, main channel, gauge — and the discharge curve at the
outlet is nothing more than the histogram of when those journeys end. In the animation,
runoff drops literally make this journey across a plan-view catchment while the hydrograph
traces itself at the gauge, so the shape of the curve is *seen to be caused* rather than
merely asserted.

Every number on screen is computed from the governing equations described below. Nothing
is drawn by hand; the model proves its own mass balance in the readout panel at any
parameter setting.

---

## 2. Theory

### 2.1 Anatomy of a storm hydrograph

A storm (flood) hydrograph is a chronological plot of stream discharge *Q* versus time in
response to a rainfall event. Its standard components, all labelled live in the
animation:

| Feature | Meaning |
|---|---|
| **Rising limb** | Discharge climbs as runoff from progressively larger parts of the catchment reaches the outlet. |
| **Peak (crest)** | Maximum discharge *Q_p* — the critical design quantity. |
| **Recession limb** | Water drains from catchment storage; its shape reflects basin characteristics, not the storm. |
| **Baseflow** | The slow groundwater contribution that sustains the stream between storms. |
| **Lag time** | Interval from the centroid of effective rainfall to the peak discharge. |

### 2.2 Separating rainfall: the φ-index

Not all rain becomes streamflow quickly. The animation uses the **φ-index** abstraction:
a constant infiltration capacity φ (mm/h) such that

- rain falling at intensity *i* ≤ φ **infiltrates** (a loss to the direct-runoff budget;
  it recharges groundwater),
- the excess, **effective rainfall** ER = max(*i* − φ, 0), becomes **direct runoff**.

The hyetograph in the tool is split visually at the φ line: the lower (brown) part is
losses, the upper (blue) part is effective rainfall. Total rainfall depth = losses +
effective rainfall, which the mass-balance panel confirms numerically.

### 2.3 Routing: linear reservoirs and the Nash cascade

Effective rainfall does not appear at the gauge instantly; the catchment stores and
releases it. The simplest storage element is the **linear reservoir**, whose storage is
proportional to outflow:

$$S = kQ,\qquad \frac{dS}{dt} = I(t) - Q(t)\;\;\Rightarrow\;\; \frac{dQ}{dt} = \frac{I-Q}{k}$$

where *k* (hours) is the storage (response-time) constant. Nash (1957) showed that a
**cascade of n identical linear reservoirs** — the outflow of one feeding the next —
produces a realistic catchment response. Its **instantaneous unit hydrograph** (IUH,
the response to a unit impulse of effective rainfall) is the gamma distribution

$$u(t) = \frac{1}{k\,\Gamma(n)}\left(\frac{t}{k}\right)^{n-1} e^{-t/k},$$

which for the *n* = 2 used here reduces to $u(t) = (t/k^2)\,e^{-t/k}$ with mean travel
time **2k**. The animation integrates the cascade with the exact exponential update
(unconditionally stable and mass-conserving for piecewise-constant inflow):

$$Q^{+} = I + (Q - I)\,e^{-\Delta t/k}.$$

### 2.4 The hydrograph as a travel-time distribution

The IUH has a profound physical reading, formalised in the geomorphological IUH
literature (Rodríguez-Iturbe & Valdés, 1979): *u(t) is the probability density of the
travel time of a randomly chosen effective-rain drop to the outlet*. The convolution
that produces the direct-runoff hydrograph,

$$Q_d(t) = \int_0^t \mathrm{ER}(\tau)\, u(t-\tau)\, d\tau,$$

is therefore just bookkeeping of drop arrivals.

The animation renders this literally. Each visual runoff drop is assigned a total travel
time **sampled from the same gamma IUH the curve is computed from** (two independent
exponential draws of mean *k*), then animated along a geometric path — overland to the
nearest channel, then down the dendritic network to the gauge. The swarm converging on
the gauge is a **Monte-Carlo rendering of the convolution**: drops arrive densely as the
curve rises, sparsely on the recession. This is why the river keeps rising after the rain
stops — distant drops are still travelling.

*(Honest caveat: the drops' geometric paths are for visualization; their timing — the
physics — comes from the IUH. A full GIUH would derive timing from network geometry
itself; that is a natural extension.)*

### 2.5 Baseflow: two selectable models

1. **Groundwater reservoir (default).** Infiltrated water (the sub-φ rain) feeds a slow
   linear reservoir with $k_{gw} = 40$ h, whose outflow is baseflow. It starts from a
   pre-storm value of 0.05 m³/s per km² and rises gently after the storm — the realistic
   delayed groundwater response.
2. **Uniform (constant).** Baseflow is held at its pre-storm value throughout. This is
   exactly the **straight-line baseflow-separation assumption** used in Lecture 11 when
   deriving unit hydrographs from observed storm hydrographs. Toggling between the two
   modes shows students precisely what the straight-line simplification ignores.

### 2.6 Continuity (the self-check)

Whatever the parameters, conservation of mass requires the area under the direct-runoff
hydrograph, expressed as a depth over the catchment, to equal the effective-rainfall
depth:

$$\frac{1}{A}\int_0^\infty Q_d\,dt \;=\; \text{ER depth}.$$

The readout panel integrates the computed curve numerically and displays this check with
a ✓. At the default storm: ER = 60.0 mm and ∫Q dt ÷ A = 60.0 mm.

### 2.7 Factors that shape the hydrograph

The controls map onto the classical list of hydrograph-shape controls:

| Factor | Control in the tool | Effect |
|---|---|---|
| Storm intensity & duration | *i*, duration sliders | More/longer ER → higher peak, larger volume |
| Infiltration / soils / land cover | φ-index slider | High φ → small runoff ratio, subdued peak |
| Basin size | Area *A* | Scales discharge magnitudes |
| Basin response speed (size, slope, shape, cover) | Response time *k* | Small *k* → flashy (high, early, narrow); large *k* → damped |
| **Urbanization** | Urbanization slider | Paving cuts φ (−80 % at full) and cuts *k* (−60 % at full): peak higher and earlier, lag shorter, baseflow starved |

At the defaults (30 mm/h × 3 h storm, φ = 10 mm/h, A = 20 km², k = 4 h) the model gives
*Q_p* = 34.6 m³/s at 6.6 h with a 4.1 h lag; at 80 % urbanization the same storm gives
*Q_p* = 74.0 m³/s at 4.9 h with a 2.4 h lag — peak roughly doubled, lag roughly halved.

---

## 3. Description of the tool

The screen has four regions.

**Left panel — controls.** Storm sliders (intensity, duration, φ-index), catchment
sliders (area, response time *k*, urbanization), the baseflow-model toggle
(GW reservoir / Uniform), and display toggles (baseflow separation shading, limb labels
and lag bracket, rural-baseline overlay).

**Centre-left — the catchment (plan view).** A watershed bounded by its dashed divide,
with hypsometric terrain shading, contour hints, and a dendritic Horton–Strahler stream
network whose main stem widens downstream and swells with discharge. During the storm,
rain streaks fall inside the divide; drops that beat the φ-index become bright runoff
particles that gather into the network and stream to the **gauge** at the outlet (each
arrival pulses a ring); sub-φ drops soak in with a fading brown ring and fill the
**groundwater-store inset** (bottom-left), which drains to the stream as baseflow. Urban
patches appear across the basin as the urbanization slider rises. A 1-km scale bar
(tied to the area slider) and a simulation clock complete the scene.

**Centre-right — the charts.** Top: the **hyetograph** (intensity plotted downward, split
at the φ line into losses and effective rainfall). Below: the **hydrograph**, traced live
with a glowing head as simulation time advances — baseflow (dashed green) and total flow
(white) with gradient fill between them when separation shading is on. After the peak
passes, annotations appear: *rising limb*, *peak (crest)*, *recession limb*, *baseflow*,
and the red **lag-time bracket** from ER centroid to peak. The rural baseline (u = 0)
overlays as a dashed green curve when comparison is on.

**Right panel — readout.** The model summary; live hydrograph features (peak, time of
peak, lag, baseflow at peak, runoff ratio); and the **mass-balance table** that proves
continuity at the current settings.

**Bottom buttons:** ▶ Play storm · Reset · Default storm.

---

## 4. How to use

### Quick start
Open the file in any browser, press **▶ Play storm**, and watch: rain falls for three
hours, drops race to the gauge, the river rises — and keeps rising after the rain stops —
peaks, and recedes over nearly two days. The full 48-hour event plays in about 40 seconds.

### Suggested classroom sequence (≈ 20 min)

1. **The anatomy (5 min).** Play the default storm. Pause during the rain (press Play
   again) and ask: *the rain is at full intensity — why is the river barely responding?*
   Resume; pause just after the rain ends: *the storm is over — why is the river still
   rising?* The travelling drops on the map are the answer. Let it finish and walk through
   the labelled limbs and the lag bracket.
2. **Where did the water go? (3 min).** Open the mass-balance panel: 90 mm fell, 30 mm
   infiltrated, 60 mm ran off, and the integrated hydrograph returns exactly 60 mm.
   Continuity, demonstrated.
3. **The φ-index (3 min).** Slide φ from 0 to 30 mm/h. Watch the hyetograph split, the
   runoff ratio, and the peak respond. With φ ≥ i there is no direct runoff at all — only
   the groundwater store fills.
4. **Flashy vs damped (3 min).** Halve and double the response time *k*. Same rain, same
   volume — radically different peaks. Connect to basin size, slope, shape and cover.
5. **Urbanization (4 min).** Tick *Overlay rural baseline*, set urbanization to 80 %, and
   replay. Same storm: peak ×2, lag ÷2, and the mean drop travel time drops from 8 h
   to about 4 h. Discuss drainage design consequences (and connect to the rational
   method's C coefficient).
6. **Baseflow assumptions (2 min).** Switch the baseflow model to *Uniform* and back.
   Point out that Lecture 11's unit-hydrograph derivation assumes exactly the flat line —
   and show what that assumption hides.

### Questions to set students

- The rain stops at t = 4 h but the peak arrives at 6.6 h. Where is the water in between?
- Double the storm *duration* vs double the storm *intensity*: which raises the peak
  more, and why are the answers different? (Try it.)
- Why does urbanization *lower* the baseflow while *raising* the flood peak?
- The mass-balance check reads 60.0 mm whatever you do to *k*. Why must that be so?

---

## 5. Assumptions and limitations

- **Lumped model:** one φ, one *k* for the whole basin; no spatial rainfall variability.
- **φ-index:** constant infiltration capacity — no Horton decay, no antecedent-moisture
  effect.
- **Linearity:** the Nash cascade assumes response scales linearly with ER (the same
  assumption as unit-hydrograph theory).
- **Drop paths:** visual geometry only; drop *timing* is IUH-exact (§2.4). A
  geometry-derived (GIUH) timing model is a planned extension.
- **Numbers vary between runs** only in the visual particle swarm (it is a random sample);
  the curves and readouts are deterministic.

---

## 6. Technical notes

- Single self-contained HTML file, 2D canvas, no libraries, fully offline.
- Time step Δt = 0.02 h with exact exponential stepping — mass-conserving at any setting
  (verified by the built-in continuity check).
- Part of **OpenChannelLab** (MIT License). Please cite the library (see `CITATION.cff`)
  if used in teaching or publications.

## 7. References

- Nash, J.E. (1957). *The form of the instantaneous unit hydrograph.* IAHS Publ. 45,
  114–121.
- Rodríguez-Iturbe, I. & Valdés, J.B. (1979). *The geomorphologic structure of hydrologic
  response.* Water Resources Research 15(6), 1409–1420.
- Chow, V.T., Maidment, D.R. & Mays, L.W. (1988). *Applied Hydrology.* McGraw-Hill.
  (Chapters 5–7: hydrographs, unit hydrographs, lumped routing.)
- Das, S. CVE2142 *Hydraulics and Hydrology* Lecture 10 notes, University of Glasgow
  (Singapore).
