/* Vendor Three.js into animations/vendor/three/ as CLASSIC scripts.
 *
 * Why classic and not ES modules: browsers block ES-module imports from a file://
 * origin under CORS, so a vendored `import ... from './vendor/...'` fails the moment a
 * student opens the .html straight from disk — which is the primary way these
 * laboratories are used. Classic <script src> tags carry no such restriction.
 *
 * three.min.js is shipped as UMD and attaches window.THREE by itself. OrbitControls
 * ships only as an ES module, so it is mechanically rewritten here: the named imports
 * become a destructure off the global THREE, the export becomes an assignment onto it,
 * and the whole thing is wrapped in an IIFE so the library's internals stay off the
 * global scope. Nothing else in the file is touched.
 *
 * Run: node tools/vendor-three.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "node_modules/three";
const OUT = "animations/vendor/three";

const version = JSON.parse(readFileSync(join(SRC, "package.json"), "utf8")).version;
mkdirSync(OUT, { recursive: true });

/* ---- the UMD build, used as-is ---- */
writeFileSync(join(OUT, "three.min.js"), readFileSync(join(SRC, "build/three.min.js")));
writeFileSync(join(OUT, "LICENSE"), readFileSync(join(SRC, "LICENSE")));

/* ---- OrbitControls: ES module → classic script ---- */
const srcPath = join(SRC, "examples/jsm/controls/OrbitControls.js");
let js = readFileSync(srcPath, "utf8");

const importRe = /^import\s*\{([\s\S]*?)\}\s*from\s*['"]three['"];\s*$/m;
const exportRe = /^export\s*\{\s*OrbitControls\s*\};\s*$/m;

if (!importRe.test(js)) throw new Error("OrbitControls: expected import block not found — upstream layout changed");
if (!exportRe.test(js)) throw new Error("OrbitControls: expected export statement not found — upstream layout changed");

const names = js.match(importRe)[1].split(",").map((s) => s.trim()).filter(Boolean);

js = js.replace(importRe, `const {\n\t${names.join(",\n\t")}\n} = THREE;`);
js = js.replace(exportRe, "THREE.OrbitControls = OrbitControls;");

const header = `/* OrbitControls — three.js r${version.split(".")[1]} (three@${version}), MIT.
 *
 * Mechanically converted from examples/jsm/controls/OrbitControls.js by
 * tools/vendor-three.mjs so it can load as a classic script from a file:// origin.
 * Two changes only, both made by that script:
 *   import { ... } from 'three';   ->  const { ... } = THREE;
 *   export { OrbitControls };      ->  THREE.OrbitControls = OrbitControls;
 * Wrapped in an IIFE so the ${names.length} destructured symbols stay off the global scope.
 * Do not edit by hand — re-run the vendoring script instead.
 */
(function () {
'use strict';
`;

writeFileSync(join(OUT, "OrbitControls.js"), `${header}${js}\n})();\n`);

/* ---- drop the ES-module copies this replaces ---- */
for (const stale of ["three.module.js", "addons"]) {
  const p = join(OUT, stale);
  if (existsSync(p)) { rmSync(p, { recursive: true, force: true }); process.stdout.write(`removed stale ${stale}\n`); }
}

process.stdout.write(`vendored three@${version} as classic scripts (${names.length} symbols rebound)\n`);
