# OpenHydroLab — project context

Open-source interactive browser laboratories for teaching undergraduate fluid mechanics,
hydraulics and hydrology. Ten modules, each a self-contained page that computes every
displayed quantity from the governing equations and runs offline with nothing to install.

**Publication target:** MDPI *Education Sciences*, Section STEM Education, Special Issue
"The Role of Technology in STEM Education: Opportunities and Challenges"
(<https://www.mdpi.com/journal/education/special_issues/2Z5P5LP271>), deadline
**2026-12-31**, APC CHF 2000 — settled, coupons plus any shortfall paid directly. Framed
as a **design-and-technical-validation** study: no claim about learning outcomes, which is
a separate later paper. Submitting **without** an expert-review survey; if the SI declines
on scope, add an expert-evaluation instrument and go to CAEE (Wiley, SCIE, free to
publish), which is also the natural home for the later classroom study. JOSE is closed to
submissions.

**Cite as:** version DOI [10.5281/zenodo.21915743](https://doi.org/10.5281/zenodo.21915743)
(v1.0.5 — the release the manuscript cites) · concept DOI
[10.5281/zenodo.21635797](https://doi.org/10.5281/zenodo.21635797) (latest).

## Layout

```
animations/      the ten laboratories, plus vendor/three (classic scripts, r160)
docs/            one guide per module, 7 sections each
tests/physics/   47 specs × 3 engines, emitting 118 verification cases per engine
tests/software/  load, self-containment, file://, accessibility, label layout
tools/           static server, validation reporter, manuscript tables, three vendoring
validation/      protocol + generated results (json/md)
paper/           the Education Sciences manuscript (paper.md, paper.bib) + the enquiry
                 — LOCAL ONLY, git-ignored during double-blind review
submission/      the submission package built from it — LOCAL ONLY, git-ignored
```

`npm install && npm run install-browsers && npm test` → 405 tests on Chromium, Firefox
and WebKit (141 physics + 264 software runs); writes `validation/results/`
(354 numerical comparisons = 118 distinct cases × 3 engines).
`npm run paper` regenerates the manuscript's tables from that dataset;
`npm run paper:check` fails if the manuscript has drifted from it, and skips cleanly on a
clone that has no `paper/` — so `npm run validate` passes there too.

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

- **Never run a subset of the Playwright suite without restoring `validation/results/`
  afterwards.** `tools/validation-reporter.mjs` is registered as a reporter in
  `playwright.config.mjs`, so *every* run rewrites the dataset — and a subset
  (`--project=chromium`, a single spec) writes a **truncated** one. Running just the
  software specs silently replaced the 354-case dataset with `caseCount: 0`, which would
  have taken the manuscript's whole evidence base with it. Either run the full `npm test`,
  or `git checkout -- validation/results/` immediately after, and confirm with
  `npm run paper:check`.
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

### 2026-08-13 — submission copy reviewed and corrected; v1.0.4 prepared, not published

**Delivered.** `submission/education-sciences/` — the Codex-drafted Education Sciences
manuscript brought into this repository, reviewed line by line against the dataset and
the test source, and corrected in eleven places. The folder is **git-ignored**: the
Special Issue runs double-blind review, so the manuscript, its blinded copy and the
cover letter stay on disk and out of the public repository and the Zenodo archive. All generated blocks were confirmed
character-identical to `validation/results/`, and every prose number was recomputed:
197/591/108/324, 127 tight cases, the sweep sizes, the bisection counts, the test
viewports and all seven defect narratives hold. Four Word files were built by
`tools/manuscript-docx.cjs`: a highlighted review copy and a clean submission copy of
each of the named and blinded manuscripts.

**The corrections that mattered.** §3.1 claimed the 127 tightest cases use "under a
thousandth of a percent" of their allowance; seven use more, the worst 0.13% — a figure
Table 4 prints on the same page, so the prose contradicted its own table. The
`rel ≤ 1e-6` group reaches 9.9% of its bound and appeared neither in that list nor in
Table 2's tolerance policy, so the second-worst group in the run had no stated
justification. The retry claim was broader than `playwright.config.mjs`: only
`accessibility.spec.mjs` sets `retries: 2`. And "every laboratory is covered by every
class of check" is false for label separation, which measures the 3D channel-geometry
scene alone.

**Release prep.** `package.json`/`package-lock.json` 1.0.2 → 1.0.4 (they had drifted a
release behind `CITATION.cff` and `.zenodo.json`), CITATION 1.0.4 / 2026-08-13, Zenodo
description rewritten for 197 cases. §6 and the Data Availability Statement now cite
1.0.4, and the "archive is three cases behind" qualification is gone. The release was
published the same day as **10.5281/zenodo.21915552**, and the DOI is wired through
`paper/paper.md`, the submission copy, `CITATION.cff` and the README. `.zenodo.json` was
deliberately left structurally identical to the file that published 1.0.3 — no
`related_identifiers` — because a rejected deposition wedges the tag on 409 forever. The
deposit was verified against the Zenodo API rather than assumed: record 21915552, version
1.0.4, one 1.28 MB archive, concept DOI resolving to it.

**Gotcha.** The first attempt looked published and was not. Zenodo showed three records
and the concept DOI still resolved to 1.0.3 across four minutes of checks, which reads
exactly like the v1.0.1 storage fault — but the actual cause was that GitHub had no
v1.0.4 release at all, only the `/releases/new` form, most likely saved as a draft. A
draft is invisible anonymously and fires no webhook. **Check `/releases` before
diagnosing Zenodo**, and note that the anonymous view is the honest one: it shows what
the webhook saw.

**Decisions.** `tools/manuscript-docx.cjs` gained
explicit source/bib arguments and `[text]{.mark}` → yellow-highlight support, so the
review copy is typeset by the same MDPI code path as `paper/paper.docx` rather than by a
second toolchain; `npm run paper:docx` is unchanged.

**Next.** The author-side submission gate: accept the highlighted corrections, confirm the affiliation wording,
recheck the APC — this file and `paper/presubmission-enquiry.md` still say CHF 2000
against CHF 1800 shown on the Special Issue page on 13 August 2026.

### 2026-08-13 — v1.0.5: the manuscript leaves the published repository

**Delivered.** `paper/` joined `submission/` in `.gitignore`, and v1.0.5 was cut from the
resulting tree. The archive now holds the laboratories, their guides, the protocol, the
suite and the generated dataset — everything a reader needs to check the reported
results — and not the paper describing them, which is withheld while the Special Issue
runs double-blind review. The dataset is identical to v1.0.4: 197 cases, 591 comparison
records, 108 checks, 324 executions, none failing. No physics changed.

**Why a second release the same day.** v1.0.4 was published before the manuscript was
removed, so the archive the paper cited contained the paper. Correct, but self-defeating
during blind review. v1.0.4 stays published and valid — it holds the same dataset — and
the manuscript now cites v1.0.5 instead.

**Gotcha.** Removing `paper/` breaks `npm run validate` on a clone, because it chains
`paper:check` and the tool threw `ENOENT` on the missing file. `manuscript-tables.mjs`
now exits 0 with a message when `paper/paper.md` is absent, and runs in full when it is
there. Tested both ways before tagging.

**Limit worth remembering.** The removal is forward-only. `paper/` was tracked since July
across 47 commits and sits inside all five archives up to v1.0.4; rewriting that history
would change the SHAs the manuscript cites and break four published DOIs. The text stays
readable in history and in those archives.

### 2026-08-09 — fluid mechanics section opened: hydrostatic forces, 2D and 3D

**Delivered.** Two modules and a new landing-page section, **Fluid mechanics**, placed
before open-channel hydraulics because statics is taught first.
`hydrostatic_forces.html` — the pressure prism as a diagram linked to a true-scale section;
horizontal / vertical / inclined on one continuous θ slider; curved surfaces via F_x on the
projection and F_v = γV. `hydrostatic_forces_3d.html` — the prism built as an orbitable
solid, four plate shapes whose A, ȳ and I_xc are re-derived from the shape's own chord
width and checked against the standard table on screen, and a real cylindrical gate.
Both carry a **generated worked-solution panel**: formula, substitution with the current
slider values, result, and a plain-English line per step, with `◀ ▶` walking the steps
while the drawing dims everything the step is not about. Guides written for both. Suite now
520 tests, **534 numerical comparisons, 0 failing**.

**The teaching idea.** One statement carries the whole topic: the resultant is the *volume*
of the pressure prism and the centre of pressure is its *centroid*. Horizontal → rectangular
prism → CP on the centroid; vertical breaking the surface → triangle → 2L/3; inclined
interpolates. Writing Δy as `I_xc sinθ/(h_c A)` instead of `I_xc/(y_c A)` removes the
θ → 0 singularity, so one expression covers all three and the slider can sweep through
horizontal — while `y_c = h_c/sinθ` is still displayed running off to infinity, which is
the point worth saying out loud.

**The curved-surface result.** Traction on a circular arc is radial, so `r × p n = 0`
pointwise about the centre of curvature: a Tainter gate carries zero hydrostatic moment on
its pivot at any head. Shown as a *cancellation* of two large opposing moments rather than
an absence, and geometrically — the two components' lines of action meet at P\*, and the
resultant drawn from P\* is seen to pass through the pivot, because the resultant of two
forces passes through their intersection.

**Defects found while building.** (1) A top-level `const CSS` in the 2D module shadowed the
standard `window.CSS` global, breaking `CSS.escape` in the accessibility probe on all three
engines — the suite caught it, renamed to `ROOTCSS`. (2) The resultant was first drawn
arriving from the dry side. (3) `chipLabel` and `hatch` set `ctx.globalAlpha` absolutely, so
dimmed captions kept full-strength backgrounds once step emphasis existed — they now
multiply the inherited alpha. (4) Scenes letterboxed in portrait viewports until the slack
world dimension was grown (capped) and the drawing centred.

**Decisions.** 3D labels are HTML divs projected each frame with a collision pass, not
sprites — fixed pixel size by construction, taggable so a step can hide a subset, and
measurable by `getBoundingClientRect()` rather than a re-implemented projection. Zero
overlaps across four shapes and two modes. The fluid-side toggle (real vs imaginary volume)
stays 2D-only; the four plate shapes stay 3D-only.

**Next.** `paper/paper.md` still says "eight laboratories" throughout — abstract, Statement
of Need, and Table 1 all need the count and the fluid-mechanics row. Deliberately not
touched here: it is an editorial pass on a manuscript, not a mechanical find-and-replace.

### 2026-08-02 — manuscript corrections closed; paper.md submission-ready

**Delivered.** All five outstanding manuscript items in `paper/paper.md`. (1) The YAML
title now reads "Designed for Verification: Developing and Validating an Open, Offline
Simulation Suite…", matching the sent enquiry — the old "Verifiable by Construction"
variant is gone. (2) The Acknowledgments TODO is resolved with a **generic**
acknowledgment of the Glasgow (Singapore) hydraulics and hydrology students; no
individual is named, so no permission is outstanding. (3) `finkelstein2005when` is now
cited in the Introduction (controlled physics comparisons where a simulation substituted
for equipment outperformed it) — the bib-vs-citation cross-check reports **0 uncited of
28**. (4) A back-matter **Use of Generative AI** section discloses Claude Code's role
across module code, tests, guides and manuscript drafting, with the author's
responsibility scope stated. (5) MDPI back matter completed: Author Contributions (CRediT,
single author), Informed Consent "Not applicable", a corresponding-author designation with
the full postal affiliation, and the abstract converted to
Background/Objectives–Methods–Results–Conclusions. `npm run paper:check` passes and no
TODO markers remain.

**Decisions.** Postal affiliation printed as *James Watt School of Engineering, University
of Glasgow (Singapore campus), 1 Punggol Coast Road, Singapore 828608, Singapore*
(confirmed by the author this session; nothing in the repo carried a street address).
Acknowledgments deliberately generic — naming colleagues requires permission that has not
been sought, and MDPI prints the section verbatim. A fifth **limitation** was added to
§4.4 stating that module and test code share an author and were both LLM-assisted, and
that the protocol's independence requirement therefore binds the *derivation* (the
recorded closed form, identity or textbook source), not the typist; independent
reimplementation by a second party is named as the stronger evidence not yet available.
Making that explicit is better than letting a reviewer find it.

**Gotcha.** The structured abstract is **233 words** against MDPI's ~200 guideline (the
unstructured draft was 213; the four section labels and the restructure add the rest). If
an editor objects, the cheapest ~16 words are the two module parentheticals in
Background/Objectives.

**Next.** Convert `paper/paper.md` to the MDPI Word template and submit, unless the
presubmission enquiry reply redirects the target.

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
work, so all ten labs are offline; the real caveat is that `channel_geometry.html` and
`hydrostatic_forces_3d.html` need
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

**Resolved 2026-07-31.** Zenodo's storage fault cleared and v1.0.2 published as
**10.5281/zenodo.21665643** (record 21665643); the concept DOI now resolves to it. The
published archive was **downloaded and inspected**, not assumed: it contains
`tools/manuscript-tables.mjs`, the protocol, the validation dataset, all eight
laboratories and the vendored Three.js — so the reproducibility instruction in §6 is now
true of the archive it cites. The DOI is wired through `paper.md` §6 and the Data
Availability Statement, the suggested citation, `CITATION.cff`, the README badge section,
`index.html` and the enquiry file.

**Also.** The software was published on ResearchGate (item type *Other → Code*, linked by
DOI rather than uploading the archive, with a one-page description PDF as the required
file) and announced on LinkedIn. The manuscript was deliberately **not** posted anywhere:
the Special Issue runs double-blind review, and a preprint under the author's name defeats
the blinding even though MDPI permits preprints. `index.html` gained Open Graph/Twitter
tags and `og-preview.png` so shared links render a real preview.

**Known gap.** `og-preview.png` was generated by a throwaway script (Playwright
screenshots of four laboratories composed in an HTML grid, captured at 1200×630). There is
no committed tool to rebuild it, so adding or restyling a module will silently leave the
preview stale. Worth a `tools/` script if the site image is to stay accurate.

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
