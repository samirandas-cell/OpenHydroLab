# Rainfall Frequency & IDF Curves — full guide

`animations/idf_frequency.html` · 2D canvas, single file, fully offline

## 1. Purpose

The animation answers the question every drainage design starts with: **how do you turn a
box of raw rain-gauge data into a design discharge?** It walks the complete pipeline on a
*real* gauge — Drumalbin 00987, Lanarkshire (Met Office MIDAS-Open hourly rainfall,
1991–2024, UK Open Government Licence) — whose usable record (27 years) is embedded in the
file:

1. **Extract** annual-maximum (AM) intensities for six durations with a sliding window,
2. **Fit** a Gumbel (EV1) distribution per duration by the method of moments,
3. **Build** the intensity–duration–frequency family and a fitted Sherman equation,
4. **Design** with the rational method — and *see why the design storm lasts exactly t꜀*.

Nothing on screen is faked: every AM value comes from scanning the embedded hourly record,
every curve from the fitted parameters, and the extraction is checked live against the
archived AM series (the on-screen "6 / 6 ✓ match archive" readout).

## 2. Theory

### 2.1 Preparing the dataset (stage ①)

Quality control first: only years with ≥ 90 % hourly coverage are used — 27 of 34 survive.
For each duration D ∈ {1, 2, 3, 6, 12, 24 h}, a D-hour window slides across the hourly
series; the wettest position gives the year's AM depth, and

  i = depth / D  (mm/h).

Windows containing missing hours are skipped (equivalent to
`slide_dbl(..., .complete = TRUE)` in R). Two facts the animation makes visible:

- a longer window gathers **more depth but lower mean intensity**;
- the winning window need not sit in the same storm — in 2022 the sharpest hour is an
  **August cloudburst** (16 mm in one hour) while the 12–24 h maxima come from a
  **late-December frontal system**.

Sub-hourly durations (15–30 min) would require pluviograph data; an hourly gauge cannot
resolve them, and the tool flags any design that needs them.

### 2.2 Gumbel (EV1) by the method of moments (stage ②)

CDF: F(x) = exp[−exp(−(x − ξ)/α)]. With the sample mean μ and standard deviation σ
(n − 1 convention, as in R and Excel):

  α = (√6/π)·σ ≈ 0.7797 σ,  ξ = μ − 0.5772 α.

Design quantile for return period T:

  i_T = ξ + α·y_T,  y_T = −ln[−ln(1 − 1/T)].

The probability plot uses Weibull plotting positions F = m/(n + 1); a straight point cloud
on Gumbel paper is the visual goodness-of-fit check.

Binomial risk over a design life of n years (p = 1/T):

  P(X = r) = C(n,r)·pʳ(1 − p)ⁿ⁻ʳ,  P(X ≥ 1) = 1 − (1 − p)ⁿ.

### 2.3 The Sherman equation and the rational-method bridge (stages ③–④)

The 36 Gumbel design intensities (6 durations × 6 return periods) are condensed into one
smooth surface by nonlinear least squares (Levenberg–Marquardt, same objective as R's
`nls()`):

  i = a·T^m / (D + b)^n

so intensity can be read at *any* duration — in particular at the time of concentration,
which never coincides with a tabulated duration. Kirpich (1940):

  t꜀ = 0.0195 · L^0.77 · S^−0.385  (minutes; L in m, S in m/m).

Rational method (SI): Q_p = C·i·A / 3.6 with i in mm/h and A in km². The tool computes the
same number through base SI units and displays the agreement (✓) as a unit-integrity check.

**The deep point of stage ④**: plotting Q_p(D) = C·i(D,T)·A/3.6·min(D/t꜀, 1) shows a
maximum *exactly at D = t꜀* — shorter storms never wet the whole catchment (the
contributing-area factor), longer storms have lower intensity (the IDF decay). That is the
physical reason the design storm duration equals the time of concentration.

### 2.4 Verified numbers

All computed live in the file and checked against the published analysis of the
*Statistical Hydrologist's Notebook* (video 02, same gauge and method):

| Quantity | Animation | Published |
|---|---|---|
| Gumbel 1 h: ξ, α | 8.1714, 1.9873 mm/h | 8.1714, 1.9873 |
| i(1 h, T = 100 yr) | 17.31 mm/h | 17.31 |
| 2022 AM extraction (all 6 D) | 16 / 9.3 / 7.87 / 5.83 / 4.15 / 2.13 mm/h | identical (✓ on screen) |
| Kirpich t꜀ (L = 4000 m, S = 0.005) | 1.48 h (89 min) | 1.48 h |
| i(t꜀, T = 100) from Sherman fit | 13.28 mm/h | 13.28 |
| **Q_p (A = 10 km², C = 0.45)** | **16.60 m³/s** | **16.60** |
| Example 4 risk (T = 50): once in 20 yr / twice in 15 yr / ≥once in 20 yr | 0.272 / 0.032 / 0.332 | lecture solution |

### 2.5 Sliders → classical controls

| Control | Classical quantity |
|---|---|
| Duration chips (1–24 h) | AM extraction window D |
| Return period T | Gumbel reduced variate y_T |
| Design life n | Binomial risk horizon |
| A, C | Rational-method area and runoff coefficient |
| L, S | Kirpich time of concentration |
| Storm duration D (lock = t꜀) | Contributing-area factor min(D/t꜀, 1) |

## 3. Description of the tool

- **Bottom-centre navigation** — the four pipeline stages: ① Extract AM, ② Fit Gumbel,
  ③ Build IDF, ④ Design Q_p.
- **Stage ①** — three bands: the full 2022 hourly record (with month axis, missing-data
  ticks, and amber markers where each duration's AM was found); a zoom around the sliding
  window with the live depth/intensity; the running D-hour depth trace with the record so
  far. A mini log–log chart collects the AM points over the full 27-year × 6-duration
  cloud; points fill amber when the live scan reproduces the archived value.
- **Stage ②** — Gumbel probability plot (Weibull positions, MoM line, secondary T-axis);
  the T-slider draws the quantile construction y_T → i_T.
- **Stage ③** — the IDF family: six Gumbel fits (points + solid lines, one colour per T)
  with the Sherman surface dashed on top; the design point is a star.
- **Stage ④** — left, the catchment drawn to scale for A with isochrone bands shading the
  contributing area after D and an animated main channel (drop travel divide→outlet = t꜀);
  right, the Q_p(D) curve with its peak pinned at D = t꜀.
- **Right panel** — every fitted parameter, the design intensity and depth, the binomial
  risk block, the Sherman coefficients with RMSE, and the rational-method result with the
  SI unit cross-check.
- **Buttons** — *Example 4 defaults* (T = 50, n = 20) reproduces the lecture's risk
  numbers; *Channel design defaults* (A = 10 km², C = 0.45, L = 4000 m, S = 0.005,
  T = 100) reproduces Q_p = 16.60 m³/s.

## 4. How to use

Quick start: open the file, press **Play** (or Space) and watch the 1-h window scan 2022 —
dry spells fast-forward automatically. Then click **Extract all 6** and move through the
stages.

Classroom sequence (~20 min):

1. (3 min) Stage ①, 1-h chips, Play. *Ask: where in the year do you expect the maximum?*
   Pause at the August cloudburst.
2. (3 min) Switch to 24 h and Play again. *Ask: same storm?* No — December front. Longer
   window, more depth, lower intensity.
3. (2 min) Extract all 6; point out the ✓ verification against the archived series and the
   27-year cloud: **one point per year per duration is the entire dataset**.
4. (4 min) Stage ②: the straight line *is* the model check. Slide T and watch the quantile
   construction. Example 4 defaults → risk block: a "rare" 50-year event still has a 33 %
   chance inside a 20-year design life.
5. (3 min) Stage ③: six separate Gumbel fits become one family; the dashed Sherman surface
   is what lets us read intensity at any duration.
6. (5 min) Stage ④, Channel design defaults. *Ask: why not design for the most intense
   storm (30 min)?* Untick the D = t꜀ lock and drag D — Q_p falls on both sides of t꜀.
   Then shorten L: watch t꜀ drop below 1 h and the tool refuse politely (data support).

Assessment-style questions: (a) Recompute ξ and α for the 6-h series from μ and σ shown on
screen. (b) With T = 100 yr and n = 50 yr, what is the probability of at least one
exceedance? (c) Why does halving L increase Q_p even though A and C are unchanged?

## 5. Assumptions and limitations

- AM series assumed independent and identically distributed; Gumbel fitted by moments
  (not L-moments or ML) to match the lecture and coursework spreadsheet.
- The rational method's linearity assumptions apply (small catchment, uniform rainfall);
  the contributing-area factor min(D/t꜀, 1) is the standard teaching idealisation.
- The catchment plan is drawn to scale for A, but the channel path is schematic — L enters
  only through Kirpich. Isochrone bands are radially scaled polygons (indicative, not
  equal-area). Channel flow dashes are cosmetic; their labelled travel time (t꜀) is exact.
- The Sherman fit has b ≈ −0.27 h: evaluation below D ≈ 0.5 h is blocked and any design
  with t꜀ < 1 h is flagged as beyond the data support (needs pluviograph data).
- One year (2022) of hourly data is embedded for the extraction demo; the other 26 years
  enter through their archived AM values (identical to the published `ams_idf.csv`).

## 6. Technical notes

Single self-contained HTML file (~60 kB), no libraries, offline. The 2022 hourly series is
run-length encoded; missing hours are preserved and excluded from windows exactly as
`slider::slide_dbl(.complete = TRUE)` does. The Sherman fit runs at load (Levenberg–
Marquardt on 36 points, < 5 ms). MIT license; data © Met Office, UK Open Government
Licence.

## 7. References

- Chow, V.T., Maidment, D.R., Mays, L.W. (1988). *Applied Hydrology*. McGraw-Hill.
- Gumbel, E.J. (1958). *Statistics of Extremes*. Columbia University Press.
- Kirpich, Z.P. (1940). Time of concentration of small agricultural watersheds. *Civil
  Engineering*, 10(6), 362.
- Sherman, C.W. (1931). Frequency and intensity of excessive rainfalls at Boston.
  *Transactions ASCE*, 95, 951–960.
- Met Office (2024). MIDAS-Open: UK hourly rainfall data. CEDA Archive.
- Das, S. Hydraulics & Hydrology lecture notes, University of Glasgow (Singapore).
