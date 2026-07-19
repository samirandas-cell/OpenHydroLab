---
title: "OpenHydroLab: interactive, physics-accurate animations for teaching hydraulics and hydrology"
tags:
  - engineering education
  - hydraulics
  - hydrology
  - open-channel flow
  - interactive simulation
  - JavaScript
authors:
  - name: Samiran Das
    orcid: 0000-0000-0000-0000  # TODO: real ORCID
    affiliation: 1
affiliations:
  - name: "James Watt School of Engineering, University of Glasgow (Singapore campus)"
    index: 1
date: 8 July 2026
bibliography: paper.bib
---

# Summary

OpenHydroLab is a library of interactive, single-file HTML animations for teaching
undergraduate hydraulics and hydrology. Each animation computes every displayed quantity
live from the governing equations — continuity, specific energy, momentum, the Manning
equation, the gradually-varied-flow (GVF) equation, and the unit-hydrograph and
frequency-analysis relations of engineering hydrology — so students manipulate real
physics rather than pre-rendered illustrations. The initial public release covers the
storm hydrograph (losses, routing, baseflow separation, mass balance), a three-mode Unit
Hydrograph Workbench (derivation, superposition, S-curve duration change), and a
raw-data-to-design-discharge IDF/frequency pipeline on a real 27-year gauge record;
further modules in hydraulics (channel geometry and the Froude number, Manning uniform
flow, specific energy, hydraulic jumps, GVF profiles) and hydrology (water balance,
rational method, well drawdown) are in final verification. Animations run in any modern
browser with no installation and are fully offline, making them robust for classroom
projection, virtual learning environments, and independent student study.

<!-- TODO: expand ~1 paragraph on design (single-file, sliders, verified against worked
textbook examples; 3D scene via Three.js for the geometry module). -->

# Statement of Need

Interactive simulations are well-established learning tools in physics and chemistry
education [@wieman2008phet], but open-channel hydraulics — a core subject in every civil
engineering degree, and one rich in documented conceptual difficulty (flow regime and
wave propagation, critical versus normal depth, energy loss across a hydraulic jump,
the direction of GVF profiles) — has no comparable free, open, physics-faithful
simulation suite. Existing resources are static textbook figures, commercial software
aimed at design rather than learning (e.g., HEC-RAS), or scattered applets that hide
their governing equations. OpenHydroLab fills this gap with instruments that are
(a) open source and free, (b) verifiable — the equations are in readable JavaScript and
each module is checked against worked textbook examples [@chow1959], and (c) deployable
anywhere, including low-bandwidth settings, because each module is one offline HTML file.

<!-- TODO: 1–2 sentences on classroom use to date (CVE2142 Hydraulics & Hydrology,
University of Glasgow Singapore, cohort size) and planned evaluation. -->

# Learning objectives and instructional design

<!-- TODO (JOSE emphasises pedagogy): map each module to learning objectives; describe
the lecture-demo / pre-lab / independent-exploration usage modes; note the
physics-integrity checklist used during development. -->

# Acknowledgements

<!-- TODO: acknowledge students/colleagues as appropriate; note any funding (LTDF?). -->

# References
