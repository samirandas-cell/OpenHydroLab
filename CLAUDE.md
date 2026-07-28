# OpenHydroLab — project context

Open-source interactive browser laboratories for teaching undergraduate hydraulics and
hydrology. Eight modules, each a self-contained page that computes every displayed
quantity from the governing equations and runs offline with nothing to install.

**Publication target:** MDPI *Education Sciences*, Special Issue "The Role of Technology
in STEM Education: Opportunities and Challenges", deadline **2026-12-31**, APC CHF 2000
(covered by Samiran's MDPI coupons — verify expiry, stacking cap and SI eligibility with
the editorial office before drafting). Framed as a **design-and-technical-validation**
study: no claim about learning outcomes, which is a separate later paper. JOSE is closed
to submissions; CAEE (Wiley, SCIE, free to publish) is the fallback and the natural home
for the later classroom study.

## Layout

```
animations/      the eight laboratories, plus vendor/three (classic scripts, r160)
docs/            one guide per module, 7 sections each
tests/physics/   94 verification cases, one spec per module
tests/software/  load, self-containment, file://, accessibility, label layout
tools/           static server, validation reporter, three vendoring
validation/      protocol + generated results (json/md)
paper/           JOSE-era draft, to be superseded by the Education Sciences manuscript
```

`npm install && npm run install-browsers && npm test` → 405 tests on Chromium, Firefox
and WebKit; writes `validation/results/` (354 numerical comparisons).

## Locked-in decisions

- **Physics lives in a classic `<script>`, rendering in whatever it needs.** Top-level
  bindings in a classic script are global, so the model is reachable from
  `page.evaluate()` and verifiable at machine precision. Anything sealed in a
  `<script type="module">` can only be checked through DOM readouts — display precision,
  ~1e-3 instead of 1e-12.
- **No third-party hosts, ever.** Three.js is vendored under `animations/vendor/three/`
  as **classic scripts**, produced by `node tools/vendor-three.mjs`.
- **References in tests must be derived independently** of the code — closed form,
  conservation identity, or hand-checkable textbook calculation, recorded in the case's
  `source` field. A test that re-runs the module's own arithmetic proves nothing.
- **Tolerances are justified per case, never widened to pass.** Machine precision for
  closed-form identities; the three cases above 1e-9 are documented in
  `validation/validation-protocol.md` §6 with the mathematics that limits them.
- **Retries: zero for physics, two for UI interaction specs.** A retry in the physics
  suite would hide a real numerical failure; the UI specs face genuine headless-graphics
  flakiness.

## What NOT to do

- **Never verify only over `http://localhost`.** Browsers block ES-module imports from a
  `file://` origin under CORS. Vendoring Three.js as an ES module passed every test and
  left a blank page for anyone who double-clicked the file. `tests/software/file-protocol.spec.mjs`
  exists for this.
- **Never chain the exponential reservoir update and call it exact.** Feeding reservoir
  1's end-of-step value into reservoir 2 is first order and lags the rising limb by Δt/2.
  Exact cascade step: `Q₂⁺ = I + (Q₂−I)e^(−Δt/k) + (Q₁−I)(Δt/k)e^(−Δt/k)`, `Q₁` taken at
  the *start* of the step.
- **Never record simulation state after stepping.** Push to the output arrays first, then
  advance, or index `j` holds the state at `(j+1)Δt`.
- **Never hand-place 3D labels.** Sprites hold a fixed pixel size while the geometry
  changes by orders of magnitude, so tuned offsets collapse silently. Labels that must not
  collide go in one stack at the same station and z; scaled offsets need a floor of ~one
  label height. `tests/software/label-layout.spec.mjs` measures it.
- **Never assume the module is wrong before deriving the reference twice.** The
  two-reservoir cascade peaks *after* the rain stops, where `q₁ = q₂`; the first version of
  that test was wrong, not the code.
- Don't add a module without a docs guide, a physics spec, and an entry in
  `tests/helpers/lab.mjs`.

## Log

### 2026-07-28 — verification harness, offline/`file://` fix, label layout, guides

**Delivered.** Playwright suite (`tests/`, `tools/`, `playwright.config.mjs`): 94 physics
cases × 3 engines = 354 numerical comparisons, 0 failing; 405 tests total.
`tools/validation-reporter.mjs` generates `validation/results/validation-results.{json,md}`
so the manuscript's tables come from the run, not transcription.
`validation/validation-protocol.md` states methods, tolerance policy and known gaps.
Guides written for `specific_energy` and `hydraulic_jump` — all eight modules now
documented.

**Defects the harness found and fixed.** (1) Storm hydrograph recorded state before
advancing → series half a step off its axis. (2) Its cascade was first-order despite a
comment claiming "exact exponential stepping" → replaced with the exact closed-form step.
(3) All 45 sliders lacked accessible names → `<label for>` added. (4) `channel_geometry`
loaded Three.js from a CDN → vendored. (5) The vendored ESM import then broke `file://`
entirely → converted to classic scripts. (6) `S₀` label buried the side-slope label `m`
in the 3D view → moved into the centre-line stack.

**Decisions.** Education Sciences over Water: both now report IF 3.5, but Water's
education SI is social-science water literacy edited by a risk-perception researcher, and
its reviewer pool asks for new hydrology this paper does not have. Spend the coupon on the
weaker paper and keep free-to-publish CAEE for the classroom study that will earn it.

**Next.** Prepare the Education Sciences manuscript.
