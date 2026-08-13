---
title: "Designed for Verification: Developing and Validating an Open, Offline Simulation Suite for Undergraduate Fluid Mechanics, Hydraulics and Hydrology"
author:
  - name: Samiran Das
    orcid: 0000-0002-3814-534X
    email: samiran.das@glasgow.ac.uk
    affiliation: 1
    corresponding: true
affiliations:
  - index: 1
    name: "James Watt School of Engineering, University of Glasgow (Singapore campus), 1 Punggol Coast Road, Singapore 828608, Singapore"
correspondence: "Correspondence: samiran.das@glasgow.ac.uk"
journal: "Education Sciences"
special_issue: "The Role of Technology in STEM Education: Opportunities and Challenges"
section: "STEM Education"
article_type: "Article"
keywords:
  - engineering education
  - educational simulation
  - fluid mechanics
  - hydraulics
  - hydrology
  - open-channel flow
  - software verification
  - open educational resources
  - offline learning technology
  - reproducibility
date: 12 August 2026
bibliography: paper.bib
---

<!--
  MANUSCRIPT SOURCE NOTE
  Every table and every count in Section 3 is generated from validation/results/ by
  `node tools/manuscript-tables.mjs`. Do not edit anything between BEGIN/END GENERATED
  markers or between <!--G:key--><!--/G--> markers by hand: re-run the generator instead.
  `node tools/manuscript-tables.mjs --check` fails if this file has drifted from the
  validation dataset.
-->

Samiran Das <sup>1,</sup>\*

<sup>1</sup> James Watt School of Engineering, University of Glasgow (Singapore campus),
1 Punggol Coast Road, Singapore 828608, Singapore; samiran.das@glasgow.ac.uk;
ORCID 0000-0002-3814-534X

\* Correspondence: samiran.das@glasgow.ac.uk

## Abstract

**Background/Objectives:** Educational simulations are ubiquitous in STEM teaching, yet the
numbers they display are rarely verified in public, and the process behind them is rarely
reported at all. We report the design and technical validation of OpenHydroLab, an
open-source suite of ten interactive browser laboratories covering fluid statics
(hydrostatic forces on plane and curved surfaces, in two and three dimensions),
open-channel hydraulics (geometry, uniform flow, specific energy, jumps, gradually varied
flow) and engineering hydrology (storm and unit hydrographs, rainfall frequency), and of
the verification protocol built around it. **Methods:** Three design commitments
distinguish the suite: every displayed quantity is computed live from its governing
equation rather than animated to look plausible; each laboratory runs offline from a local
file, with no installation and no third-party host; and the physics is exposed in readable
source. Every reference value is derived independently of the code — from a closed form,
a conservation identity, a textbook calculation or an independent reimplementation — and
every tolerance is justified case by case, never widened to pass. **Results:** The protocol yields
<!--G:comparisons-->591<!--/G--> numerical comparisons and
<!--G:software-runs-->324<!--/G--> software, offline and accessibility test executions
across <!--G:engines-->3<!--/G--> browser engines, and regenerates that dataset on every
run. Applying it to a codebase believed correct exposed six defects, including a routing
step documented as exact that was not; a seventh — a force computed correctly in every
number and drawn on the wrong side of the surface — passed every numerical check and was
found by eye, prompting a class of test that measures the drawn geometry itself.
**Conclusions:** The verification process, not the artifact, is the transferable result:
it makes what a simulation displays a public, reproducible fact rather than an assurance.
No learning-outcome claim is made.

**Keywords:** engineering education; educational simulation; fluid mechanics; hydraulics;
hydrology; open-channel flow; software verification; open educational resources; offline
learning technology; reproducibility

## 1. Introduction

Interactive simulation is now an unremarkable part of undergraduate STEM teaching. In
physics and chemistry, freely available simulation suites have been used and studied for
two decades [@wieman2008phet; @wieman2010teaching], and the broader literature on
computer simulation in science education is large enough to support meta-analysis
[@rutten2012learning]. Comparative reviews of physical, virtual and remote laboratories
find that virtual instruments can serve purposes that physical ones cannot, and vice
versa [@dejong2013physical; @manickerson2006handson]; controlled comparisons in
introductory physics have gone further, finding that a simulation substituted for the
laboratory equipment it represents can outperform the equipment on both conceptual and
apparatus-handling measures [@finkelstein2005when], while the engineering-education
literature has long argued that laboratory work carries objectives distinct from those of
lectures [@feisel2005role].

Open-channel hydraulics and engineering hydrology sit awkwardly in this landscape. They
are core subjects in every civil engineering degree, and they are rich in documented
conceptual difficulty: whether a surface wave can carry information upstream; why one
value of specific energy admits two depths; why the water surface falls over a hump;
why momentum, not energy, is conserved across a hydraulic jump; why a backwater curve is
controlled from downstream. These are precisely the ideas that a well-built simulation
should be able to make visible. Yet the resources available to an instructor fall into
three groups, none of which is satisfactory for teaching. Static textbook figures cannot
be interrogated. Professional design software such as HEC-RAS [@hecras] is built for
production computation, and its interface and defaults encode design workflow rather than
conceptual exposure. Scattered web applets are interactive but opaque: their governing
equations are not readable, their numerical behaviour is not documented, and nothing about
them can be checked.

The gap this paper addresses is narrower and, we argue, more consequential than a missing
artifact. It is a missing *process*. A simulation used in teaching makes a tacit claim
every time it puts a number on screen — that the number follows from the physics the
lecture just derived. That claim is almost never substantiated in public. Educational
software is typically reported through its features and its reception, not through
evidence that its arithmetic is right; the verification-and-validation practices that are
routine in computational science [@roache1998verification; @oberkampf2002verification;
@oberkampf2010verification] and the reproducibility practices that have become standard
in computational research [@peng2011reproducible; @wilson2014best; @wilson2017good] have
no established counterpart in the educational-simulation literature. A student who
compares a hand calculation with a simulation and finds a discrepancy has no way to tell
which is wrong, and neither, usually, does the instructor.

This paper reports a design-and-technical-validation study of OpenHydroLab, a suite of
ten interactive browser laboratories for undergraduate fluid mechanics, hydraulics and
hydrology, and of the verification protocol built around it. The contribution is threefold:

1. **A design.** Three commitments — live computation from the governing equation,
   offline self-containment, and readable exposure of the physics — and the specific
   architectural consequences each one forces, several of which are counter-intuitive and
   were arrived at only by making the opposite choice first.
2. **A verification protocol.** A statement of what must be true of a reference value
   before it can be used to check an educational simulation, of how tolerances are set,
   and of what an automated suite must exercise beyond numerical agreement — offline
   operation, the `file://` protocol, accessibility, and cross-engine consistency.
3. **Evidence from applying it.** A generated validation dataset covering
   <!--G:comparisons-->591<!--/G--> comparisons on
   <!--G:modules-->10<!--/G--> laboratories, and an account of seven defects in code that
   had already been used in teaching and reviewed by its author — six the protocol exposed,
   and one it could not, which marks the boundary of what numerical verification sees.

We state the scope limit at the outset and repeat it where it matters. This study
establishes computational fidelity, reproducibility and adoption readiness. It says
nothing about learning. No claim about conceptual understanding, engagement or attainment
is made or tested here; establishing such a claim requires a classroom study with human
participants, which is planned as a separate investigation and described in Section 4.5.
The distinction matters for the present paper because the two questions have different
evidence standards, and conflating them is how educational software comes to be adopted on
the strength of enthusiasm rather than correctness.

The remainder of the paper is organised as follows. Section 2 describes the suite, the
design commitments behind it, its intended instructional use, and the verification
protocol in full. Section 3 reports the results of applying that protocol. Section 4
discusses what the protocol does and does not establish, its transferability to
educational simulation beyond hydraulics, its costs, and the planned evaluation.
Section 5 concludes.

## 2. Materials and Methods

### 2.1. The suite

OpenHydroLab comprises ten laboratories, each a web page that runs in any current
browser. Eight are a single self-contained HTML file; the two that render in 3D ship
alongside a vendored copy of a 3D rendering library. Table 1 lists them with the concepts
each is built to expose. The suite is released under the MIT licence, and the release described
and verified here is archived with a persistent identifier (Section 6).

**Table 1.** The ten laboratories and the concepts each is designed to expose. The
"conceptual target" column states the design intent of the module; it is not a claim about
what students in fact learn, which this study does not test.

| Laboratory | Domain | Physics computed live | Conceptual target |
|---|---|---|---|
| `hydrostatic_forces` | Fluid statics | Resultant and centre of pressure on a plane surface at any inclination on one continuous θ slider, with the depth shift written *I*~xc~ sin θ/(*h*~c~*A*) so the θ → 0 singularity is removed while *y*~c~ = *h*~c~/sin θ is still shown running off to infinity; curved surfaces decomposed into *F*~x~ on the vertical projection and *F*~v~ = γ*V*; a step-by-step worked solution generated from the current slider values | The resultant as the *volume* of the pressure prism and the centre of pressure as its centroid — one statement covering horizontal, inclined and vertical surfaces, rather than three memorised formulae |
| `hydrostatic_forces_3d` | Fluid statics | The pressure prism as an orbitable solid; *A*, *ȳ* and *I*~xc~ re-derived by integration from each of four plate shapes' own chord width and compared on screen with the standard property table; radial traction on a circular arc and the resulting zero moment about the centre of curvature | That the tabulated section properties are derived quantities rather than givens, and why a Tainter gate carries no hydrostatic moment on its pivot at any head |
| `channel_geometry` | Hydraulics | Geometry elements *A*, *P*, *R*, *T*, *D* for four section shapes; velocity-profile models with α and β by numerical integration; Reynolds and Froude classification; plan-view wave propagation at *c* = √(*gD*) advected at *V* | The Froude number as a ratio of information speeds — whether a surface wave can travel upstream — rather than as a formula |
| `specific_energy` | Hydraulics | *E*–*y* curve with exact subcritical and supercritical branch roots; sluice-gate alternate depths; flow over a hump including choking past Δ*z*~crit~ | Why one specific energy admits two depths, why the surface *falls* over a hump, and what choking does to the upstream level |
| `hydraulic_jump` | Hydraulics | Bélanger sequent depths; specific force *M*–*y* and specific energy *E*–*y* on a shared depth axis; energy loss by two independent routes; jump classification, efficiency and length against Fr~1~ | Why momentum is conserved across a jump while energy is not, and the difference between alternate and sequent depths |
| `manning_uniform_flow` | Hydraulics | Manning uniform flow; a lumped continuity–momentum relaxation onto normal depth; normal and critical depth solvers; *y*~n~(*S*~0~) with the critical slope marked; best hydraulic section | Normal depth as an *attractor* the flow finds by itself, and the origin of the mild/steep classification |
| `gvf_profiles` | Hydraulics | RK4 integration of d*y*/d*x* = (*S*~0~ − *S*~f~)/(1 − Fr²) from a control section, with a linked phase portrait; all twelve profile families; the direct-step method drawn as a converging staircase | The twelve classical profiles as solution families of one ODE, with *y*~n~ its numerator's zero and *y*~c~ its denominator's pole |
| `storm_hydrograph` | Hydrology | φ-index loss separation; Nash-cascade routing with an exact exponential step; travel-time sampling from the instantaneous unit hydrograph; baseflow separation; mass balance | The hydrograph as the arrival-time distribution of the rain, rather than as a curve with named limbs |
| `unit_hydrograph` | Hydrology | One gamma instantaneous unit hydrograph underlying three modes: derivation from an observed storm, convolution, and duration change by S-curve and by superposition | The catchment as a linear time-invariant system, making identification, convolution and step response one idea rather than three recipes |
| `idf_frequency` | Hydrology | Sliding-window annual-maximum extraction from an embedded 27-year hourly gauge record; Gumbel (EV1) fit by method of moments; the IDF family and a fitted Sherman equation; the rational-method bridge | The complete path from raw gauge data to a design discharge, including why the design storm lasts exactly the time of concentration |

The hydrological modules rest on the classical unit-hydrograph and linear-reservoir theory
of Sherman [@sherman1932streamflow], Nash [@nash1957form] and Dooge
[@dooge1959general], the frequency analysis on Gumbel [@gumbel1958statistics] and the
rational-method bridge on Kirpich's time of concentration [@kirpich1940time]. The
hydraulics modules follow Chow [@chow1959], Henderson [@henderson1966open] and Chaudhry
[@chaudhry2008open]; the sequent-depth relation is Bélanger's, whose history is set out by
Chanson [@chanson2009development], and the uniform-flow resistance relation is Manning's
[@manning1891flow].

### 2.2. Design commitments and their architectural consequences

Three commitments govern the design. Each has consequences that are not obvious in
advance, and in two of the three cases the correct architecture became clear only after
the opposite choice had been made and had failed.

#### 2.2.1. Every displayed quantity is computed from its governing equation

No quantity on screen is interpolated, tabulated, tuned to look right, or animated
independently of the physics. When a slider moves, the governing equation is re-solved and
the drawing follows from its solution. Where a module solves an equation iteratively — for
normal depth, critical depth, alternate depths, sequent depths — it does so with a
bracketed bisection to a stated convergence, not with a fitted approximation.

The commitment has a strong corollary: it must be *checkable*, which means the physics has
to be reachable from outside the page. This forced an architectural decision that runs
against current JavaScript practice. Code inside an ES module is sealed in module scope,
and a browser-driving test can then observe it only through what the page prints on screen.
Display rounding truncates that evidence to roughly three significant figures, so a test
written against the interface can establish agreement to about 10⁻³ and no further. Placing
the physics in a classic script instead puts its top-level bindings in the global scope,
where an automated test can call the model functions directly and compare at double
precision — a difference of some nine orders of magnitude in the strength of the available
evidence. Every laboratory therefore keeps its physics in a classic script and its
rendering in whatever the rendering needs. The two modules with a 3D scene are split
accordingly: physics in the global scope, rendering as a module.

#### 2.2.2. Offline, self-contained, and free of third-party hosts

Each laboratory must initialise and run with no network connection, from a file on a USB
stick or a virtual learning environment, with nothing installed. This rules out content
delivery networks, analytics, web fonts and remote data. The 27-year rain-gauge record
used by the frequency laboratory is embedded in the page rather than fetched. The single
external library the suite uses — a 3D renderer — is vendored into the repository with its
provenance recorded.

The consequence that only testing revealed concerns the delivery protocol. Vendoring the
library as an ES module passed every check performed over a local HTTP server, and left a
blank page for anyone who double-clicked the file, because browsers refuse ES-module
imports from a `file://` origin under the same-origin policy while permitting them over
`http://`. Serving over `http://localhost` is therefore not a conservative approximation
of a student opening a file: it is a materially more permissive environment. The library
was converted to classic scripts, and a dedicated test now loads every laboratory straight
from disk with no server at all (Section 2.5). The rule this produced — that the protocol
students actually use must be the protocol under test — generalises well beyond this suite.

#### 2.2.3. The physics is exposed, not hidden

The governing equations are written in readable source in the page a student can open, and
each laboratory has a written guide in the repository stating its theory, its assumptions
and its limitations. Several modules also display live self-checks: a momentum residual
|*M*~1~ − *M*~2~|/*M*~1~ across a jump, a head-consistency residual over a hump, an
energy-consistency ratio along a gradually varied profile, a mass-balance closure on a
storm hydrograph, the ratio of a quadrature of ∮*p* d*A* to γ*h*~c~*A* on a submerged
plane, and each plate shape's integrated section properties beside their tabulated values.
These are computed and displayed every frame, so a student watching a
module is also watching its conservation laws hold. This is a pedagogical device and a
debugging device at once, and the same identities appear in the offline verification suite
as swept invariants (Section 3.3).

### 2.3. Intended instructional use

The suite is designed for three modes of use, which are stated here as design intent.
Whether they achieve their aims is exactly the question this study does not address.

- **Lecture demonstration.** The instructor projects a laboratory and varies parameters
  while deriving the theory at the board, so the derivation and its consequences appear
  together. The modules carry one-click presets that reproduce standard worked examples,
  which allows a demonstration to begin from a case the class already has in its notes.
- **Pre-laboratory or pre-tutorial preparation.** Because each laboratory reproduces
  worked textbook examples, a student can check a hand calculation against it before a
  session and arrive with a specific question rather than a blank page.
- **Independent exploration.** A student sweeps a parameter and observes what the
  governing equation does — lengthening a storm and watching the unit hydrograph respond,
  raising a hump until the flow chokes, steepening a bed until normal depth crosses
  critical.

The instructional-design rationale behind each module is a *conceptual-obstacle* one: each
laboratory targets a specific place where the standard treatment is known, from teaching
experience and from the subject's textbook literature, to leave students able to execute a
calculation without being able to explain it. The `unit_hydrograph` module is the clearest
case. Unit-hydrograph theory is conventionally taught as three separate procedures —
derive, apply, change duration — and students routinely complete all three without
noticing that they are one idea. The module computes all three modes from a single
underlying response function, so they are exactly consistent by construction, and displays
the pipeline (effective rainfall → catchment response → streamflow) above the chart with
the link each mode exercises highlighted. Similarly, `gvf_profiles` presents the twelve
classical profiles as one ODE's solution families rather than as a table to memorise, and
`channel_geometry` presents the Froude number as a question about whether a wave can
travel upstream rather than as a quotient to evaluate.

Two accessibility properties are treated as instructional-design requirements rather than
compliance items, since a control that cannot be operated is not available for teaching:
every interactive control carries an accessible name, and every slider is operable from
the keyboard with the on-screen readout updating as it moves [@wcag21]. Both are verified
automatically (Section 2.5).

### 2.4. The verification protocol: numerical comparisons

The protocol is stated in full in the archived repository
(`validation/validation-protocol.md`) and summarised here. Its purpose is to make the
correctness of what a laboratory displays a public, reproducible fact rather than an
assurance.

#### 2.4.1. The reference must be derived independently of the code

A test that recomputes a module's own arithmetic and compares the result with itself
proves nothing; it will pass with equal enthusiasm whether the physics is right or wrong.
Every reference value in the protocol comes from one of four sources, and the derivation
is recorded with the result and published alongside it:

- a **closed-form analytical solution** — the Bélanger sequent-depth ratio; the Nash
  cascade response to a rectangular hyetograph; the analytic α and β of a stated velocity
  profile;
- a **conservation identity** — specific force across a jump; unit volume under a unit
  hydrograph; the energy consistency d*E*/d*x* = *S*~0~ − *S*~f~ along a gradually varied
  profile;
- a **hand-checkable textbook calculation** — Chow's geometry tables [@chow1959] for four
  section shapes; Manning discharge in a rectangular channel at a stated depth;
- an **independent reimplementation in the test harness** — a Gumbel method-of-moments fit
  recomputed in the test runtime from the published annual maxima, and an independent
  bisection for normal depth.

Where a module solves an equation by iteration, the protocol prefers a **round trip**:
compute the input from a known answer using an independent implementation, feed it back to
the module, and require the original answer to return.

#### 2.4.2. Two independent routes to one number

Where a quantity is reachable by two different derivations, both are computed and required
to agree. These are the strongest tests in the suite, because they fail if *either* route
is wrong, and they do not depend on any external reference at all. Eight are used: the
hydrostatic resultant and centre of pressure on a plane surface by quadrature of ∮*p* d*A*
and from γ*h*~c~*A* with the trapezoidal-prism centroid; the components on a curved surface
by quadrature of the radial traction and from the vertical projection and the prism weight;
the second moment *I*~xc~ of each of four plate shapes by integrating the shape's own chord
width and from the standard property table; the energy loss across a jump as
*E*~1~ − *E*~2~ and as (*y*~2~ − *y*~1~)³/(4*y*~1~*y*~2~); a duration-changed unit
hydrograph by S-curve lag-and-subtract and by superposition of lagged unit hydrographs; a
gradually varied reach length by RK4 marching and by the direct-step method; the
rational-method discharge from its engineering form and from base SI units; and the
velocity-distribution coefficient α by numerical integration and from the closed form
printed beside it.

#### 2.4.3. The drawing is measured, not only the numbers

A simulation makes two assertions: one in the numbers it reports, and one in the picture it
draws. They can disagree, and a protocol that samples only the first cannot see it — a
failure mode we did not anticipate and met in practice (Section 3.5). Where a drawn element
carries a physical claim rather than decorating one, its geometry is therefore recorded and
compared like any other quantity: each arrow in a 3D scene retains the line segment it was
constructed from, and the 2D modules publish the equivalent through a documented global.

The independence requirement of Section 2.4.1 applies here with particular force, because
the tempting test is the circular one. A check that recomputes where an arrow *ought* to
start and end, using the same expression the renderer used, is self-comparison and will
confirm a mis-drawn figure as readily as a correct one. The cases assert instead against
the endpoints the renderer actually produced, and against an independently stated
geometric property: that the resultant on a circular arc passes through the centre of
curvature, that a plane resultant is normal to its plate, that an arrowhead lies on the
centre of pressure, and that an arrow's tail stands off on the wetted side — the last
signed, since an unsigned standoff cannot distinguish the two faces.

#### 2.4.4. Behaviour, not only values

Some of the claims teaching rests on are orderings rather than numbers, and are tested as
such: urbanisation must raise and advance the storm peak; jump dissipation must increase
with the approach Froude number; rainfall intensity must fall with duration and rise with
return period; a mild slope must give *y*~n~ > *y*~c~. These carry no tolerance. They
either hold across the swept range or they do not.

#### 2.4.5. Sweeps, not spot checks

Conservation is not a property of one fortunate parameter set. Volume closure, the
momentum residual, the specific-energy identity, normal-depth inversion and the vanishing
of the hydrostatic moment about a centre of curvature are each swept across the modules'
control ranges — 99 storm parameter sets, 64 channel states, 21 jump states, 81
normal-depth states, 48 curved-gate states in each of the two hydrostatic laboratories, 32
plate submergences, 9 sluice-gate settings — and the **worst** error over the sweep is
what is recorded. A sweep that reported its mean would hide exactly the parameter corner
where a model fails.

#### 2.4.6. Tolerances are justified per case, never widened to pass

Each comparison carries its own tolerance, set by what the numerics can honestly deliver
and recorded with the case (Table 2).

**Table 2.** Tolerance policy. Each class states the bound applied and the reason it cannot
be tightened; the observed error against each bound is reported in Table 4.

| Class of comparison | Tolerance | Justification |
|---|---|---|
| Closed-form identity, no integration | 10⁻⁹ relative or tighter | limited only by double-precision arithmetic |
| Bisection-solved root | 10⁻⁶ relative | 60–80 bisection iterations on a bracketed root |
| Fixed-step integration (unit volume, GVF energy integral, storm volume closure) | 10⁻³ – 5 × 10⁻³ | Δ*t* or Δ*y* truncation of the quadrature |
| Quantity read from a rendered readout | half a unit in the last displayed digit | the module rounds for display; a comparison cannot beat what is shown |
| Empirical curve fit (Sherman IDF surface) | 10% RMSE, 25% worst point, both relative to the mean intensity being fitted | a four-parameter surface cannot interpolate 36 quantiles exactly |
| Comparison against a reference that is itself rounded | the rounding bound of the published value | the archived annual-maximum table is given to four decimals; no comparison against it can be tighter |

Four groups of cases sit well above machine precision, and in each the reason is a
property of the mathematics or of the reference rather than a defect: the 1/7-power
velocity profile, whose unbounded derivative at the bed voids the O(*h*⁴) error bound of
Simpson's rule and reduces convergence to about O(*h*^8/7^); the fixed-step integrals,
whose residual shrinks under refinement; the Sherman fit; and the annual-maximum
extraction, which is compared against a table published to four decimals and so cannot be
checked more tightly than 5 × 10⁻⁵. Each is documented in the protocol with the
mathematics that limits it. A tolerance is never widened to make a test pass without recording the
reason in the case record, and the published dataset carries every tolerance alongside its
observed error so that the policy can be audited rather than trusted.

#### 2.4.7. Retry policy

The physics suite runs with retries disabled. A retry there would convert a real numerical
failure into an intermittent one and hide it. The interaction tests, which drive a browser
and depend on headless graphics, are permitted two retries, because their flakiness is a
property of the harness rather than of the model.

### 2.5. The verification protocol: software, offline operation and accessibility

Numerical agreement is necessary and not sufficient. A laboratory that computes correctly
and renders a blank canvas, or that works on the developer's machine and not on a
student's, has failed at the only thing it was built for. The protocol therefore runs the
following checks on every laboratory, on all <!--G:engines-->3<!--/G--> browser engines
(<!--G:engine-names-->chromium, firefox, webkit<!--/G-->):

- **Clean load and live rendering** — no console errors, no uncaught exceptions, no failed
  requests; and the canvas has real dimensions with animation frames actually being
  driven. A blank canvas is the commonest silent failure in a graphical page and raises no
  error of its own.
- **Self-containment** — no laboratory may request anything outside its own origin,
  checked both at run time and by scanning the source for third-party hosts. This is what
  makes the offline claim testable rather than asserted.
- **Offline operation** — every external host is blocked and each laboratory must still
  initialise: the honest simulation of a student with no connection.
- **The `file://` protocol** — every laboratory is additionally loaded straight from disk
  with no server at all, and must initialise, render and animate as it does over HTTP. This
  duplicates the checks above deliberately, for the reason given in Section 2.2.2.
- **Accessibility** — every interactive control has an accessible name; range sliders
  respond to arrow keys with their readouts updating; focus order reaches the controls by
  Tab alone; and no layout overflows horizontally at 1920 × 1080, 1366 × 768 or
  1024 × 768.
- **Label layout in the 3D scenes** — labels hold a fixed pixel size while the
  geometry they annotate changes by orders of magnitude, so hand-tuned label offsets
  collapse silently at the extremes of the control range. Label separation is measured
  rather than eyeballed.
- **Link integrity and documentation coverage** — every internal link on the landing page
  resolves, and every laboratory has a written guide.

### 2.6. Reproducibility of the reported results

The test run writes a machine-readable validation dataset to `validation/results/`: one
record per comparison per engine, carrying the reference value, the observed value, the
absolute and relative error, the tolerance, the derivation used and the pass status; the
same content as tables; and a per-engine matrix for the software checks. Every table and
every count in Section 3 of this paper is generated from those files by a script in the
repository (`tools/manuscript-tables.mjs`) and injected into the manuscript source between
markers; a `--check` mode fails if the manuscript has drifted from the dataset. No result
in this paper is transcribed by hand, which removes the commonest way for a reported figure
to become quietly untrue as software changes. Readers can regenerate the entire dataset,
and hence every table below, by running the test suite against the archived release, with
the one qualification recorded in Section 6. Software-citation practice follows Smith et
al. [@smith2016software].

## 3. Results

All results below are from the validation run of <!--G:run-date-->2026-08-12<!--/G-->
against the archived release, with overall status
**<!--G:run-status-->passed<!--/G-->**.

### 3.1. Numerical verification

The suite records <!--G:comparisons-->591<!--/G--> numerical comparisons —
<!--G:cases-->197<!--/G--> distinct verification cases evaluated on each of
<!--G:engines-->3<!--/G--> browser engines — across <!--G:modules-->10<!--/G-->
laboratories, with <!--G:failures-->0<!--/G--> failing. Table 3 summarises them by
laboratory. Errors are the worst observed across engines, and each case is judged against
its own tolerance.

**Table 3.** Numerical verification by laboratory. "Verification cases" counts distinct
comparisons; each is evaluated on every engine. Errors are relative where the case carries
a relative tolerance and absolute otherwise, and are the worst observed across engines.

<!-- BEGIN GENERATED table:module-summary -->
| Laboratory | Verification cases | Comparisons (× 3 engines) | Tolerance band | Worst error | Passing |
|---|---|---|---|---|---|
| `hydrostatic_forces` | 39 | 117 | 1 × 10^−15^ – 1 × 10^−6^ | 8.8 × 10^−9^ | 117/117 |
| `hydrostatic_forces_3d` | 40 | 120 | 1 × 10^−15^ – 0.0005 | 3.1 × 10^−5^ | 120/120 |
| `channel_geometry` | 44 | 132 | 1 × 10^−12^ – 0.005 | 4.0 × 10^−3^ | 132/132 |
| `specific_energy` | 10 | 30 | 1 × 10^−9^ – 1 × 10^−6^ | < 10^−15^ | 30/30 |
| `hydraulic_jump` | 8 | 24 | 1 × 10^−9^ – 1 × 10^−8^ | 4.2 × 10^−15^ | 24/24 |
| `manning_uniform_flow` | 17 | 51 | 1 × 10^−9^ – 1 × 10^−6^ | < 10^−15^ | 51/51 |
| `gvf_profiles` | 10 | 30 | 1 × 10^−9^ – 0.02 | 1.0 × 10^−4^ | 30/30 |
| `storm_hydrograph` | 9 | 27 | 1 × 10^−9^ – 0.005 | 4.1 × 10^−3^ | 27/27 |
| `unit_hydrograph` | 9 | 27 | 1 × 10^−9^ – 0.005 | 2.6 × 10^−14^ | 27/27 |
| `idf_frequency` | 11 | 33 | 1 × 10^−12^ – 0.25 | 1.2 × 10^−1^ | 33/33 |
| **All modules** | **197** | **591** | — | **1.2 × 10^−1^** | **591/591** |
<!-- END GENERATED -->

Table 4 groups the comparisons by the tolerance they are held to. The informative column
is the last: the worst error observed in each group as a percentage of what that group is
allowed. It is the column that exposes a tolerance policy fitted to the software's
behaviour rather than to the mathematics, because a suite whose cases routinely consume
most of their allowance is a suite whose limits were chosen after the fact.

The pattern here is the one the policy predicts. Of the
<!--G:tight-cases-->127<!--/G--> cases held to 10⁻⁹ or tighter — the closed-form identities
and conservation laws, where nothing but double-precision arithmetic stands between the
module and its reference — <!--G:exact-cases-->127<!--/G--> agree with their independent
reference to better than 10⁻¹², using under a thousandth of a percent of their allowance.
Every group that consumes an appreciable fraction of its tolerance is one whose limit was
set by a stated property of the mathematics or of the reference, not by the code: fixed-step
integration (the storm volume closure, <!--G:worst-used-case-->SH-08<!--/G-->, at
<!--G:worst-used-pct-->82%<!--/G--> of its 5 × 10⁻³ allowance — the worst single case in the
run); the 1/7-power velocity profile against Simpson's rule, whose unbounded derivative at
the bed voids the O(*h*⁴) bound (56% of 5 × 10⁻⁴); the empirical Sherman surface (39% and
46% of its RMSE and worst-point allowances); and the annual-maximum extraction, at 31% of a
5 × 10⁻⁵ allowance that is itself the rounding bound of the published reference table, which
is given to four decimals. No group whose tolerance is set by arithmetic alone uses more
than a thousandth of a percent of it.

**Table 4.** Comparisons grouped by tolerance, with the worst observed error in each group
and that error as a percentage of the tolerance allowed.

<!-- BEGIN GENERATED table:tolerance-classes -->
| Tolerance | Cases | Comparisons | Worst error observed | Worst error as % of tolerance |
|---|---|---|---|---|
| rel. ≤ 1 × 10^−15^ | 5 | 15 | 0 | 0 |
| abs. ≤ 1 × 10^−12^ | 12 | 36 | 1.3 × 10^−15^ | 0.13% |
| rel. ≤ 1 × 10^−12^ | 71 | 213 | < 10^−15^ | 0.031% |
| abs. ≤ 1 × 10^−9^ | 10 | 30 | < 10^−15^ | < 0.001% |
| rel. ≤ 1 × 10^−9^ | 29 | 87 | < 10^−15^ | < 0.001% |
| abs. ≤ 1 × 10^−8^ | 1 | 3 | 4.2 × 10^−15^ | < 0.001% |
| rel. ≤ 1 × 10^−8^ | 1 | 3 | < 10^−15^ | < 0.001% |
| abs. ≤ 1 × 10^−6^ | 7 | 21 | 1.4 × 10^−14^ | < 0.001% |
| rel. ≤ 1 × 10^−6^ | 30 | 90 | 9.9 × 10^−8^ | 9.9% |
| abs. ≤ 5 × 10^−5^ | 1 | 3 | 1.6 × 10^−5^ | 31% |
| abs. ≤ 0.0005 | 6 | 18 | 2.8 × 10^−4^ | 56% |
| rel. ≤ 0.0005 | 1 | 3 | 3.1 × 10^−5^ | 6.2% |
| abs. ≤ 0.0015 | 2 | 6 | 0 | 0 |
| abs. ≤ 0.002 | 1 | 3 | 2.6 × 10^−14^ | < 0.001% |
| rel. ≤ 0.002 | 4 | 12 | 1.0 × 10^−6^ | 0.052% |
| abs. ≤ 0.005 | 7 | 21 | 4.1 × 10^−3^ | 82% |
| rel. ≤ 0.005 | 6 | 18 | 1.0 × 10^−4^ | 2.1% |
| rel. ≤ 0.02 | 1 | 3 | 1.6 × 10^−6^ | 0.0081% |
| abs. ≤ 0.1 | 1 | 3 | 3.9 × 10^−2^ | 39% |
| abs. ≤ 0.25 | 1 | 3 | 1.2 × 10^−1^ | 46% |
<!-- END GENERATED -->

### 3.2. Two independent routes to one number

Table 5 reports the cross-validation cases of Section 2.4.2, in which a quantity is
computed by two independent derivations and the results required to agree. These carry no
external reference and cannot be satisfied by a coincidence of implementation: they fail
if either route is wrong. The first eight rows are the live self-checks described in
Section 2.2.3 — the ratios a statics laboratory displays on screen while a student watches
its quadrature reproduce the closed form. A displayed self-check is an assurance until
something checks it, so the protocol treats those ratios as cases like any other.

**Table 5.** Quantities computed by two independent routes and required to agree.

<!-- BEGIN GENERATED table:two-routes -->
| Case | Laboratory | Quantity | Reference | OpenHydroLab | Error | Tolerance |
|---|---|---|---|---|---|---|
| `plane-selfcheck-F` | `hydrostatic_forces` | ∮p dA ÷ γh_cA | 1 | 1 | < 10^−15^ | rel. ≤ 1 × 10^−6^ |
| `plane-selfcheck-CP` | `hydrostatic_forces` | ∮s p dA / ∮p dA ÷ s_R | 1 | 1 | 8.8 × 10^−9^ | rel. ≤ 1 × 10^−6^ |
| `curved-selfcheck-Fx` | `hydrostatic_forces` | ∮p n_x dA ÷ γh_cA_proj | 1 | 1 | 8.2 × 10^−9^ | rel. ≤ 1 × 10^−6^ |
| `curved-selfcheck-Fv` | `hydrostatic_forces` | ∮p n_z dA ÷ γV | 1 | 1 | 3.7 × 10^−9^ | rel. ≤ 1 × 10^−6^ |
| `shape-rect-selfcheck-I` | `hydrostatic_forces_3d` | second moment from ∫w dt ÷ table | 1 | 1 | 6.3 × 10^−8^ | rel. ≤ 1 × 10^−6^ |
| `shape-tri-selfcheck-I` | `hydrostatic_forces_3d` | second moment from ∫w dt ÷ table | 1 | 1 | 3.1 × 10^−8^ | rel. ≤ 1 × 10^−6^ |
| `shape-circ-selfcheck-I` | `hydrostatic_forces_3d` | second moment from ∫w dt ÷ table | 1 | 1 | 1.3 × 10^−15^ | rel. ≤ 1 × 10^−6^ |
| `shape-semi-selfcheck-I` | `hydrostatic_forces_3d` | second moment from ∫w dt ÷ table | 1 | 1 | 9.9 × 10^−8^ | rel. ≤ 1 × 10^−6^ |
| `HJ-04` | `hydraulic_jump` | Energy loss, momentum closed form | 0.132467 m | 0.132467 m | 0 | rel. ≤ 1 × 10^−9^ |
| `HJ-08` | `hydraulic_jump` | Worst energy-route disagreement over 21 states | 0 | 4.18 × 10^−15^ | 4.2 × 10^−15^ | abs. ≤ 1 × 10^−8^ |
| `UH-06.24` | `unit_hydrograph` | S-curve vs superposition, D' = 24 h | 0 m³/s | 7.11 × 10^−15^ m³/s | 7.1 × 10^−15^ | abs. ≤ 1 × 10^−6^ |
| `GV-08` | `gvf_profiles` | Direct step vs RK4 reach length | 1693.54 m | 1693.54 m | 1.6 × 10^−6^ | rel. ≤ 0.02 |
| `ID-10` | `idf_frequency` | Rational Method via base SI units | 16.5958 m³/s | 16.5958 m³/s | 0 | rel. ≤ 1 × 10^−12^ |
| `CG-19` | `channel_geometry` | α: displayed numeric vs displayed analytic | 1.045 | 1.045 | 0 | abs. ≤ 0.0015 |
<!-- END GENERATED -->

The derivations behind these cases, as recorded in the dataset, are:

<!-- BEGIN GENERATED list:two-routes-derivations -->
- **plane-selfcheck-F** — midpoint quadrature of ∮p dA over 4000 strips against γh_cA
- **plane-selfcheck-CP** — first moment of the same quadrature against y_c + I_xc/(y_cA)
- **curved-selfcheck-Fx** — quadrature of the radial traction over 4000 arc elements
- **curved-selfcheck-Fv** — the same quadrature, vertical component, against the prism weight
- **shape-rect-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-tri-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-circ-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **shape-semi-selfcheck-I** — the module integrates the shape's own chord width w(t) and compares with the table value; the substitution used for the circular shapes makes the integrand smooth, so this must hold to ~1e-8
- **HJ-04** — h_L = (y₂ − y₁)³/(4y₁y₂) must equal E₁ − E₂
- **HJ-08** — |(E₁−E₂) − (y₂−y₁)³/(4y₁y₂)| / h_L across the same grid (worst at {"y1":0.01,"Fr":1.5})
- **UH-06.24** — max |UH from S-curve − UH from averaging 4 lagged 6-h UHs| over 0–140 h
- **GV-08** — the converged direct-step length must match the RK4-integrated profile length
- **ID-10** — C·(i/1000/3600 m/s)·(A×10⁶ m²) must equal C·i·A/3.6
- **CG-19** — α by numerical integration must match the closed form printed beside it
<!-- END GENERATED -->

### 3.3. Invariants across swept parameter ranges

Table 6 reports the swept invariants of Section 2.4.5. Each row is the **worst** residual
over an entire parameter sweep, not a representative one — the value at the least
favourable corner of the module's control range.

**Table 6.** Invariants swept across the laboratories' control ranges — conservation
identities, and the scaling and equilibrium properties the statics laboratories rest on.
Each error is the worst over the whole sweep.

<!-- BEGIN GENERATED table:invariants -->
| Case | Laboratory | Quantity | Reference | OpenHydroLab | Error | Tolerance |
|---|---|---|---|---|---|---|
| `plane-dy-invariant-sweep` | `hydrostatic_forces` | Worst drift in Δy·h_c over 32 depths | 0 | 2.31 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−12^ |
| `curved-zero-moment-sweep` | `hydrostatic_forces` | Worst pivot-moment residual over 48 arc states | 0 | 6.24 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−12^ |
| `gate3d-zero-moment-sweep` | `hydrostatic_forces_3d` | Worst pivot-axis moment residual over 48 gate states | 0 | 9.27 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−12^ |
| `CG-08` | `channel_geometry` | Worst Froude-number error over 64 states | 0 | 0 | 0 | abs. ≤ 1 × 10^−12^ |
| `MN-09` | `manning_uniform_flow` | Worst normal-depth round-trip error over 81 states | 0 | 2.96 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−6^ |
| `SE-06` | `specific_energy` | Worst \|E₁ − E₂\|/E₁ across 9 gate settings | 0 | 3.25 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−9^ |
| `HJ-07` | `hydraulic_jump` | Worst momentum residual over 21 states | 0 | 2.09 × 10^−16^ | < 10^−15^ | abs. ≤ 1 × 10^−9^ |
| `SH-08` | `storm_hydrograph` | Worst volume-closure error over 99 parameter sets | 0 | 0.00408709 | 4.1 × 10^−3^ | abs. ≤ 0.005 |
| `UH-03` | `unit_hydrograph` | Worst unit-volume error over 9 durations | 0 cm | 2.63 × 10^−14^ cm | 2.6 × 10^−14^ | abs. ≤ 0.002 |
| `GV-06.M1` | `gvf_profiles` | ∫(S₀ − S_f)dx ÷ ΔE, M1 backwater | 1 | 1.00001 | 1.3 × 10^−5^ | rel. ≤ 0.005 |
<!-- END GENERATED -->

The sweeps and identities behind these cases are:

<!-- BEGIN GENERATED list:invariant-derivations -->
- **plane-dy-invariant-sweep** — Δy·h_c = I_xc sinθ/A is independent of submergence; held against the shallow reference at each geometry for θ ∈ {15, 40, 65, 90}° × L ∈ {1.2, 3.4} m × h_top ∈ {2, 8, 25, 100} m (worst at {"theta":90,"L":1.2,"hTop":8})
- **curved-zero-moment-sweep** — radial traction has no moment about the centre of curvature, so |F_v x̄ − F_x·arm| ÷ (F_R·R) = 0 for R ∈ {0.5, 1, 2.5, 5} m × h_O ∈ {0, 1.5, 4, 12} m × span ∈ {15, 45, 90}° (worst at {"R":0.5,"hO":12,"span":90})
- **gate3d-zero-moment-sweep** — a Tainter gate carries no hydrostatic moment on its pivot at any head: |M_O| ÷ (F_R·R) = 0 for R ∈ {0.5, 1, 2.5, 5} m × h_O ∈ {0, 1.5, 4, 12} m × span ∈ {15, 45, 90}° (worst at {"R":0.5,"hO":12,"span":45})
- **CG-08** — Fr = V/√(gA/T) over 4 shapes × y ∈ {0.3, 0.8, 1.2, 2.0} m × V ∈ {0.4, 1, 2.5, 6} m/s (worst at null)
- **MN-09** — 3 shapes × S₀ ∈ {1e-4, 1e-3, 1e-2} × n ∈ {0.011, 0.015, 0.030} × y ∈ {0.5, 1.5, 3.0} m (worst at {"shape":"rect","S":0.0001,"n":0.011,"y":1.5})
- **SE-06** — sluice-gate discharge is derived from E₁ = E₂; y₁ ∈ {0.12, 0.17, 0.24} m × a ∈ {8, 12, 20} mm (worst at {"y1":0.17,"a":0.012})
- **HJ-07** — y₁ ∈ {0.010, 0.020, 0.040} m × Fr₁ ∈ {1.5, 2, 3, 4.5, 6, 8, 10} (worst at {"y1":0.02,"Fr":4.5})
- **SH-08** — sweep of i ∈ {15,30,60,100} mm/h, D ∈ {1,3,6} h, φ ∈ {0,10,25} mm/h, k ∈ {0.5,4,12} h; closure required at every point (worst at {"i":60,"dur":6,"phi":10,"A":20,"k":12,"u":0,"bf":"res"})
- **UH-03** — ∫UH_D' dt / A = 1.00 cm required for D' ∈ {1, 2, 3, 4, 6, 8, 12, 18, 24} h (worst at D' = 24 h, giving 1.00000 cm)
- **GV-06.M1** — the GVF equation dE/dx = S₀ − S_f must hold along the integrated profile
<!-- END GENERATED -->

### 3.4. Software, offline and accessibility verification

Table 7 reports the non-numerical checks: <!--G:software-tests-->108<!--/G--> distinct
tests executed <!--G:software-runs-->324<!--/G--> times across the engine matrix, with
<!--G:software-failures-->0<!--/G--> failures. Every laboratory is covered by every class
of check on every engine.

**Table 7.** Software, offline, `file://` and accessibility verification, by browser
engine. Cells give passing tests over tests executed on that engine.

<!-- BEGIN GENERATED table:software-matrix -->
| Check | Distinct tests | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| Accessible names, keyboard operation, focus order, no overflow | 41 | 41/41 | 41/41 | 41/41 |
| Clean load and live rendering | 22 | 22/22 | 22/22 | 22/22 |
| Label separation in the 3D scene | 3 | 3/3 | 3/3 | 3/3 |
| Operation from the `file://` protocol | 21 | 21/21 | 21/21 | 21/21 |
| Self-containment and offline operation | 21 | 21/21 | 21/21 | 21/21 |
| **All checks** | **108** | **108/108** | **108/108** | **108/108** |
<!-- END GENERATED -->

Two entries deserve comment. The `file://` row exists because of the defect described in
Section 3.5, and duplicates checks the HTTP row already performs; the duplication is the
point. The label-layout row measures separation between text sprites in the 3D scene, a
class of failure that produces no error, no exception and no numerical discrepancy — only
an unreadable figure at one end of a slider's range.

### 3.5. Defects found in code believed correct

The protocol was written for a codebase that had already been used in teaching, reviewed
by its author, and believed correct. It found six defects, listed in Table 8. Two of them
are, in our view, the strongest available argument for the protocol, because neither could
have been found by inspection or by ordinary use. The table carries a seventh that the
protocol did not find, because the argument for a verification process is incomplete
without the boundary of what it verifies.

**Table 8.** Defects found in code already believed correct. Six were exposed by the
protocol; the seventh was not, and is recorded here for that reason.

| # | Defect | Class | How the protocol caught it | Consequence if shipped |
|---|---|---|---|---|
| 1 | The storm hydrograph recorded simulation state *before* advancing the step, so array index *j* held the state at (*j*+1)Δ*t* | Numerical | Discharge at a known instant — the moment the rain stops — against the closed-form cascade response at that instant | Every plotted series displaced half a step along its own time axis; a lag time misread by Δ*t*/2 |
| 2 | The two-reservoir cascade chained the exponential update — feeding reservoir 1's end-of-step value into reservoir 2 — making it first order in time, under a source comment asserting "exact exponential stepping" | Numerical | Comparison against the closed-form Nash cascade response to a rectangular hyetograph | A rising limb lagging the analytic solution by Δ*t*/2, in a module whose entire purpose is to show *why* the hydrograph has the shape it has |
| 3 | All 45 range sliders in the suite lacked accessible names | Accessibility | Accessible-name computation on every interactive control | Every laboratory unusable with a screen reader; a control that announces nothing is not a control |
| 4 | The 3D channel-geometry laboratory loaded its rendering library from a content delivery network | Self-containment | Source scan for third-party hosts, plus run-time request interception | The offline claim false for one of the laboratories, failing precisely in the low-bandwidth setting the design targets |
| 5 | The vendored replacement library, imported as an ES module, worked over HTTP and produced a blank page from `file://` | Delivery | Loading every laboratory from disk with no server | A student double-clicking the file sees nothing, with no error message, while every server-based test passes |
| 6 | A bed-slope label in the 3D scene overlapped and buried the side-slope label at part of the control range | Presentation | Measured label separation with a floor of one label height | An unreadable annotation at one end of a slider, invisible to every other class of test |
| 7 | In the 3D cylindrical-gate scene the resultant's direction vector carried the horizontal component with the wrong sign, so the arrow was drawn on the wrong side of the gate and missed the pivot by 0.71*R* | Drawn geometry | **It did not.** The magnitude, the inclination angle and the zero-moment identity were all exactly right, so every numerical case passed; the author saw the arrow miss the pivot | The one thing that scene exists to demonstrate — that hydrostatic traction on a circular arc has no moment about the centre of curvature — silently contradicted by the picture asserting it |

Defect 2 is the instructive one. The code was wrong, the comment above it asserted that it
was right, and the error was invisible in ordinary use: a hydrograph lagging by half a time
step still looks like a hydrograph. It was caught only because the protocol requires the
reference to be derived independently — here, the analytic response of a two-reservoir
cascade to a rectangular pulse — rather than by re-running the module's own arithmetic. A
suite built on self-comparison would have passed it indefinitely.

Defect 5 is the second. It was *introduced by the fix for defect 4* and passed the entire
existing test suite, because that suite served pages over `http://localhost` while students
open files from disk. The lesson is stated as a rule in Section 2.2.2 and encoded as a
permanent test.

Defect 7 is the boundary case, and it is the reason we report the protocol's limits as
findings rather than as caveats. The cylindrical-gate scene exists to show that hydrostatic
traction on a circular arc is radial and therefore exerts no moment about the centre of
curvature. Every number that scene computes was right: the resultant's magnitude, its
inclination, and the cancellation of the two large opposing component moments all agreed
with independently derived references to double precision, across
<!--G:engines-->3<!--/G--> engines and the full range of radii, heads and arc spans. The
direction vector, however, carried the horizontal component with the wrong sign — the
reservoir sits on the −*z* side of the gate, so the water pushes it towards +*z* — and the
arrow was therefore drawn on the wrong side of the gate, missing the pivot by 0.71*R*. A
reader of that scene would have seen a figure contradicting the identity it was drawn to
demonstrate, while every case in Table 3 passed. It was found by eye.

The lesson generalises past this suite. A simulation makes two assertions — one in the
numbers it reports and one in the picture it draws — and a protocol that samples only the
first cannot see a disagreement between them. Our response was to make the drawing
measurable rather than to look harder, in the terms set out in Section 2.4.3: the drawn
geometry is recorded and asserted against independently stated geometric properties. The
distinction that makes those cases worth anything is the independence one — a test that
recomputed the drawing from the same expression the renderer used would have confirmed the
reversed arrow. That this is not a hypothetical risk is worth recording: the first version
of the standoff case passed with the arrow still reversed, because it measured an unsigned
distance, which is identical whichever face the arrow is drawn from.

We also record, for the same reason, one case where the protocol was wrong and the code was
right. The two-reservoir cascade peaks *after* the rain stops, at the instant the two
reservoir outflows are equal; the first version of that test asserted a peak at the end of
the rain and failed the module. The reference had to be derived twice before the test was
trustworthy. A verification protocol is itself software, and is not exempt from the
standard it imposes.

## 4. Discussion

### 4.1. What this study establishes, and what it does not

The evidence above supports three claims and no others. First, that the quantities the
ten laboratories display agree with independently derived references to stated
tolerances — in most cases to double precision — across three browser engines. Second,
that they load, render, animate, remain self-contained and stay operable from the keyboard
in those engines, both over HTTP and from a local file with no network. Third, that the
whole dataset is regenerable by a third party from the archived release.

It establishes nothing whatever about learning. No student data were collected; no
conceptual-understanding instrument was administered; no comparison against any other
mode of instruction was made. Readers should treat the "conceptual target" column of
Table 1 as a statement of design intent, in the same category as an architect's drawing
rather than a survey of the finished building. We are explicit about this because the
temptation to slide from "the simulation is correct and well designed" to "the simulation
teaches" is exactly what has allowed educational software to accumulate adoption without
evidence.

### 4.2. The protocol, not the artifact, is the transferable result

The ten laboratories are useful to instructors of fluid mechanics, hydraulics and
hydrology, a small population. The protocol applies to any educational simulation that
puts a computed number on screen, which is most of them. Its transferable content is five
rules:

1. **The reference must be derived independently of the code under test.** A test that
   re-runs the implementation's own arithmetic is a syntax check wearing the costume of a
   verification. This is the rule that caught defect 2, and it is the one most often
   violated in practice, because self-comparison is far cheaper to write.
2. **Prefer quantities reachable by two routes.** Cross-validation needs no external
   reference, is immune to a shared error in a single derivation, and is available far more
   often than it is used: conservation laws, alternative numerical schemes, and analytic
   limits of numerical procedures are all candidates.
3. **Sweep the control range and report the worst case.** A simulation is a function of
   its sliders. Verifying it at default settings verifies one point of a manifold that
   students will explore in full, and the parameter corners are where models fail.
4. **Test the delivery protocol students actually use.** Not an idealised approximation of
   it. The `file://` defect is a specific instance of a general failure: verification
   environments drift toward the developer's convenience, and the drift is invisible until
   it is not.
5. **Measure the picture where the picture carries the claim.** A figure is an assertion,
   and in a teaching simulation it is often *the* assertion — the thing the student looks
   at while the numbers scroll past unread. Correct numbers do not certify the drawing
   that displays them, as defect 7 shows, and the endpoints the renderer produced are
   available to a test as readily as the values it printed.

To these we add a practice rather than a rule: the dataset should be generated, published
and cited, and the manuscript's numbers should be produced from it mechanically. Doing so
turns "we verified it" from a claim into an artifact a reader can check, and — as we found
while writing this paper — prevents the reported figures from silently drifting away from
the software as it changes.

The rules are deliberately weaker than the verification-and-validation apparatus of
computational science [@oberkampf2010verification], which would ask for grid-convergence
studies and the method of manufactured solutions [@salari2000code]. That apparatus is
appropriate for a solver whose results inform a design decision, and disproportionate for
a teaching instrument. What we claim is that the current educational-simulation norm —
publish the artifact, describe the features, verify nothing in public — is far too weak,
and that the four rules above are close to the cheapest thing that is strong enough.

### 4.3. Design trade-offs

Three of the design commitments carry costs worth stating plainly, since an instructor
considering the approach is choosing them too.

**Live computation costs interaction latency and constrains the physics.** Everything is
solved in the browser, in a single thread, between animation frames. This bounds what can
be simulated: the gradually varied profiles are integrated with RK4 over a few thousand
steps, which is comfortable, but a two-dimensional depth-averaged solver would not be. The
suite's domain — one-dimensional open-channel flow and lumped catchment response — is
where the commitment is affordable. Extending the approach to, say, turbulent flow fields
would need either a coarser model or an architecture that abandons the single-file
constraint.

**Self-containment costs modularity.** No build step, no package manager, no shared
component library: each laboratory duplicates the utilities it needs, and a fix to a shared
idea must be applied ten times. This is a real maintenance burden, accepted because the
alternative — a build pipeline producing bundles — puts the physics students can read
behind a compilation step and puts the artifact's longevity at the mercy of a toolchain.
A single HTML file will still open in a browser in ten years. A 2016 JavaScript build
configuration will not run today.

**Classic scripts cost modern language ergonomics.** The decision to keep physics in the
global scope (Section 2.2.1) is unfashionable and would be flagged in most code reviews.
It is what makes machine-precision verification possible, and we would make it again; but
it should be understood as a deliberate trade of one property valued by software engineers
for another property valued by anyone who needs to trust the numbers.

### 4.4. Limitations

Beyond the absence of any learning claim, six limitations bound the results.

The verification is of **implementation fidelity against physical models, not of the models
themselves**. The φ-index, the Nash cascade, the Gumbel distribution and Manning's equation
are all idealisations with well-known limits; verifying that a module implements the Nash
cascade exactly says nothing about whether a real catchment behaves like one. Each guide
states its module's assumptions and limitations for this reason, and the pedagogical
framing is that these are models to be understood, including in their failure.

**Coverage is broad rather than exhaustive.** The <!--G:cases-->197<!--/G--> cases were
selected to exercise the quantities a student reads and the identities the teaching rests
on. They are not a formal coverage analysis of the source, and a defect in a rarely
exercised branch could survive them.

**What is drawn is verified more thinly than what is computed.** Defect 7 was a correct
number rendered as an incorrect picture, and it passed every numerical case. The geometry
cases added in response measure the arrows that carry an identity — position, direction and
incidence on the pivot or the centre of pressure — but they do not verify a scene as a
whole. Colour, shading, occlusion, and the readability of a figure at projection distance
remain outside the protocol, checked only by looking.

**The empirical fit carries a genuinely loose tolerance.** The Sherman IDF surface is a
four-parameter summary of 36 fitted quantiles and cannot reproduce them exactly; its
tolerance is stated as a fraction of the mean intensity being fitted rather than as
agreement with any exact value. It is the weakest comparison in the suite, and it is
labelled as such rather than blended into a headline figure.

**Cross-engine verification is not cross-device verification.** The suite is tested on
three engines on a desktop-class machine at three viewport sizes. Touch interaction on
small screens, low-powered hardware and assistive-technology behaviour beyond
accessible-name computation and keyboard operability remain unverified.

**Module code and test code share an author, and both were written with the assistance of a
large language model** (see the disclosure in the back matter). The protocol's requirement
that a reference be derived independently of the code is therefore a requirement on the
*derivation*, not on the person or the tool that typed it: independence is enforced by
recording, for every case, the closed form, conservation identity or textbook calculation
the reference comes from, so that a reader can re-derive it without running the software.
Independent reimplementation by a second party would be stronger evidence, and the archived
dataset is published in a form that makes it possible.

### 4.5. Planned evaluation

The evaluation this study deliberately omits is planned as a separate investigation with
its own design and its own evidence standards. It will pair a validated
conceptual-instrument approach — in the tradition of concept inventories in physics
[@hestenes1992force] — with instructor-side data on use in a hydraulics and hydrology
course, and will be reported independently of the technical validation given here. An
intermediate step, an expert-review instrument in which hydraulics and hydrology
instructors rate physics fidelity and instructional usability, is available if a lighter
form of evidence is wanted before a classroom study. Keeping the two apart is a
methodological commitment rather than a staging convenience: the technical claims in this
paper stand or fall on the dataset, and should not borrow credibility from a later study,
nor lend it.

## 5. Conclusions

We have reported the design and technical validation of OpenHydroLab, ten open, offline,
interactive laboratories for undergraduate fluid mechanics, hydraulics and hydrology, and
the verification protocol built around them. The suite computes every displayed quantity from
its governing equation, runs from a local file with no installation and no third-party
host, and exposes its physics in readable source. The protocol requires every reference
value to be derived independently of the code, prefers quantities reachable by two routes,
sweeps the control ranges and reports the worst case, justifies every tolerance
individually, and tests the delivery protocol students actually use. Applied to the suite,
it records <!--G:comparisons-->591<!--/G--> numerical comparisons and
<!--G:software-runs-->324<!--/G--> software, offline and accessibility test executions
across <!--G:engines-->3<!--/G--> browser engines, with
<!--G:failures-->0<!--/G--> failures, and regenerates its own published dataset on every
run.

Applying the protocol to code already believed correct exposed six defects, including a
routing step that was first order in time beneath a comment asserting it was exact, and a
delivery failure introduced by the fix for an earlier one. Neither was reachable by
inspection or by ordinary use. A seventh defect bounds the claim: a resultant force whose
magnitude, inclination and zero-moment identity were all exactly right was drawn on the
wrong side of the surface, and no numerical case could see it. A simulation asserts in its
picture as well as in its numbers, and the drawn geometry has to be measured too. That is
the argument of this paper: for an instrument whose purpose is to show students what the
physics does, correctness is not a quality attribute to be assumed, and the process that
establishes it in public is a more transferable contribution than the artifact it
certifies.

No claim about learning outcomes is made here. That question is a separate study, with a
separate design, and it should be answered on its own evidence.

## 6. Software and Data Availability

OpenHydroLab is released under the MIT licence. The source is at
<https://github.com/samirandas-cell/OpenHydroLab>, and version 1.0.4 — the version
described and verified in this paper — is archived at
[10.5281/zenodo.21915552](https://doi.org/10.5281/zenodo.21915552).
The concept DOI
[10.5281/zenodo.21635797](https://doi.org/10.5281/zenodo.21635797) resolves to the latest
release. The archived snapshot contains the laboratories, their guides, the verification
protocol (`validation/validation-protocol.md`), the full test suite and the generated
validation dataset (`validation/results/`) exactly as reported here, so every number in
this paper can be regenerated by running `npm install && npm run install-browsers &&
npm test` against the archived code, followed by `node tools/manuscript-tables.mjs`. The
rainfall record embedded in the frequency laboratory is Met Office MIDAS-Open hourly data
for gauge Drumalbin 00987, used under the UK Open Government Licence.

**Suggested citation for the software:** Das, S. (2026). *OpenHydroLab: interactive,
physics-accurate animations for teaching fluid mechanics, hydraulics and hydrology*
(Version 1.0.4) [Computer software]. <https://doi.org/10.5281/zenodo.21915552>

## Author Contributions

Conceptualization, S.D.; methodology, S.D.; software, S.D.; validation, S.D.; formal
analysis, S.D.; investigation, S.D.; data curation, S.D.; writing—original draft
preparation, S.D.; writing—review and editing, S.D.; visualization, S.D.; project
administration, S.D. The author has read and agreed to the published version of the
manuscript.

## Funding

This research received no external funding.

## Institutional Review Board Statement

Not applicable. This study involved no human participants and collected no data from
students.

## Informed Consent Statement

Not applicable.

## Data Availability Statement

The validation dataset supporting the results reported in Section 3
(`validation/results/validation-results.json`, `validation-results.md` and
`browser-matrix.json`) is contained in the archived release at
<https://doi.org/10.5281/zenodo.21915552> and is regenerated by the test suite.
No other data were used.

## Acknowledgments

The author thanks the students of the hydraulics and hydrology courses at the University of
Glasgow (Singapore campus), whose questions in class and in tutorials shaped the conceptual
targets of several of the laboratories.

## Use of Generative AI and AI-Assisted Technologies

During the development of the software and the preparation of this manuscript, the author
used Anthropic's Claude (accessed through the Claude Code command-line tool) as a
programming and drafting assistant. Its use spanned four areas: implementing and
refactoring the laboratories' JavaScript, including the rendering and interface code;
writing the automated test suites and the supporting tooling; drafting the module guides
and the verification protocol document; and drafting and editing the text of this
manuscript. The author specified the governing equations, the derivation route for each
reference value and each tolerance, checked every reference value against the closed form,
conservation identity or textbook source recorded with it, directed the design decisions
reported in Section 2.2, reviewed and edited all generated code and text, and executed and
inspected every reported test run. The author takes full responsibility for the content of
the software and of this publication.

## Conflicts of Interest

The author declares no conflict of interest. The author is the sole developer of the
software described.

## Abbreviations

| | |
|---|---|
| AMS | annual maximum series |
| EV1 | Extreme Value type I (Gumbel) distribution |
| GVF | gradually varied flow |
| IDF | intensity–duration–frequency |
| IUH | instantaneous unit hydrograph |
| RK4 | fourth-order Runge–Kutta |
| RMSE | root-mean-square error |
| UH | unit hydrograph |

## References
