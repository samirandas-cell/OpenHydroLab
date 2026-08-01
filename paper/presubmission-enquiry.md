# Presubmission enquiry — Education Sciences Special Issue

**Target.** *Education Sciences* (MDPI, ISSN 2227-7102), Section "STEM Education",
Special Issue **"The Role of Technology in STEM Education: Opportunities and Challenges"**
<https://www.mdpi.com/journal/education/special_issues/2Z5P5LP271>
Guest Editors: Dr. Kadir Kozan (Florida State University), Dr. Ahmed Ashraf Butt
(University of Oklahoma), Dr. Saira Anwar (Texas A&M University), Dr. Nathaniel Taeho Yu
(James Madison University). Submission deadline **31 December 2026**. APC CHF 2000.

**Route.** The Special Issue page states: "For planned papers, a title and short abstract
(about 250 words) can be sent to the Editorial Office for assessment." Send the message
below to the *Education Sciences* Editorial Office (education@mdpi.com); copying the Guest
Editors is not required.

**Status (2026-07-28): optional, not blocking.** Samiran has published in an MDPI Special
Issue with coupons before and accepts both the APC exposure and the scope risk; if the
paper is rejected on scope, the plan is to add the expert-evaluation survey and submit to
*Computer Applications in Engineering Education* (Wiley, SCIE, free to publish). The
enquiry below is therefore kept ready to send but is **not** a gate on drafting the
manuscript. The abstract doubles as the manuscript's working abstract.

---

## Email

**To:** education@mdpi.com
(Verified 2026-07-29 against the journal contact page. NOT `educsci@mdpi.com` — an earlier
draft of this file carried that address and it is wrong; `EducSci_MDPI` is the journal's
social-media handle, which is most likely where the mistake came from.)
**Subject:** Presubmission enquiry — Special Issue "The Role of Technology in STEM Education: Opportunities and Challenges"

Dear *Education Sciences* Editorial Office,

I am considering submitting the paper below to the Special Issue "The Role of Technology
in STEM Education: Opportunities and Challenges" (Section: STEM Education; Guest Editors
Kozan, Butt, Anwar and Yu; deadline 31 December 2026), and would appreciate your advice on
whether it suits the collection.

The paper reports the design and technical validation of an open-source simulation suite
for undergraduate hydraulics and hydrology. Its contribution is a reproducible process for
verifying the calculations, software operation and offline delivery of educational
simulations. It reports no student data and makes no claim about learning outcomes; a
classroom evaluation is planned as a separate later study.

The paper appears to fit the themes "design, development, and integration of technologies
in STEM education" and "systems and processes leading to technological tools for STEM
education". Because its evidence is technical and computational rather than about classroom
effectiveness, I would be grateful if you could confirm whether the Guest Editors would
consider that scope appropriate.

The software, verification protocol and validation dataset are public under an MIT licence
at https://doi.org/10.5281/zenodo.21665643, so any reviewer can reproduce the reported
figures directly.

The proposed title and abstract follow. Thank you for your time.

Kind regards,
Dr Samiran Das
Assistant Professor in Civil Engineering
James Watt School of Engineering
University of Glasgow, Singapore
samiran.das@glasgow.ac.uk · ORCID: 0000-0002-3814-534X

---

## Title

**Designed for Verification: Developing and Validating an Open, Offline Simulation Suite
for Undergraduate Hydraulics and Hydrology**

<!-- Title changed 2026-07-28 from "Verifiable by Construction: Designing and Validating…".
     paper/paper.md must be reconciled to match before submission. -->

## Abstract (~255 words)

Interactive simulations are widely used in STEM teaching, but instructors and students are
rarely shown how the numbers on screen were checked. This paper presents OpenHydroLab, an
open-source suite of eight browser-based laboratories for undergraduate hydraulics and
hydrology, together with the process used to verify it. The laboratories cover channel
geometry, uniform flow, specific energy and choking, hydraulic jumps, gradually varied
flow, storm hydrographs, unit hydrographs, and rainfall frequency analysis.

Three requirements shaped the design: every displayed quantity is computed from the
governing equation rather than animated to look plausible; each laboratory is a
self-contained page that runs offline from a local file, with no installation and no
third-party host; and the governing equations remain visible in readable source. The
verification protocol follows from those commitments. Each reference value was derived
independently of the code — from a closed-form solution, a conservation identity, a
hand-checkable textbook calculation, or a separate implementation — with tolerances
justified case by case rather than widened to pass, and controls exercised across their
operating ranges, not only at default settings.

The released validation dataset contains 118 distinct numerical cases evaluated in
Chromium, Firefox and WebKit, giving 354 comparison records, alongside 88 software,
offline-delivery and accessibility checks repeated across the three engines. Applying the
protocol to code already in teaching use exposed six defects, including a routing step
documented in the source as exact but in fact first-order, and a laboratory that failed
when opened directly from disk.

The contribution is the verification process rather than evidence of learning
effectiveness: no student data were collected and no learning-outcome claim is made.

<!-- Abstract body: ~255 words. The SI page asks for "about 250". Recheck after any edit —
     over-running a stated limit in the enquiry undercuts a paper about following a
     specified protocol. Counts are load-bearing and verified against
     validation/results/validation-results.json: 118 distinct cases, 354 comparison
     records (118 x 3 engines), 88 software checks x 3 engines = 264 runs. Do NOT cite the
     405 headline here — it is 141 physics runs + 264 software runs, which the dataset
     does not present as one number. If an editor queries the 88, the unambiguous form is
     "264 software, offline-delivery and accessibility runs (88 checks x 3 engines)". -->

---

## Notes for the covering decision

- **Why this SI and not another.** Searched all open *Education Sciences* Special Issues
  (2026-07-28). The closest alternative is "21st Century Science Classrooms: Innovative
  Approaches to Technology Integration" (STEM Education section, deadline 1 Sep 2026,
  keywords include "digital simulations and modelling"), but that call is framed around
  classroom integration and professional development — i.e. it wants the evaluation study
  this paper deliberately does not contain. "Cognitive and Developmental Psychology in
  STEM Education" names engineering education but is psychometric in orientation.
  "The Role of Technology in STEM Education" explicitly invites design-based research and
  papers on "systems and processes leading to technological tools", which is exactly what
  a verification protocol is, and its 31 December 2026 deadline leaves the most room.
- **Guest Editor alignment.** Saira Anwar (College of Engineering, Texas A&M) lists
  "design and implementation of educational technologies" and "learning of complex tasks
  and concepts" among her interests — the natural handling editor for this paper.
- **Precedent in the SI.** Of the three papers published so far, "Beyond Beliefs:
  Understanding Instructor Framing and the Uptake of Educational Technology in Engineering
  Education" (Educ. Sci. 2026, 16(2), 221) confirms the SI accepts engineering-education
  work, though all three to date are empirical/review rather than design-and-artifact.
  This is the main risk to flag: ours would be the first design-and-validation paper in
  the collection, which is why the enquiry asks the scope question directly.
- **Deliberate omission.** No expert-review survey is included in this submission. If the
  editors decline on the grounds that a purely technical validation is out of scope, the
  fallback is to add an expert-evaluation instrument (a panel of hydraulics/hydrology
  instructors rating physics fidelity and instructional usability) and resubmit — or to
  move to *Computer Applications in Engineering Education* (Wiley, free to publish).
- **APC.** Settled: coupons have covered an MDPI Special Issue for this author before, and
  any shortfall against the CHF 2000 APC will be paid directly. Not a blocker; no need to
  clear it with the Editorial Office in advance.
