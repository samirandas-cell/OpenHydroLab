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
tests/physics/   47 specs × 3 engines, emitting 118 verification cases per engine
tests/software/  load, self-containment, file://, accessibility, label layout
tools/           static server, validation reporter, manuscript tables, three vendoring
validation/      protocol + generated results (json/md)
paper/           the Education Sciences manuscript (paper.md, paper.bib) + the enquiry
```

`npm install && npm run install-browsers && npm test` → 405 tests on Chromium, Firefox
and WebKit (141 physics + 264 software runs); writes `validation/results/`
(354 numerical comparisons = 118 distinct cases × 3 engines).
`npm run paper` regenerates the manuscript's tables from that dataset;
`npm run paper:check` fails if the manuscript has drifted from it.

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

- **Never assume Zenodo will archive a release just because the tag is pushed.** Zenodo
  archives on GitHub **Release publication**, not on tag push, and enabling the repo
  archives only *future* releases — a release published before the toggle went on is
  invisible to it forever. Worse, a failed attempt leaves a half-built record on the
  concept, and every later event for that tag returns **HTTP 409**; the only escape is a
  tag Zenodo has never seen. Check the per-release **Errors** tab at
  <https://zenodo.org/account/settings/github/> — it names the real cause, which in our
  case was `Record 'N' has no file '...zip'`, i.e. their file transfer, not our metadata.
- **Never trust a contact address, count or identifier taken from this repo's own files
  without re-verifying it.** `presubmission-enquiry.md` carried `educsci@mdpi.com`; the
  real address is `education@mdpi.com` (`EducSci_MDPI` is only the journal's social
  handle). The log likewise said the bibliography had 27 entries; it has 28. Both errors
  were repeated downstream before being caught.

## Log

### 2026-07-29 — bibliography verified, review fixes applied, v1.0.2 cut (archiving blocked)

**Delivered.** `paper/paper.bib` verified: all 15 DOI entries resolve with year, volume,
issue, pages and author count matching Crossref; 4 more DOIs added from the Crossref book
index and OSTI; 2 historical papers confirmed against Internet Archive page scans.
**21 of 28 verified.** Three corrections: `smith2016software` was missing its corporate
fourth author (FORCE11 Software Citation Working Group); `sherman1932streamflow` had an
inserted "the" in its title (printed headline is "Streamflow from Rainfall by Unit-Graph
Method"); 4 book/report DOIs confirmed rather than guessed. `paper/references/index.html`
is the working link index for the remaining lookups.

Codex's repo-level blockers fixed: `package-lock.json` version drift, the dead
`npm run validate` script, the protocol's wrong sweep counts (it claimed "81 storm, 81
channel"; the dataset runs **99 storm, 81 Manning, 64 channel, 21 jump, 9 gate**), the
"Known gaps: None open" claim, and the stale "needs a CDN on first load" text on the site,
README, guide and Zenodo description — Three.js has been vendored since the verification
work, so all eight labs are offline; the real caveat is that `channel_geometry.html` needs
`animations/vendor/three/` beside it.

**Decisions.** `CITATION.cff` now carries the **concept** DOI as its primary `doi:` — a
release cannot contain its own version DOI, since Zenodo mints it at publication and reads
the file from the tag snapshot, so a version DOI there is stale by construction.
`npm run validate` now runs the suite *and* `paper:check`, so "validate" means the whole
claim chain. v1.0.1 was retired and v1.0.2 cut because Zenodo wedged on the v1.0.1 tag.
Presubmission enquiry sent to `education@mdpi.com`.

**Gotchas.** Two wrong facts in this repo's own files propagated before being caught — see
the two new standing rules above. Also: an identical re-run produces a ~1,200-line diff in
`validation-results.json` purely from parallel-execution ordering, which obscures real
changes; sorting cases before writing would make the archive byte-stable.

**Not done.** **Zenodo holds no v1.0.2 record.** Their GitHub integration failed three
times (`has no file`), and manual upload of the 452 KB archive also fails — a Zenodo
storage-layer fault, not ours (`cffconvert` validates, `.zenodo.json` parses, GitHub
serves the zip at HTTP 200). A manual new-version **draft with correct metadata is saved**
on Zenodo and needs only the file. `paper.md` §6 still pins version 1.0.0 and its version
DOI.

**Next.** Finish the manuscript's outstanding corrections (see below).

### 2026-07-28 — Education Sciences manuscript, first complete draft

**Delivered.** `paper/paper.md` rewritten from the JOSE stub into a full MDPI manuscript
(~8,500 words, abstract 213): Introduction, Materials and Methods (design commitments,
instructional use, the protocol), Results, Discussion, Conclusions, MDPI back matter.
`paper/paper.bib` expanded 2 → 28 entries (the "27" first recorded here was a miscount).
Funding: no external funding. Every table and
inline count in Section 3 is generated by `tools/manuscript-tables.mjs` from
`validation/results/` and injected between markers; `npm run paper:check` verifies sync.

**Decisions.** Framed for the SI theme with the *protocol* as the contribution and the
artifact as its evidence — Section 4.2 states four transferable rules, Section 3.5 tables
the six defects it exposed, including the case where the test was wrong and the code was
right. No learning claim anywhere: Table 1's "conceptual target" column is labelled design
intent, and §4.1/§4.4/§4.5 fence the scope explicitly. Reported counts are only those the
dataset supports (354 comparisons, 264 software runs), not the 405 headline.

**Gotchas.** (1) The old CLAUDE.md figure of "94 verification cases" was wrong — the
dataset holds **118** distinct cases; 405 = 141 physics runs + 264 software runs. Layout
section corrected. (2) **Never write a marker-injection regex with a bare lazy
`[\s\S]*?`** — with an empty block it matched past its own END marker to the next one and
silently ate two sections of prose. The pattern must exclude the marker tokens
themselves: `(?:(?!<!-- (?:BEGIN|END) GENERATED)[\s\S])*`. (3) Module quantity strings
contain `|M₁ − M₂|` — escape pipes before emitting a markdown table cell.

**Next.** Verify the bibliography. All 27 entries were written from reading knowledge, not
resolved against a live index; volumes, pages and DOIs need checking against publisher
records, and `paper/paper.md` still has one TODO (Acknowledgments) needing names and
permission. After that, convert to the MDPI Word template and submit, optionally sending
`paper/presubmission-enquiry.md` first.

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

**Gotcha.** The first `.zenodo.json` would have failed the release; caught before
publishing, at the cost of one force-moved tag. Written up as a standing rule under
*What NOT to do* above.

**Decisions.** Target SI confirmed open and a good fit — it invites design-based research
and lists "systems and processes leading to technological tools for STEM education", which
is a direct licence for a verification-protocol paper with no learning claim. Editors
Kozan (FSU), Butt (Oklahoma), **Anwar (Texas A&M Engineering — the likely handling
editor)**, Yu (JMU). All seven pages of open SIs were checked; the nearest alternative
("21st Century Science Classrooms", deadline 2026-09-01) wants the classroom-integration
evidence this paper deliberately omits. Submitting **without** the expert-review survey and
accepting the scope risk: all three papers in the SI so far are empirical or review, so
this would be its first design-and-artifact paper. APC settled, so the enquiry is ready to
send but is **not** a gate on drafting.

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
