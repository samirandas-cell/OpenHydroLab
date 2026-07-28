# Presubmission enquiry — Education Sciences Special Issue

**Target.** *Education Sciences* (MDPI, ISSN 2227-7102), Section "STEM Education",
Special Issue **"The Role of Technology in STEM Education: Opportunities and Challenges"**
<https://www.mdpi.com/journal/education/special_issues/2Z5P5LP271>
Guest Editors: Dr. Kadir Kozan (Florida State University), Dr. Ahmed Ashraf Butt
(University of Oklahoma), Dr. Saira Anwar (Texas A&M University), Dr. Nathaniel Taeho Yu
(James Madison University). Submission deadline **31 December 2026**. APC CHF 2000.

**Route.** The Special Issue page states: "For planned papers, a title and short abstract
(about 250 words) can be sent to the Editorial Office for assessment." Send the message
below to the *Education Sciences* Editorial Office (educsci@mdpi.com), copying the Guest
Editors is not required.

**Status (2026-07-28): optional, not blocking.** Samiran has published in an MDPI Special
Issue with coupons before and accepts both the APC exposure and the scope risk; if the
paper is rejected on scope, the plan is to add the expert-evaluation survey and submit to
*Computer Applications in Engineering Education* (Wiley, SCIE, free to publish). The
enquiry below is therefore kept ready to send but is **not** a gate on drafting the
manuscript. The abstract doubles as the manuscript's working abstract.

---

## Email

**To:** educsci@mdpi.com
**Subject:** Presubmission enquiry — planned paper for the Special Issue "The Role of Technology in STEM Education: Opportunities and Challenges"

Dear Editorial Office,

I am writing to ask whether the planned paper below would be considered in scope for the
Special Issue "The Role of Technology in STEM Education: Opportunities and Challenges"
(Section: STEM Education; Guest Editors Kozan, Butt, Anwar and Yu; deadline 31 December
2026).

The paper is a design-and-technical-validation study of an open-source simulation suite
for undergraduate hydraulics and hydrology. I should be explicit about its scope: it
reports the design rationale and a reproducible verification of the instrument, and makes
no claim about learning outcomes. A classroom evaluation is planned as a separate later
study. I would be grateful to know whether the Guest Editors regard that scope as
appropriate for the Special Issue, particularly under the themes "Design, development, and
integration of technologies in STEM education" and "Systems and processes leading to
technological tools for STEM education".

The software described is already public and citable: the verified release is archived at
https://doi.org/10.5281/zenodo.21635798 under an MIT licence, together with its
verification protocol and the generated validation dataset, so any reviewer can reproduce
the reported figures directly.

The title and a 250-word abstract follow. Thank you for your time.

Yours sincerely,
Dr. Samiran Das
Assistant Professor, Civil Engineering
James Watt School of Engineering, University of Glasgow (Singapore campus)
samiran.das@glasgow.ac.uk · ORCID: 0000-0002-3814-534X

---

## Title

**Verifiable by Construction: Designing and Validating an Open, Offline Simulation Suite
for Undergraduate Hydraulics and Hydrology**

## Abstract (250 words)

Educational simulations are widely used in STEM teaching, yet the numbers they display are
rarely verified in public, and the technology they represent is treated as an artifact
rather than the process that produced it. We report the design and technical
validation of OpenHydroLab, an open-source suite of eight interactive laboratories
covering open-channel hydraulics (channel geometry, Manning uniform flow, specific energy
and choking, hydraulic jumps, gradually varied flow) and engineering hydrology (storm and
unit hydrographs, IDF and frequency analysis). Three design commitments distinguish the
suite: every displayed quantity is computed live from the governing equation rather than
animated to look plausible; each module is a single self-contained page that runs offline
from a local file with no installation and no third-party host, deployable in
low-bandwidth and restricted-network settings; and the governing equations are exposed in
readable source rather than hidden behind a compiled interface.

The central contribution is the verification process itself. Every reference value in our
protocol is derived independently of the code — from a closed-form solution, a
conservation identity, a hand-checkable textbook calculation, or an independent
reimplementation — and tolerances are justified per case rather than widened to pass. The
protocol runs as an automated suite of 405 tests yielding 354 numerical comparisons across
three browser engines, regenerating the reported validation dataset on each run. Applying
it to a mature codebase exposed six defects, including a first-order routing step
documented as exact.

We argue the protocol is transferable to educational simulation generally, and discuss its
trade-offs. No learning-outcome claim is made.

<!-- Word count of the abstract body: 254 (excluding the title). Recheck after any edit. -->

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
