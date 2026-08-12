#!/usr/bin/env node
// Generates the manuscript's results tables and inline counts from the validation
// dataset, and injects them into paper/paper.md between markers.
//
//   node tools/manuscript-tables.mjs           # rewrite paper/paper.md in place
//   node tools/manuscript-tables.mjs --check   # exit 1 if paper.md is out of date
//
// Nothing in the Results section of the manuscript is typed by hand. Every table and
// every inline count below is derived from validation/results/, so a re-run of the test
// suite followed by a re-run of this script is the only way those numbers change.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = JSON.parse(
  readFileSync(resolve(root, 'validation/results/validation-results.json'), 'utf8')
);
const matrix = JSON.parse(
  readFileSync(resolve(root, 'validation/results/browser-matrix.json'), 'utf8')
);
const paperPath = resolve(root, 'paper/paper.md');

const MODULE_TITLES = {
  hydrostatic_forces: 'Hydrostatic forces on plane and curved surfaces',
  hydrostatic_forces_3d: 'Hydrostatic forces in three dimensions',
  channel_geometry: 'Channel geometry, velocity distribution and the Froude number',
  specific_energy: 'Specific energy, critical depth and choking',
  hydraulic_jump: 'Hydraulic jump',
  manning_uniform_flow: 'Manning uniform flow and normal depth',
  gvf_profiles: 'Gradually varied flow profiles',
  storm_hydrograph: 'Storm hydrograph',
  unit_hydrograph: 'Unit Hydrograph Workbench',
  idf_frequency: 'IDF and frequency analysis',
};
const MODULE_ORDER = Object.keys(MODULE_TITLES);

// ---------------------------------------------------------------- helpers

/** Worst (largest-error) record per case id, taken across engines. */
function worstByCase(cases) {
  const worst = new Map();
  for (const c of cases) {
    const key = `${c.module}|${c.id}`;
    const prev = worst.get(key);
    const err = errorOf(c);
    if (!prev || err > errorOf(prev)) worst.set(key, c);
  }
  return worst;
}

/** The error a case is judged on: relative where defined, absolute otherwise. */
function errorOf(c) {
  const tol = parseTolerance(c.tolerance);
  if (tol.kind === 'rel' && c.relErr !== null && c.relErr !== undefined) return c.relErr;
  return Math.abs(c.absErr ?? 0);
}

function parseTolerance(t) {
  const m = /^(abs|rel)\s*≤\s*(\S+)$/.exec(String(t).trim());
  if (!m) return { kind: 'abs', limit: NaN, text: t };
  return { kind: m[1], limit: Number(m[2]), text: t };
}

/** Error as a fraction of its own tolerance — 1.0 means the case only just passed. */
function usedFraction(c) {
  const tol = parseTolerance(c.tolerance);
  if (!Number.isFinite(tol.limit) || tol.limit === 0) return null;
  return errorOf(c) / tol.limit;
}

function sig(x, digits = 6) {
  if (x === null || x === undefined) return '—';
  if (!Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e-4 && a < 1e6) return String(Number(x.toPrecision(digits)));
  const [m, e] = x.toExponential(2).split('e');
  return `${m} × 10^${e.replace('-', '−').replace('+', '')}^`;
}

/** A percentage-of-tolerance figure, with a floor rather than exponential notation. */
function pct(fraction) {
  const p = fraction * 100;
  if (p === 0) return '0';
  if (p < 0.001) return '< 0.001%';
  if (p >= 10) return `${Math.round(p)}%`;
  return `${Number(p.toPrecision(2))}%`;
}

/** Errors: plain scientific, with a floor at double precision. */
function err(x) {
  if (x === null || x === undefined || !Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  if (x < 1e-15) return '< 10^−15^';
  return x.toExponential(1).replace('e', ' × 10^').replace('-', '−') + '^';
}

/** A tolerance limit printed exactly, never rounded. */
function fmtLimit(x) {
  if (!Number.isFinite(x)) return '—';
  if (x >= 1e-4) return String(x);
  const [m, e] = x.toExponential().split('e');
  return `${m} × 10^${e.replace('-', '−').replace('+', '')}^`;
}

function tolText(t) {
  const { kind, limit } = parseTolerance(t);
  const label = kind === 'rel' ? 'rel.' : 'abs.';
  if (!Number.isFinite(limit)) return t;
  return `${label} ≤ ${fmtLimit(limit)}`;
}

/** Markdown tables are pipe-delimited; module quantities contain |x| notation. */
function cell(s) {
  return String(s).replace(/\|/g, '\\|');
}

function withUnits(value, units) {
  // Dimensionless is written as a bare dash, and the specs are not consistent about
  // which one: en dash, em dash and hyphen all mean "no units, print nothing".
  const u = units && !['-', '–', '—'].includes(units.trim()) ? ` ${units}` : '';
  return `${sig(value)}${u}`;
}

function table(header, rows) {
  const head = `| ${header.join(' | ')} |`;
  const rule = `|${header.map(() => '---').join('|')}|`;
  return [head, rule, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

// ---------------------------------------------------------------- derived stats

const worst = worstByCase(results.cases);
const engines = results.engines;
const modules = [...new Set(results.cases.map((c) => c.module))];
// A module absent from MODULE_TITLES would be dropped from every per-module table while
// still counting towards the totals, so the rows would silently stop summing. Fail instead.
const untitled = modules.filter((m) => !(m in MODULE_TITLES));
if (untitled.length) {
  console.error(
    `validation dataset contains modules missing from MODULE_TITLES: ${untitled.join(', ')}`,
  );
  process.exit(1);
}
const distinctCases = worst.size;
const comparisons = results.cases.length;
const failures = results.cases.filter((c) => c.status !== 'pass').length;

const softwareTestNames = Object.keys(matrix.tests);
const softwareRuns = softwareTestNames.reduce(
  (n, name) => n + Object.keys(matrix.tests[name]).length,
  0
);
const softwareFailures = softwareTestNames.reduce(
  (n, name) => n + Object.values(matrix.tests[name]).filter((s) => s !== 'passed').length,
  0
);

const worstUsed = Math.max(
  ...[...worst.values()].map((c) => usedFraction(c) ?? 0).filter(Number.isFinite)
);
const worstUsedCase = [...worst.values()].find((c) => (usedFraction(c) ?? 0) === worstUsed);

// Machine-precision cases: those held to 1e-9 or tighter and passing at < 1e-12.
const tightCases = [...worst.values()].filter(
  (c) => parseTolerance(c.tolerance).limit <= 1e-9
);
const exactCases = tightCases.filter((c) => errorOf(c) < 1e-12);

// ---------------------------------------------------------------- table builders

function moduleSummary() {
  const rows = [];
  for (const mod of MODULE_ORDER) {
    if (!modules.includes(mod)) continue;
    const cs = [...worst.values()].filter((c) => c.module === mod);
    const all = results.cases.filter((c) => c.module === mod);
    const worstErr = Math.max(...cs.map(errorOf));
    const tightest = Math.min(...cs.map((c) => parseTolerance(c.tolerance).limit));
    const loosest = Math.max(...cs.map((c) => parseTolerance(c.tolerance).limit));
    const band =
      tightest === loosest
        ? fmtLimit(tightest)
        : `${fmtLimit(tightest)} – ${fmtLimit(loosest)}`;
    rows.push([
      `\`${mod}\``,
      String(cs.length),
      String(all.length),
      band,
      err(worstErr),
      `${all.filter((c) => c.status === 'pass').length}/${all.length}`,
    ]);
  }
  const totCases = [...worst.values()];
  rows.push([
    '**All modules**',
    `**${distinctCases}**`,
    `**${comparisons}**`,
    '—',
    `**${err(Math.max(...totCases.map(errorOf)))}**`,
    `**${comparisons - failures}/${comparisons}**`,
  ]);
  return table(
    [
      'Laboratory',
      'Verification cases',
      'Comparisons (× ' + engines.length + ' engines)',
      'Tolerance band',
      'Worst error',
      'Passing',
    ],
    rows
  );
}

function toleranceClasses() {
  const groups = new Map();
  for (const c of worst.values()) {
    const t = parseTolerance(c.tolerance);
    const key = `${t.kind}|${t.limit}`;
    if (!groups.has(key)) groups.set(key, { kind: t.kind, limit: t.limit, cases: [] });
    groups.get(key).cases.push(c);
  }
  const rows = [...groups.values()]
    .sort((a, b) => a.limit - b.limit || a.kind.localeCompare(b.kind))
    .map((g) => {
      const w = Math.max(...g.cases.map(errorOf));
      const used = Math.max(...g.cases.map((c) => usedFraction(c) ?? 0));
      return [
        tolText(`${g.kind} ≤ ${g.limit}`),
        String(g.cases.length),
        String(g.cases.length * engines.length),
        err(w),
        pct(used),
      ];
    });
  return table(
    ['Tolerance', 'Cases', 'Comparisons', 'Worst error observed', 'Worst error as % of tolerance'],
    rows
  );
}

function pickCases(ids) {
  return ids.map((id) => {
    const hit = [...worst.values()].find((c) => c.id === id);
    if (!hit) throw new Error(`case ${id} not found in the validation dataset`);
    return hit;
  });
}

function caseTable(ids) {
  const rows = pickCases(ids).map((c) => [
    `\`${c.id}\``,
    `\`${c.module}\``,
    cell(c.quantity),
    withUnits(c.reference, c.units),
    withUnits(c.observed, c.units),
    err(errorOf(c)),
    tolText(c.tolerance),
  ]);
  return table(
    ['Case', 'Laboratory', 'Quantity', 'Reference', 'OpenHydroLab', 'Error', 'Tolerance'],
    rows
  );
}

function derivationList(ids) {
  return pickCases(ids)
    .map((c) => `- **${c.id}** — ${c.source}`)
    .join('\n');
}

function softwareMatrix() {
  const SPEC_TITLES = {
    'loads-clean.spec.mjs': 'Clean load and live rendering',
    'self-contained.spec.mjs': 'Self-containment and offline operation',
    'file-protocol.spec.mjs': 'Operation from the `file://` protocol',
    'accessibility.spec.mjs': 'Accessible names, keyboard operation, focus order, no overflow',
    'label-layout.spec.mjs': 'Label separation in the 3D scene',
  };
  const bySpec = new Map();
  for (const name of softwareTestNames) {
    const spec = name.split(' › ')[0];
    if (!bySpec.has(spec)) bySpec.set(spec, []);
    bySpec.get(spec).push(matrix.tests[name]);
  }
  const rows = [...bySpec.entries()]
    .sort((a, b) => (SPEC_TITLES[a[0]] ?? a[0]).localeCompare(SPEC_TITLES[b[0]] ?? b[0]))
    .map(([spec, entries]) => {
      const cells = engines.map((e) => {
        const seen = entries.filter((r) => e in r);
        const passed = seen.filter((r) => r[e] === 'passed').length;
        return `${passed}/${seen.length}`;
      });
      return [SPEC_TITLES[spec] ?? spec, String(entries.length), ...cells];
    });
  const totals = engines.map((e) => {
    const seen = softwareTestNames.filter((n) => e in matrix.tests[n]);
    const passed = seen.filter((n) => matrix.tests[n][e] === 'passed').length;
    return `**${passed}/${seen.length}**`;
  });
  rows.push(['**All checks**', `**${softwareTestNames.length}**`, ...totals]);
  const ENGINE_NAMES = { chromium: 'Chromium', firefox: 'Firefox', webkit: 'WebKit' };
  return table(
    ['Check', 'Distinct tests', ...engines.map((e) => ENGINE_NAMES[e] ?? e)],
    rows
  );
}

// ---------------------------------------------------------------- blocks

/* Cases whose reference is a second derivation of the same quantity rather than an
   external value. Listed in module order, matching Table 1 and Table 3. */
const TWO_ROUTE_IDS = [
  'plane-selfcheck-F', 'plane-selfcheck-CP', 'curved-selfcheck-Fx', 'curved-selfcheck-Fv',
  'shape-rect-selfcheck-I', 'shape-tri-selfcheck-I', 'shape-circ-selfcheck-I',
  'shape-semi-selfcheck-I',
  'HJ-04', 'HJ-08', 'UH-06.24', 'GV-08', 'ID-10', 'CG-19',
];

/* Identities required to hold across a whole control range, reported at their worst
   corner. A case belongs here only if it sweeps: spot checks live in Table 3. */
const INVARIANT_IDS = [
  'plane-dy-invariant-sweep', 'curved-zero-moment-sweep', 'gate3d-zero-moment-sweep',
  'CG-08', 'MN-09', 'SE-06', 'HJ-07', 'SH-08', 'UH-03', 'GV-06.M1',
];

const blocks = {
  'table:module-summary': moduleSummary(),
  'table:tolerance-classes': toleranceClasses(),
  'table:two-routes': caseTable(TWO_ROUTE_IDS),
  'list:two-routes-derivations': derivationList(TWO_ROUTE_IDS),
  'table:invariants': caseTable(INVARIANT_IDS),
  'list:invariant-derivations': derivationList(INVARIANT_IDS),
  'table:software-matrix': softwareMatrix(),
};

const inline = {
  modules: String(modules.length),
  cases: String(distinctCases),
  comparisons: String(comparisons),
  failures: String(failures),
  engines: String(engines.length),
  'engine-names': engines.join(', '),
  'software-tests': String(softwareTestNames.length),
  'software-runs': String(softwareRuns),
  'software-failures': String(softwareFailures),
  'exact-cases': String(exactCases.length),
  'tight-cases': String(tightCases.length),
  'worst-used-pct': pct(worstUsed),
  'worst-used-case': worstUsedCase ? worstUsedCase.id : '—',
  'run-date': new Date(results.generated).toISOString().slice(0, 10),
  'run-status': results.runStatus,
};

// ---------------------------------------------------------------- injection

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let text = readFileSync(paperPath, 'utf8');
const before = text;
const missing = [];

for (const [key, body] of Object.entries(blocks)) {
  const begin = `<!-- BEGIN GENERATED ${key} -->`;
  const end = '<!-- END GENERATED -->';
  // The body must not be allowed to run past its own END marker into the next block:
  // a lazy [\s\S]*? happily swallows whole sections when a block is still empty.
  const re = new RegExp(
    `${escapeRe(begin)}(?:(?!<!-- (?:BEGIN|END) GENERATED)[\\s\\S])*${escapeRe(end)}`
  );
  if (!re.test(text)) {
    missing.push(key);
    continue;
  }
  text = text.replace(re, `${begin}\n${body}\n${end}`);
}

for (const [key, value] of Object.entries(inline)) {
  const re = new RegExp(`<!--G:${escapeRe(key)}-->(?:(?!<!--)[\\s\\S])*<!--/G-->`, 'g');
  text = text.replace(re, `<!--G:${key}-->${value}<!--/G-->`);
}

if (missing.length) {
  console.error(`paper.md has no marker for: ${missing.join(', ')}`);
  process.exitCode = 1;
}

if (process.argv.includes('--check')) {
  if (text !== before) {
    console.error('paper/paper.md is out of date — run: node tools/manuscript-tables.mjs');
    process.exitCode = 1;
  } else {
    console.log('paper/paper.md is in sync with validation/results/.');
  }
} else {
  writeFileSync(paperPath, text);
  console.log(
    `paper/paper.md updated from the ${inline['run-date']} validation run: ` +
      `${comparisons} comparisons, ${failures} failing, ${softwareRuns} software test runs.`
  );
}
