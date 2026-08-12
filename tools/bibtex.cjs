/* Minimal BibTeX reader + MDPI (ACS-style numbered) reference formatter. */

function stripBraces(s) {
  return s.replace(/[{}]/g, '');
}

function deLatex(s) {
  return stripBraces(s)
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/\\'e/g, 'é')
    .replace(/\\"o/g, 'ö')
    .replace(/\\`a/g, 'à')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Parse @type{key, field = {value}, ...} with brace-depth tracking. */
function parseBib(text) {
  const entries = new Map();
  let i = 0;
  while (i < text.length) {
    const at = text.indexOf('@', i);
    if (at === -1) break;
    // Skip comment lines beginning with %
    const lineStart = text.lastIndexOf('\n', at) + 1;
    if (text.slice(lineStart, at).trim().startsWith('%')) { i = at + 1; continue; }

    const open = text.indexOf('{', at);
    if (open === -1) break;
    const type = text.slice(at + 1, open).trim().toLowerCase();

    let depth = 1, j = open + 1;
    while (j < text.length && depth > 0) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') depth--;
      j++;
    }
    const body = text.slice(open + 1, j - 1);
    const comma = body.indexOf(',');
    const key = body.slice(0, comma).trim();
    const fieldText = body.slice(comma + 1);

    const fields = {};
    let k = 0;
    while (k < fieldText.length) {
      const eq = fieldText.indexOf('=', k);
      if (eq === -1) break;
      const name = fieldText.slice(k, eq).replace(/^[\s,]+/, '').trim().toLowerCase();
      let v = eq + 1;
      while (v < fieldText.length && /\s/.test(fieldText[v])) v++;
      let value = '';
      if (fieldText[v] === '{') {
        let d = 1, m = v + 1;
        while (m < fieldText.length && d > 0) {
          if (fieldText[m] === '{') d++;
          else if (fieldText[m] === '}') d--;
          m++;
        }
        value = fieldText.slice(v + 1, m - 1);
        k = m;
      } else if (fieldText[v] === '"') {
        const m = fieldText.indexOf('"', v + 1);
        value = fieldText.slice(v + 1, m);
        k = m + 1;
      } else {
        let m = v;
        while (m < fieldText.length && !/[,\n]/.test(fieldText[m])) m++;
        value = fieldText.slice(v, m);
        k = m;
      }
      if (name) fields[name] = value;
      const nextComma = fieldText.indexOf(',', k);
      k = nextComma === -1 ? fieldText.length : nextComma + 1;
    }
    entries.set(key, { type, key, fields });
    i = j;
  }
  return entries;
}

/* "Wieman, Carl E. and Adams, Wendy K." -> "Wieman, C.E.; Adams, W.K." (MDPI style) */
/* Split on " and " at brace depth 0, so a braced corporate name stays one author
   even when it contains a comma ("{US Army Corps of Engineers, HEC}"). */
function splitPeople(raw) {
  const out = [];
  let depth = 0, cur = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0 && raw.startsWith(' and ', i)) { out.push(cur); cur = ''; i += 4; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function formatAuthors(raw) {
  if (!raw) return '';
  const people = splitPeople(raw);
  const out = people.map((p) => {
    // A wholly braced name is corporate: print it verbatim, never initialise it.
    if (/^\s*\{.*\}\s*$/.test(p)) return deLatex(p);
    p = deLatex(p);
    let last, firsts;
    if (p.includes(',')) {
      const [l, f] = p.split(',');
      last = l.trim();
      firsts = f.trim();
    } else {
      const parts = p.trim().split(/\s+/);
      last = parts.pop();
      firsts = parts.join(' ');
    }
    const initials = firsts
      .split(/[\s.]+/)
      .filter(Boolean)
      .map((w) => (w.length === 1 || /^[A-Z]$/.test(w) ? w.toUpperCase() : w[0].toUpperCase()) + '.')
      .join('');
    return initials ? `${last}, ${initials}` : last;
  });
  return out.join('; ');
}

/* MDPI reference: Author, A.B.; Author, C.D. Title. Journal Year, Volume, pages. DOI */
function formatReference(entry) {
  const f = entry.fields;
  const parts = [];
  const authors = formatAuthors(f.author);
  if (authors) parts.push({ text: authors + '.' });

  const title = deLatex(f.title || '');
  if (title) parts.push({ text: ' ' + title + (/[.?!]$/.test(title) ? '' : '.') });

  if (entry.type === 'article' && f.journal) {
    parts.push({ text: ' ' + deLatex(f.journal), italic: true });
    if (f.year) parts.push({ text: ' ' + f.year, bold: true });
    if (f.volume) parts.push({ text: ', ' + deLatex(f.volume), italic: true });
    if (f.pages) parts.push({ text: ', ' + deLatex(f.pages) });
    parts.push({ text: '.' });
  } else if (entry.type === 'book' || entry.type === 'inbook') {
    if (f.edition) parts.push({ text: ' ' + deLatex(f.edition) + ' ed.' });
    if (f.publisher) parts.push({ text: ' ' + deLatex(f.publisher) });
    if (f.address) parts.push({ text: ': ' + deLatex(f.address) });
    if (f.year) parts.push({ text: ', ' + f.year });
    parts.push({ text: '.' });
  } else if (entry.type === 'incollection' || entry.type === 'inproceedings') {
    if (f.booktitle) parts.push({ text: ' In ' + deLatex(f.booktitle), italic: true });
    if (f.publisher) parts.push({ text: '; ' + deLatex(f.publisher) });
    if (f.year) parts.push({ text: ', ' + f.year });
    if (f.pages) parts.push({ text: ', pp. ' + deLatex(f.pages) });
    parts.push({ text: '.' });
  } else {
    // techreport, manual, misc, online
    if (f.institution) parts.push({ text: ' ' + deLatex(f.institution) });
    if (f.organization) parts.push({ text: ' ' + deLatex(f.organization) });
    if (f.publisher) parts.push({ text: ' ' + deLatex(f.publisher) });
    if (f.number) parts.push({ text: ', ' + deLatex(f.number) });
    if (f.year) parts.push({ text: ', ' + f.year });
    parts.push({ text: '.' });
  }

  // A title ending in a digit-dot ("WCAG 2.1.") collides with the separator that follows.
  for (let i = 1; i < parts.length; i++) {
    parts[i].text = parts[i].text.replace(/^\.,/, ',').replace(/^\.\./, '.');
    if (/\.$/.test(parts[i - 1].text) && /^, /.test(parts[i].text)) {
      parts[i - 1].text = parts[i - 1].text.replace(/\.$/, '');
    }
  }

  if (f.doi) parts.push({ text: ' https://doi.org/' + deLatex(f.doi) + '.' });
  else if (f.url) {
    parts.push({ text: ' Available online: ' + deLatex(f.url) });
    parts.push({ text: f.urldate ? ` (accessed on ${deLatex(f.urldate)}).` : '.' });
  }
  return parts;
}

module.exports = { parseBib, formatReference, formatAuthors, deLatex };
