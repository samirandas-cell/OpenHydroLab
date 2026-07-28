# OpenHydroLab — project context

Open-source interactive browser laboratories for teaching undergraduate hydraulics and
hydrology. Eight modules, each a self-contained page that computes every displayed
quantity from the governing equations and runs offline with nothing to install.

**Publication target:** MDPI *Education Sciences*, Section STEM Education, Special Issue
"The Role of Technology in STEM Education: Opportunities and Challenges"
(<https://www.mdpi.com/journal/education/special_issues/2Z5P5LP271>), deadline
**2026-12-31**, APC CHF 2000 — settled, coupons plus any shortfall paid directly. Framed
as a **design-and-technical-validation** study: no claim about learning outcomes, which is
a separate later paper. Submitting **without** an expert-review survey; if the SI declines
on scope, add an expert-evaluation instrument and go to CAEE (Wiley, SCIE, free to
publish), which is also the natural home for the later classroom study. JOSE is closed to
submissions.

**Cite as:** version DOI [10.5281/zenodo.21635798](https://doi.org/10.5281/zenodo.21635798)
(v1.0.0) · concept DOI
[10.5281/zenodo.21635797](https://doi.org/10.5281/zenodo.21635797) (latest).

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
- **Never assume `CITATION.cff` is what Zenodo reads.** When `.zenodo.json` is present,
  Zenodo ignores `CITATION.cff` entirely for release archiving. Validating the CFF file
  proves nothing about the deposition. Zenodo also wants a lowercase licence id
  (`"mit"`, not `"MIT"`), and `related_identifiers` entries take `resource_type`, not
  `scheme`. Check `.zenodo.json` against
  <https://help.zenodo.org/docs/github/describe-software/zenodo-json/> before publishing a
  release — the metadata is read from the *tag's* snapshot, so a fix afterwards means
  moving the tag or cutting a new one.

## Log

### 2026-07-28 — v1.0.0 frozen and archived; Education Sciences enquiry drafted

**Delivered.** `v1.0.0` tagged at `5034dd7` and pushed. Real ORCID
(`0000-0002-3814-534X`, verified against orcid.org before writing) in `CITATION.cff`,
`paper/paper.md` and `.zenodo.json`; `package.json` bumped from `1.0.0-rc.1`.
`cffconvert --validate` → valid, CFF 1.2.0. Archived on Zenodo:
**version DOI 10.5281/zenodo.21635798**, **concept DOI 10.5281/zenodo.21635797**, wired
into `CITATION.cff` (version DOI as `doi:`, both under `identifiers:`), the README badge
and Citing section, and `paper/paper.md` under a new Software availability section.
`npm test` re-run at the tagged commit: 405 passed, 354 numerical comparisons, 0 failing.

`paper/presubmission-enquiry.md` holds the 254-word enquiry abstract, the email, and the
journal/SI selection rationale.

**The Zenodo trap.** `.zenodo.json` **completely overrides `CITATION.cff`** for GitHub
release archiving — the carefully validated CFF file is ignored. The first `.zenodo.json`
had `"license": "MIT"` (Zenodo wants lowercase `"mit"`) and a `related_identifiers` entry
using `scheme` where the schema expects `resource_type`; either would have failed the
release. Caught before publishing, which cost one force-moved tag instead of a re-release.
If a metadata field matters, it must be in `.zenodo.json`, not only in `CITATION.cff`.

**Special issue confirmed.** *Education Sciences*, Section STEM Education, SI "The Role of
Technology in STEM Education: Opportunities and Challenges"
(<https://www.mdpi.com/journal/education/special_issues/2Z5P5LP271>), deadline
**2026-12-31**, editors Kozan (FSU), Butt (Oklahoma), **Anwar (Texas A&M Engineering — the
natural handling editor)**, Yu (JMU). It explicitly invites design-based research and lists
"systems and processes leading to technological tools for STEM education" as a theme, which
is a direct licence for a verification-protocol paper carrying no learning claim. All seven
pages of open SIs were checked; the nearest alternative ("21st Century Science Classrooms",
deadline 2026-09-01) wants the classroom-integration evidence this paper deliberately omits.

**Decisions.** Submit **without** the expert-review survey; if the SI declines on scope,
add an expert-evaluation instrument and go to CAEE (Wiley, free to publish). APC settled —
coupons have covered an MDPI SI for this author before and any shortfall is paid directly,
so the presubmission enquiry is kept ready but is **not** a gate on drafting. Of the three
papers in the SI so far, all are empirical or review; this would be its first
design-and-artifact paper — the known risk, accepted.

**Next.** Draft the Education Sciences manuscript. `paper/paper.md` is still the JOSE-era
stub: Summary needs its design paragraph, and Statement of Need, Learning objectives /
instructional design and Acknowledgements are TODO. Results tables should be generated
from `validation/results/`, never transcribed.

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
