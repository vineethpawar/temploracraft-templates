#!/usr/bin/env node
/**
 * validate.mjs — scan every templates/<domain>/<slug>/template.json,
 * validate against the Zod schema, and check the sibling assets.
 *
 * Run locally: npm run validate
 * Run on CI: same, via .github/workflows/validate.yml
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { templateDocSchema } from "../packages/schema/dist/index.js";

const ROOT = resolve(process.cwd(), "templates");
const MAX_PREVIEW_BYTES = 200 * 1024;

let failures = 0;
function fail(scope, message) {
  console.error(`  ✗ ${scope}: ${message}`);
  failures++;
}
function ok(scope, message) {
  console.log(`  ✓ ${scope}: ${message}`);
}

function walkTemplates() {
  if (!existsSync(ROOT)) return [];
  const found = [];
  for (const domain of readdirSync(ROOT)) {
    const domainDir = join(ROOT, domain);
    if (!statSync(domainDir).isDirectory()) continue;
    for (const slug of readdirSync(domainDir)) {
      const slugDir = join(domainDir, slug);
      if (statSync(slugDir).isDirectory()) found.push({ domain, slug, path: slugDir });
    }
  }
  return found;
}

const templates = walkTemplates();
if (!templates.length) {
  console.log("no templates yet — nothing to validate.");
  process.exit(0);
}

for (const t of templates) {
  const scope = `${t.domain}/${t.slug}`;
  console.log(`\n${scope}`);

  const jsonPath = join(t.path, "template.json");
  if (!existsSync(jsonPath)) { fail(scope, "missing template.json"); continue; }

  let parsed;
  try { parsed = JSON.parse(readFileSync(jsonPath, "utf8")); }
  catch (e) { fail(scope, `template.json invalid JSON: ${e.message}`); continue; }

  const result = templateDocSchema.safeParse(parsed);
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(scope, `${issue.path.join(".")} — ${issue.message}`);
    }
    continue;
  }

  if (result.data.slug !== t.slug) {
    fail(scope, `slug in template.json ("${result.data.slug}") doesn't match folder name ("${t.slug}")`);
  } else {
    ok(scope, "schema + slug match");
  }

  const readmePath = join(t.path, "README.md");
  if (!existsSync(readmePath)) fail(scope, "missing README.md");
  else ok(scope, "README.md present");

  const previewPath = join(t.path, "preview.png");
  if (!existsSync(previewPath)) {
    fail(scope, "missing preview.png");
  } else {
    const size = statSync(previewPath).size;
    if (size > MAX_PREVIEW_BYTES) fail(scope, `preview.png too large (${size} bytes; max ${MAX_PREVIEW_BYTES})`);
    else ok(scope, `preview.png ${size} bytes`);
  }
}

console.log("");
if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log(`✓ all ${templates.length} template(s) valid`);
