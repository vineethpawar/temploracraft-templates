#!/usr/bin/env node
/**
 * Render a preview.png for a template.json.
 *
 * Two engines:
 *   - satori (default): cheap flexbox → SVG → PNG. Fast, no Chromium.
 *   - playwright:        headless real browser with real Google Fonts.
 *                        Faithful to the browser's rendering, slower.
 *
 * Auto mode (--engine=auto, the workflow default) runs both, compares
 * the pixels, and keeps whichever passes the threshold — caches the
 * decision in `_render.json` next to the template so future renders
 * with the same content hash only run the chosen engine.
 *
 * Usage:
 *   node scripts/render/render-preview.mjs [--slug modern] [--all]
 *                                          [--engine=auto|satori|playwright]
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { chromium } from "playwright";

import { templateToSatori } from "./nodeToSatori.mjs";
import { renderTemplatePng } from "./playwright-render.mjs";
import { stockResume } from "./sampleData.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const FONT_DIR = path.join(__dirname, "fonts");
const TEMPLATE_ROOT = path.join(REPO_ROOT, "templates");

const TARGET_WIDTH = 600;

/**
 * Above this fraction of differing pixels, satori and playwright have
 * diverged enough that we trust playwright. Tuned to accept small
 * text-anti-aliasing differences (which are unavoidable between the
 * two rasterizers) but flag layout drift, missing letter-spacing,
 * dropped glyphs, or wrong colors.
 */
const DIFF_THRESHOLD = 0.03;

/* ─── fonts ─────────────────────────────────────────────── */

function loadFont(file, name, weight, style = "normal") {
  const full = path.join(FONT_DIR, file);
  if (!fs.existsSync(full)) throw new Error(`font missing: ${full}`);
  return { name, data: fs.readFileSync(full), weight, style };
}

const FONTS = [
  loadFont("Inter-400.woff",           "Inter",            400),
  loadFont("Inter-500.woff",           "Inter",            500),
  loadFont("Inter-600.woff",           "Inter",            600),
  loadFont("Inter-700.woff",           "Inter",            700),
  loadFont("Inter-800.woff",           "Inter",            800),
  loadFont("InterTight-400.woff",      "Inter Tight",      400),
  loadFont("InterTight-500.woff",      "Inter Tight",      500),
  loadFont("InterTight-600.woff",      "Inter Tight",      600),
  loadFont("PlayfairDisplay-400.woff", "Playfair Display", 400),
  loadFont("PlayfairDisplay-600.woff", "Playfair Display", 600),
  loadFont("PlayfairDisplay-700.woff", "Playfair Display", 700),
  loadFont("IBMPlexSerif-400.woff",    "IBM Plex Serif",   400),
  loadFont("IBMPlexSerif-500.woff",    "IBM Plex Serif",   500),
  loadFont("IBMPlexSerif-700.woff",    "IBM Plex Serif",   700),
  loadFont("IBMPlexSans-400.woff",     "IBM Plex Sans",    400),
  loadFont("IBMPlexSans-500.woff",     "IBM Plex Sans",    500),
  loadFont("IBMPlexSans-600.woff",     "IBM Plex Sans",    600),
  loadFont("Newsreader-400.woff",      "Newsreader",       400),
  loadFont("Newsreader-600.woff",      "Newsreader",       600),
  loadFont("Newsreader-700.woff",      "Newsreader",       700),
  loadFont("JetBrainsMono-400.woff",   "JetBrains Mono",   400),
  loadFont("JetBrainsMono-500.woff",   "JetBrains Mono",   500),
  loadFont("JetBrainsMono-600.woff",   "JetBrains Mono",   600),
];

/* ─── page-background heuristic (shared by both engines) ─ */

function pageBackground(doc) {
  const first = doc?.root?.children?.[0];
  if (first?.type === "rect" && typeof first.fill === "string") return first.fill;
  return "#FBF6F3";
}

/* ─── engines ───────────────────────────────────────────── */

async function renderSatori(doc) {
  const root = templateToSatori(doc, stockResume, pageBackground(doc));
  const svg = await satori(root, {
    width: doc.page.width,
    height: doc.page.height,
    fonts: FONTS,
    embedFont: true,
  });
  const resvg = new Resvg(svg, {
    background: pageBackground(doc),
    fitTo: { mode: "width", value: TARGET_WIDTH },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

async function renderPlaywright(doc, browser) {
  return renderTemplatePng(doc, stockResume, pageBackground(doc), TARGET_WIDTH, browser);
}

/* ─── diff ──────────────────────────────────────────────── */

/**
 * Return the fraction of pixels that differ (0…1) between two PNG
 * buffers. If dimensions differ we treat the pair as maximally
 * different (1.0) so the caller falls through to playwright.
 */
function pngDiff(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  if (a.width !== b.width || a.height !== b.height) return 1;
  const total = a.width * a.height;
  const out = new PNG({ width: a.width, height: a.height });
  const differing = pixelmatch(a.data, b.data, out.data, a.width, a.height, {
    threshold: 0.15, // per-pixel color-distance tolerance (0..1)
  });
  return differing / total;
}

/* ─── sidecar cache ─────────────────────────────────────── */

function hashTemplate(templateJsonPath) {
  const bytes = fs.readFileSync(templateJsonPath);
  return "sha256:" + crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 32);
}

function readCache(sidecarPath) {
  if (!fs.existsSync(sidecarPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(sidecarPath, "utf8"));
  } catch {
    return null;
  }
}

function writeCache(sidecarPath, entry) {
  fs.writeFileSync(sidecarPath, JSON.stringify(entry, null, 2) + "\n");
}

/* ─── one template ──────────────────────────────────────── */

async function renderOne(templateJsonPath, engine, sharedBrowser) {
  const doc = JSON.parse(fs.readFileSync(templateJsonPath, "utf8"));
  const dir = path.dirname(templateJsonPath);
  const outPath = path.join(dir, "preview.png");
  const sidecarPath = path.join(dir, "_render.json");
  const templateHash = hashTemplate(templateJsonPath);

  // --engine=auto with a matching cache → skip diff, just run the
  // cached engine.
  if (engine === "auto") {
    const cache = readCache(sidecarPath);
    if (cache && cache.templateHash === templateHash && (cache.engine === "satori" || cache.engine === "playwright")) {
      const buf = cache.engine === "satori"
        ? await renderSatori(doc)
        : await renderPlaywright(doc, sharedBrowser);
      fs.writeFileSync(outPath, buf);
      return { slug: doc.slug, engine: cache.engine, cached: true, diffRatio: cache.diffRatio, bytes: buf.length, outPath };
    }
    // No cache or stale — run both, decide, write cache.
    const [satBuf, playBuf] = await Promise.all([renderSatori(doc), renderPlaywright(doc, sharedBrowser)]);
    const ratio = pngDiff(satBuf, playBuf);
    const chosen = ratio > DIFF_THRESHOLD ? "playwright" : "satori";
    const buf = chosen === "satori" ? satBuf : playBuf;
    fs.writeFileSync(outPath, buf);
    writeCache(sidecarPath, {
      templateHash,
      engine: chosen,
      diffRatio: Number(ratio.toFixed(4)),
      note:
        chosen === "playwright"
          ? "satori diverged past threshold; using headless browser render."
          : "satori render within tolerance of headless browser; used for speed.",
    });
    return { slug: doc.slug, engine: chosen, cached: false, diffRatio: ratio, bytes: buf.length, outPath };
  }

  if (engine === "playwright") {
    const buf = await renderPlaywright(doc, sharedBrowser);
    fs.writeFileSync(outPath, buf);
    return { slug: doc.slug, engine: "playwright", cached: false, diffRatio: null, bytes: buf.length, outPath };
  }

  // default: satori
  const buf = await renderSatori(doc);
  fs.writeFileSync(outPath, buf);
  return { slug: doc.slug, engine: "satori", cached: false, diffRatio: null, bytes: buf.length, outPath };
}

/* ─── discovery + CLI ───────────────────────────────────── */

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

function parseArgs(argv) {
  const args = { slug: null, all: false, engine: "auto" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") args.slug = argv[++i];
    else if (a === "--all") args.all = true;
    else if (a.startsWith("--engine=")) args.engine = a.slice("--engine=".length);
    else if (a === "--engine") args.engine = argv[++i];
  }
  if (!args.slug && !args.all) args.all = true;
  if (!["auto", "satori", "playwright"].includes(args.engine)) {
    throw new Error(`invalid --engine=${args.engine}; expected auto|satori|playwright`);
  }
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

  // Boot a single Chromium once and share it across templates when
  // Playwright is potentially involved (auto or playwright).
  const needsBrowser = args.engine === "auto" || args.engine === "playwright";
  const browser = needsBrowser ? await chromium.launch() : null;

  try {
    for (const t of targets) {
      process.stdout.write(`rendering ${t.domain}/${t.slug} (engine=${args.engine}) … `);
      try {
        const r = await renderOne(t.templateJson, args.engine, browser);
        const diff = r.diffRatio != null ? ` diff=${(r.diffRatio * 100).toFixed(2)}%` : "";
        const cached = r.cached ? " (cached)" : "";
        console.log(`${r.engine}${cached}${diff} → ${path.relative(REPO_ROOT, r.outPath)} (${r.bytes} bytes)`);
      } catch (err) {
        console.error(`FAILED: ${err.message}`);
        console.error(err.stack);
        process.exitCode = 1;
      }
    }
  } finally {
    if (browser) await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
