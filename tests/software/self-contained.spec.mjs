/* Self-containment and offline operation.

   OpenHydroLab is described as a set of single-file laboratories that run offline,
   which is the basis for the claim that they work in low-bandwidth settings and can
   be handed to students as files. That claim is only true if nothing is fetched from
   a third-party host at run time, so it is tested rather than asserted. */
import { test, expect } from "@playwright/test";
import { MODULE_NAMES, MODULES, openLab } from "../helpers/lab.mjs";

for (const name of MODULE_NAMES) {
  test(`${name} requests nothing from outside the origin`, async ({ page }) => {
    const external = new Set();

    page.on("request", (req) => {
      const url = req.url();
      if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("about:")) return;
      if (!url.startsWith(`http://localhost:${process.env.PORT || 4173}/`)) external.add(url);
    });

    await openLab(page, name);
    await page.waitForTimeout(800);

    expect(
      [...external],
      `${name} must not load third-party resources — an external dependency breaks `
      + "offline use and pins the module to a CDN that may change or disappear",
    ).toEqual([]);
  });
}

for (const name of MODULE_NAMES) {
  test(`${name} still works with the network cut`, async ({ page }) => {
    /* Block everything that is not same-origin and require the module to come up
       anyway. This is the honest simulation of a student opening the file on a
       laptop with no connection. */
    await page.route("**", (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://localhost:${process.env.PORT || 4173}/`)) return route.continue();
      return route.abort();
    });

    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(`${e.name}: ${e.message}`));

    await page.goto(`/animations/${MODULES[name].file}`, { waitUntil: "load" });
    await page.waitForFunction(MODULES[name].ready, undefined, { timeout: 15000 });

    expect(pageErrors, `${name} raised errors with external hosts unreachable`).toEqual([]);
  });
}

test("no animation references a third-party host in its source", async ({ request }) => {
  /* A static check to complement the runtime one: a CDN reference behind a code path
     the tests do not exercise would still break an offline user. */
  const offenders = [];
  for (const name of MODULE_NAMES) {
    const res = await request.get(`/animations/${MODULES[name].file}`);
    const src = await res.text();
    const urls = src.match(/https?:\/\/[^\s"'`)]+/g) || [];
    const remote = urls.filter((u) => !/^https?:\/\/(localhost|127\.0\.0\.1)/.test(u)
      && !/^https?:\/\/(www\.)?w3\.org/.test(u));  // XML namespaces are not fetched
    if (remote.length) offenders.push(`${MODULES[name].file}: ${[...new Set(remote)].join(", ")}`);
  }
  expect(offenders, "modules referencing third-party hosts").toEqual([]);
});
