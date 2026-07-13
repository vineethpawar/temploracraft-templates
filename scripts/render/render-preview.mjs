#!/usr/bin/env node
/**
 * Render a preview.png for a template.json using satori + resvg.
 *
 * Usage:
 *   node scripts/render/render-preview.mjs [--slug modern] [--all]
 *
 * Reads templates/<domain>/<slug>/template.json, renders against the
 * stock ResumeData sample (scripts/render/sampleData.mjs), writes
 * preview.png next to the template. Deterministic — same inputs
 * always produce the same output.
 *
 * Font handling: satori needs the raw font bytes handed in, one entry
 * per family/weight the template references. We load all four of our
 * bundled TTFs and satori picks the right one at render time via CSS.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

import { templateToSatori } from "./nodeToSatori.mjs";
import { stockResume } from "./sampleData.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const FONT_DIR = path.join(__dirname, "fonts");
const TEMPLATE_ROOT = path.join(REPO_ROOT, "templates");

/* ─── fonts ─────────────────────────────────────────────── */

function loadFont(file, name, weight, style = "normal") {
  const full = path.join(FONT_DIR, file);
  if (!fs.existsSync(full)) {
    throw new Error(`font missing: ${full}`);
  }
  return { name, data: fs.readFileSync(full), weight, style };
}

const FONTS = [
  loadFont("Inter-400.woff",           "Inter",            400),
  loadFont("Inter-500.woff",           "Inter",            500),
  loadFont("Inter-600.woff",           "Inter",            600),
  loadFont("Inter-700.woff",           "Inter",            700),
  loadFont("Inter-800.woff",           "Inter",            800),
  loadFont("PlayfairDisplay-400.woff", "Playfair Display", 400),
  loadFont("PlayfairDisplay-600.woff", "Playfair Display", 600),
  loadFont("PlayfairDisplay-700.woff", "Playfair Display", 700),
  loadFont("IBMPlexSerif-400.woff",    "IBM Plex Serif",   400),
  loadFont("IBMPlexSerif-500.woff",    "IBM Plex Serif",   500),
  loadFont("IBMPlexSerif-700.woff",    "IBM Plex Serif",   700),
];

/* ─── background heuristic ──────────────────────────────── */

/**
 * Pick a page background for the preview. Templates don't declare a
 * page background in the schema (they draw one via a full-bleed rect
 * as needed), so we sniff the first rect at root level and fall back
 * to a warm cream. Keeps preview thumbnails from being a stark white
 * rectangle when the template is warmer.
 */
function pageBackground(doc) {
  const first = doc?.root?.children?.[0];
  if (first?.type === "rect" && typeof first.fill === "string") return first.fill;
  return "#FBF6F3";
}

/* ─── one template ──────────────────────────────────────── */

async function renderOne(templateJsonPath) {
  const doc = JSON.parse(fs.readFileSync(templateJsonPath, "utf8"));
  const outPath = path.join(path.dirname(templateJsonPath), "preview.png");

  const root = templateToSatori(doc, stockResume, pageBackground(doc));

  const svg = await satori(root, {
    width: doc.page.width,
    height: doc.page.height,
    fonts: FONTS,
    embedFont: true,
  });

  // Downscale on rasterization so the committed PNG is a reasonable
  // gallery thumbnail (~400 wide) rather than a full 816×1056 page.
  const targetWidth = 600;
  const resvg = new Resvg(svg, {
    background: pageBackground(doc),
    fitTo: { mode: "width", value: targetWidth },
    font: { loadSystemFonts: false },
  });
  const pngBuf = resvg.render().asPng();
  fs.writeFileSync(outPath, pngBuf);

  return { slug: doc.slug, outPath, bytes: pngBuf.length };
}

/* ─── discovery ─────────────────────────────────────────── */

function discoverTemplates(rootDir) {
  const out = [];
  for (const domain of fs.readdirSync(rootDir).sort()) {
    const domainDir = path.join(rootDir, domain);
    if (!fs.statSync(domainDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(domainDir).sort()) {
      const slugDir = path.join(domainDir, slug);
      const templateJson = path.join(slugDir, "template.json");
      if (fs.existsSync(templateJson)) out.push({ domain, slug, templateJson });
    }
  }
  return out;
}

/* ─── entrypoint ────────────────────────────────────────── */

function parseArgs(argv) {
  const args = { slug: null, all: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--slug") args.slug = argv[++i];
    else if (argv[i] === "--all") args.all = true;
  }
  if (!args.slug && !args.all) args.all = true;
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const all = discoverTemplates(TEMPLATE_ROOT);
  const targets = args.slug ? all.filter((t) => t.slug === args.slug) : all;
  if (targets.length === 0) {
    console.error(`no templates matched ${args.slug ? `slug=${args.slug}` : "(root scan)"}.`);
    process.exit(1);
  }
  for (const t of targets) {
    process.stdout.write(`rendering ${t.domain}/${t.slug} … `);
    try {
      const r = await renderOne(t.templateJson);
      console.log(`${r.bytes} bytes → ${path.relative(REPO_ROOT, r.outPath)}`);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
