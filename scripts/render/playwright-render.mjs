/**
 * Playwright-based rasterizer. Renders a TemplateDoc in real headless
 * Chromium with real Google Fonts, waits for `document.fonts.ready`,
 * screenshots the page. Used as the high-fidelity fallback when the
 * satori render diverges too far from the intended design.
 *
 * Same PNG dimensions and content shape as the satori output so the
 * two are pixel-comparable.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { templateToHtml } from "./nodeToHtml.mjs";

/**
 * Render a template via Playwright and return a PNG Buffer.
 *
 * @param {object} doc         parsed TemplateDoc
 * @param {object} scope       ResumeData sample
 * @param {string} pageBg      page background (matches satori sniff)
 * @param {number} targetWidth downscaled thumbnail width (matches satori)
 * @param {import('playwright').Browser} [browser]  optional shared browser
 * @returns {Promise<Buffer>}  PNG bytes
 */
export async function renderTemplatePng(doc, scope, pageBg, targetWidth, browser) {
  const closeBrowser = !browser;
  const b = browser ?? (await chromium.launch());
  try {
    const ctx = await b.newContext({
      viewport: { width: doc.page.width, height: doc.page.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const html = templateToHtml(doc, scope, pageBg);
    // Write to a temp file and load via file:// — setContent leaves
    // the page at about:blank, and cross-origin @font-face fetches
    // (Google Fonts CDN) behave inconsistently from there. A real
    // page URL makes the browser treat font URLs as normal
    // cross-origin requests that document.fonts.ready + explicit
    // .load() actually wait on.
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tc-render-"));
    const tmpFile = path.join(tmpDir, `${doc.slug || "template"}.html`);
    fs.writeFileSync(tmpFile, html);
    await page.goto(pathToFileURL(tmpFile).href, { waitUntil: "networkidle" });
    // Explicitly request each declared font family so the browser
    // actually fetches + parses them (not just when they happen to
    // apply to visible text). Belt and suspenders.
    const families = (doc.fonts || []).filter((f) => f.source === "google").map((f) => f.family);
    await page.evaluate(async (fams) => {
      if (!document.fonts) return;
      await Promise.all(
        fams.flatMap((fam) => [400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 16px "${fam}"`))),
      );
      await document.fonts.ready;
    }, families);
    // Extra 200ms cushion: some browsers flush glyph rasterization
    // one frame after fonts.ready resolves.
    await page.waitForTimeout(200);
    const fullShot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: doc.page.width, height: doc.page.height },
    });
    await ctx.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // Downscale to targetWidth so the committed PNG matches the satori
    // output for pixelmatch comparison. We do this by rendering a tiny
    // scale page in the same browser instance and drawing the buffer
    // as a data URI — cheap and avoids pulling in sharp.
    const scaled = await downscalePngInBrowser(b, fullShot, doc.page.width, doc.page.height, targetWidth);
    return scaled;
  } finally {
    if (closeBrowser) await b.close();
  }
}

async function downscalePngInBrowser(browser, pngBuf, srcW, srcH, targetW) {
  const scale = targetW / srcW;
  const targetH = Math.round(srcH * scale);
  const dataUri = "data:image/png;base64," + pngBuf.toString("base64");
  const ctx = await browser.newContext({
    viewport: { width: targetW, height: targetH },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(
    `<!doctype html><html><body style="margin:0;padding:0"><img id="i" src="${dataUri}" style="display:block;width:${targetW}px;height:${targetH}px"></body></html>`,
    { waitUntil: "load" },
  );
  await page.waitForFunction(() => {
    const el = document.getElementById("i");
    return el && el.complete && el.naturalWidth > 0;
  });
  const shot = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: targetW, height: targetH },
  });
  await ctx.close();
  return shot;
}
