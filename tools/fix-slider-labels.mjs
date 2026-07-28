/* One-off: associate each range slider with the <label class="row"> that already sits
   above it. The labels were present but carried no `for`, so the association existed
   only visually and assistive technology announced every control as a bare "slider".
   Adding `for` also makes the label click-to-focus, at no visual cost. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "animations";
let totalFixed = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const path = join(DIR, file);
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  let fixed = 0;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/<input\s+type="range"\s+id="([^"]+)"/);
    if (!m) continue;
    const id = m[1];

    // nearest preceding <label class="row"> without a for attribute
    for (let j = i - 1; j >= 0 && j >= i - 4; j--) {
      if (/<input\s+type="range"/.test(lines[j])) break;   // belongs to another slider
      const lm = lines[j].match(/<label(\s[^>]*)?class="row"/);
      if (!lm) continue;
      if (/<label[^>]*\sfor=/.test(lines[j])) break;       // already associated
      lines[j] = lines[j].replace(/<label(\s+)class="row"/, `<label$1for="${id}" class="row"`);
      fixed++;
      break;
    }
  }

  if (fixed) {
    writeFileSync(path, lines.join("\n"));
    process.stdout.write(`${file}: associated ${fixed} slider label(s)\n`);
    totalFixed += fixed;
  }
}

process.stdout.write(`\n${totalFixed} sliders given an accessible name.\n`);
