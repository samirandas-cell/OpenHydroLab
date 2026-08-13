/* Build an MDPI-styled .docx from paper/paper.md.  `npm run paper:docx`

   Requires the `docx` package, which is deliberately NOT a devDependency: it is needed
   only to produce a submission file, never to run or verify the laboratories, and the
   test suite must stay installable without it. Install it globally
   (`npm i -g docx`) and run with NODE_PATH pointing at the global root if node cannot
   resolve it:

     NODE_PATH="$(npm root -g)" npm run paper:docx

   Run `node tools/manuscript-tables.mjs --check` first: this script reads paper.md as it
   finds it and will happily typeset a manuscript that has drifted from the dataset.


   MDPI layout conventions applied: Palatino Linotype throughout, 9 pt body on 11 pt
   leading, justified, first-line indent on continuation paragraphs; 10 pt bold title;
   numbered section headings; tables with a top/header/bottom rule only (no vertical
   rules); 8 pt table text; numbered citations in square brackets with a numbered
   reference list in order of first appearance.
*/
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType,
  ExternalHyperlink, PageNumber, Header, Footer,
} = require('docx');
const { parseBib, formatReference } = require('./bibtex.cjs');

const REPO = process.argv[2] || 'C:/Teaching/OpenHydroLab';
const OUT = process.argv[3] || path.join(REPO, 'paper', 'paper.docx');
/* A submission copy lives outside paper/ and carries its own bibliography, so both
   inputs can be named explicitly. Defaults keep `npm run paper:docx` unchanged. */
const SRC = process.argv[4] || path.join(REPO, 'paper', 'paper.md');
const BIB = process.argv[5] || path.join(REPO, 'paper', 'paper.bib');

const FONT = 'Palatino Linotype';
const BODY = 18;      // half-points => 9 pt
const SMALL = 16;     // 8 pt
const TITLE = 32;     // 16 pt

const src = fs.readFileSync(SRC, 'utf8');
const bib = parseBib(fs.readFileSync(BIB, 'utf8'));

/* ---------------------------------------------------------------- front matter */
const fmMatch = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
const fm = {};
if (fmMatch) {
  for (const line of fmMatch[1].split(/\r?\n/)) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}
let body = src.slice(fmMatch ? fmMatch[0].length : 0);

/* Drop HTML comment blocks but keep generated values: <!--G:k-->591<!--/G--> -> 591 */
body = body.replace(/<!--G:[a-z-]+-->/g, '').replace(/<!--\/G-->/g, '');
body = body.replace(/<!--[\s\S]*?-->/g, '');

/* ---------------------------------------------------------------- citations */
const citeOrder = [];
function citeNumber(key) {
  let i = citeOrder.indexOf(key);
  if (i === -1) { citeOrder.push(key); i = citeOrder.length - 1; }
  return i + 1;
}
/* [@a; @b] -> [1,2]; consecutive runs collapsed to ranges by MDPI convention. */
function replaceCitations(text) {
  return text.replace(/\[([^\]]*@[^\]]*)\]/g, (full, inner) => {
    const keys = inner.split(';').map((s) => s.trim().replace(/^@/, ''));
    if (!keys.every((k) => /^[A-Za-z0-9_]+$/.test(k))) return full;
    const nums = keys.map(citeNumber);
    const out = [];
    let i = 0;
    while (i < nums.length) {
      let j = i;
      while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
      out.push(j - i >= 2 ? `${nums[i]}–${nums[j]}` : nums.slice(i, j + 1).join(','));
      i = j + 1;
    }
    return `[${out.join(',')}]`;
  });
}

/* ---------------------------------------------------------------- inline runs */
function runs(text, base = {}) {
  text = replaceCitations(text);
  const out = [];
  // Tokenise bold, italic, code, sub, sup, links, escaped chars.
  /* [text]{.mark} is Pandoc's highlight span: used by the review copy to mark passages
     corrected against the dataset. It is tokenised before the link form, which needs a
     following (…), so the two cannot collide. One level of nested brackets is allowed so
     that a highlighted passage may contain a link. */
  const re = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(~[^~\s][^~]*~)|(\^[^^\s][^^]*\^)|(\[[^\]]+\]\([^)]+\))|(<https?:\/\/[^>]+>)|(<sup>.*?<\/sup>)|(\\.)|(\[(?:[^\[\]]|\[[^\]]*\])+\]\{\.mark\})/g;
  let last = 0, m;
  const push = (t, props) => { if (t) out.push(new TextRun({ text: t, font: FONT, size: base.size || BODY, ...base, ...props })); };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (m[1]) push(tok.slice(2, -2), { bold: true });
    else if (m[2]) push(tok.slice(1, -1), { italics: true });
    else if (m[3]) push(tok.slice(1, -1), { font: 'Consolas', size: (base.size || BODY) - 2 });
    else if (m[4]) push(tok.slice(1, -1), { subScript: true });
    else if (m[5]) push(tok.slice(1, -1), { superScript: true });
    else if (m[6]) {
      const lm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
      out.push(new ExternalHyperlink({
        link: lm[2],
        children: [new TextRun({ text: lm[1], font: FONT, size: base.size || BODY, style: 'Hyperlink', ...base })],
      }));
    } else if (m[7]) {
      const url = tok.slice(1, -1);
      out.push(new ExternalHyperlink({
        link: url,
        children: [new TextRun({ text: url, font: FONT, size: base.size || BODY, style: 'Hyperlink', ...base })],
      }));
    } else if (m[8]) push(tok.replace(/<\/?sup>/g, ''), { superScript: true });
    else if (m[9]) push(tok.slice(1));
    else if (m[10]) {
      const inner = tok.slice(1, tok.lastIndexOf(']'));
      out.push(...runs(inner, { ...base, highlight: 'yellow' }));
    }
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out.length ? out : [new TextRun({ text: '', font: FONT, size: base.size || BODY })];
}

/* ---------------------------------------------------------------- block parsing */
const lines = body.split(/\r?\n/);
const children = [];
let i = 0;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const rule = { style: BorderStyle.SINGLE, size: 6, color: '000000' };

function para(text, opts = {}) {
  const { size = BODY, bold = false, italics = false, align = AlignmentType.JUSTIFIED,
    before = 0, after = 120, indent = null, keepNext = false } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before, after, line: 240 },
    indent: indent || undefined,
    keepNext,
    children: runs(text, { size, bold, italics }),
  });
}

function heading(text, level) {
  const sizes = { 1: 24, 2: 22, 3: 20, 4: 19 };
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    keepNext: true,
    alignment: AlignmentType.LEFT,
    heading: level === 1 ? HeadingLevel.HEADING_1
      : level === 2 ? HeadingLevel.HEADING_2
      : level === 3 ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_4,
    children: runs(text, { size: sizes[level] || 19, bold: true }),
  });
}

function splitRow(line) {
  const t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let cur = '', esc = false;
  for (const ch of t) {
    if (esc) { cur += ch; esc = false; continue; }
    if (ch === '\\') { esc = true; cur += ch; continue; }
    if (ch === '|') { cells.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

function buildTable(rows) {
  const header = splitRow(rows[0]);
  const dataRows = rows.slice(2).map(splitRow);
  const n = header.length;
  const total = 9354; // usable text width in DXA at MDPI's A4 margins

  /* Equal columns starve the prose columns and leave numeric ones half empty, so
     weight each column by its content. A short column like "Tolerance" must fit its
     longest entry on one line or every row wraps, while a prose column wraps happily,
     so the weight is the longest cell capped at CAP: past that, wrapping is expected
     and further width buys nothing. */
  const plain = (s) => s.replace(/\*\*|[*`~^]/g, '').replace(/\\\|/g, '|');
  const PAD = 160;      // cell margins
  const PROSE = 82;     // DXA per character, 8 pt Palatino, measured off the renders
  const MONO = 78;      // 7 pt Consolas, used for the backticked identifier columns
  const FLOOR = 620;    // no column narrower than this, whatever the arithmetic says

  /* Width each column would need to avoid wrapping entirely. */
  const need = [];
  for (let k = 0; k < n; k++) {
    const cells = [header[k], ...dataRows.map((r) => r[k] || '')];
    const mono = cells.filter(Boolean).length > 0
      && cells.filter((c) => /^`[^`]*`$/.test(c.trim())).length > cells.length / 2;
    const longest = Math.max(...cells.map((c) => plain(c).length));
    need.push(longest * (mono ? MONO : PROSE) + PAD);
  }

  /* Water-filling: find the cap C where Σ min(need, C) fills the table exactly. Columns
     needing less than C keep their full width and never wrap; only the columns above the
     cap — the prose ones, which wrap acceptably — give up space. */
  const totalNeed = need.reduce((a, b) => a + b, 0);
  let colWidths;
  if (totalNeed <= total) {
    const surplus = total - totalNeed;
    colWidths = need.map((w) => w + Math.floor((w / totalNeed) * surplus));
  } else {
    let lo = 0, hi = Math.max(...need);
    for (let it = 0; it < 60; it++) {
      const mid = (lo + hi) / 2;
      const s = need.reduce((a, w) => a + Math.min(w, mid), 0);
      if (s > total) hi = mid; else lo = mid;
    }
    colWidths = need.map((w) => Math.max(FLOOR, Math.floor(Math.min(w, lo))));
    // The floor can overshoot the table; take the excess back from the widest columns.
    let over = colWidths.reduce((a, b) => a + b, 0) - total;
    while (over > 0) {
      const k = colWidths.indexOf(Math.max(...colWidths));
      const give = Math.min(over, colWidths[k] - FLOOR);
      if (give <= 0) break;
      colWidths[k] -= give;
      over -= give;
    }
  }
  const drift = total - colWidths.reduce((a, b) => a + b, 0);
  colWidths[colWidths.indexOf(Math.max(...colWidths))] += drift;

  const cell = (text, opts = {}) => new TableCell({
    width: { size: opts.width, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    borders: {
      top: opts.top || noBorder, bottom: opts.bottom || noBorder,
      left: noBorder, right: noBorder,
    },
    shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' },
    children: [new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 20, after: 20, line: 220 },
      children: runs(text.replace(/\\\|/g, '|'), { size: SMALL, bold: !!opts.bold }),
    })],
  });

  const trs = [];
  trs.push(new TableRow({
    tableHeader: true,
    children: header.map((h, k) => cell(h, { width: colWidths[k], bold: true, top: rule, bottom: rule })),
  }));
  dataRows.forEach((r, ri) => {
    const isLast = ri === dataRows.length - 1;
    const padded = Array.from({ length: n }, (_, k) => r[k] || '');
    trs.push(new TableRow({
      children: padded.map((c, k) => cell(c, { width: colWidths[k], bottom: isLast ? rule : noBorder })),
    }));
  });

  return new Table({
    columnWidths: colWidths,
    width: { size: total, type: WidthType.DXA },
    rows: trs,
  });
}

/* Title block */
children.push(new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 200 },
  children: runs(fm.title || 'Untitled', { size: TITLE, bold: true }),
}));

let firstParaOfSection = true;

while (i < lines.length) {
  const line = lines[i];

  if (!line.trim()) { i++; continue; }

  // Tables
  if (/^\s*\|/.test(line)) {
    const rows = [];
    while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
    if (rows.length >= 2) {
      children.push(buildTable(rows));
      children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }
    firstParaOfSection = true;
    continue;
  }

  // Headings
  const h = line.match(/^(#{2,4})\s+(.*)$/);
  if (h) {
    children.push(heading(h[2].trim(), h[1].length - 1));
    firstParaOfSection = true;
    i++;
    continue;
  }

  // Bullet list
  if (/^\s*-\s+/.test(line)) {
    while (i < lines.length && (/^\s*-\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
      let text = lines[i].replace(/^\s*-\s+/, '');
      i++;
      while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*-\s+/.test(lines[i])) {
        text += ' ' + lines[i].trim();
        i++;
      }
      children.push(new Paragraph({
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 60, line: 240 },
        children: runs(text, { size: BODY }),
      }));
    }
    firstParaOfSection = true;
    continue;
  }

  // Numbered list
  if (/^\s*\d+\.\s+/.test(line)) {
    while (i < lines.length && (/^\s*\d+\.\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
      let text = lines[i].replace(/^\s*(\d+)\.\s+/, (mm, d) => `${d}. `);
      i++;
      while (i < lines.length && /^\s{3,}\S/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i])) {
        text += ' ' + lines[i].trim();
        i++;
      }
      children.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 60, line: 240 },
        indent: { left: 360, hanging: 260 },
        children: runs(text, { size: BODY }),
      }));
    }
    firstParaOfSection = true;
    continue;
  }

  // Paragraph: gather until blank line / block start
  let buf = [line];
  i++;
  while (i < lines.length && lines[i].trim()
         && !/^\s*\|/.test(lines[i]) && !/^#{2,4}\s/.test(lines[i])
         && !/^\s*-\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i])) {
    buf.push(lines[i]);
    i++;
  }
  const text = buf.join(' ').replace(/\s+/g, ' ').trim();

  // Table captions and the abstract/keywords lines are their own shapes.
  const isCaption = /^\*\*Table\s+\d+\.\*\*/.test(text);
  const isKeywords = /^\*\*Keywords:\*\*/.test(text);
  const isAffil = /^<sup>/.test(text) || /^Samiran Das/.test(text) || /^\\\* Correspondence/.test(text);

  if (isCaption) {
    children.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 120, after: 60 },
      keepNext: true,
      children: runs(text, { size: SMALL }),
    }));
    firstParaOfSection = true;
    continue;
  }

  if (isAffil) {
    children.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: runs(text, { size: SMALL }),
    }));
    continue;
  }

  if (isKeywords) {
    children.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 120, after: 200 },
      children: runs(text, { size: SMALL }),
    }));
    firstParaOfSection = true;
    continue;
  }

  children.push(para(text, {
    indent: firstParaOfSection ? null : { firstLine: 260 },
  }));
  firstParaOfSection = false;
}

/* ---------------------------------------------------------------- references */
children.push(heading('References', 1));
const missing = [];
citeOrder.forEach((key, idx) => {
  const entry = bib.get(key);
  if (!entry) { missing.push(key); }
  const parts = entry ? formatReference(entry) : [{ text: `[MISSING BIB ENTRY: ${key}]` }];
  const kids = [new TextRun({ text: `${idx + 1}. `, font: FONT, size: SMALL })];
  for (const p of parts) {
    kids.push(new TextRun({ text: p.text, font: FONT, size: SMALL, bold: !!p.bold, italics: !!p.italic }));
  }
  children.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 60, line: 220 },
    indent: { left: 360, hanging: 360 },
    children: kids,
  }));
});

const uncited = [...bib.keys()].filter((k) => !citeOrder.includes(k));

/* ---------------------------------------------------------------- document */
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: BODY } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: '000000' } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 22, bold: true, color: '000000' } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 20, bold: true, italics: true, color: '000000' } },
      { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 19, bold: false, italics: true, color: '000000' } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },           // A4, MDPI's page size
        margin: { top: 1440, bottom: 1440, left: 1276, right: 1276 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: fm.journal || '', font: FONT, size: SMALL, italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: SMALL })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB)`);
  console.log(`citations resolved: ${citeOrder.length}`);
  if (missing.length) console.log(`MISSING bib entries: ${missing.join(', ')}`);
  if (uncited.length) console.log(`uncited bib entries: ${uncited.join(', ')}`);
});
