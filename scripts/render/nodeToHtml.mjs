/**
 * TemplateDoc node → HTML string. Mirrors nodeToSatori.mjs but emits
 * real CSS the browser handles: real Google Fonts (no static woff
 * limits), real letter-spacing metrics, real font kerning, real
 * gradients / shadows / transforms if a future template uses them.
 *
 * Used by the Playwright rasterizer as the "high-fidelity" fallback
 * when satori's flexbox subset drifts too far from the intended
 * design.
 */

/* ─── interpolation (same rules as nodeToSatori) ────────── */

function resolvePath(scope, path) {
  if (!scope || !path) return undefined;
  const parts = String(path).split(".");
  let cur = scope;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function isFalsy(v) {
  if (v == null) return true;
  if (v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function interpolate(content, scope) {
  const raw = String(content ?? "");
  const SENTINEL = "\x1e";
  const withTokens = raw.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, path) => {
    const v = resolvePath(scope, path);
    return isFalsy(v) ? SENTINEL : String(v);
  });
  const cleaned = withTokens
    .replace(new RegExp(`\\s*(?:[·—\\-|])\\s*${SENTINEL}`, "g"), "")
    .replace(new RegExp(`${SENTINEL}\\s*(?:[·—\\-|])\\s*`, "g"), "")
    .replace(new RegExp(SENTINEL, "g"), "");
  return cleaned.replace(/\s{2,}/g, " ").trim();
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── style helpers ─────────────────────────────────────── */

function typographyStyle(t) {
  if (!t) return "";
  const parts = [
    t.fontFamily && `font-family: ${cssFontFamily(t.fontFamily)}`,
    t.fontWeight && `font-weight: ${t.fontWeight}`,
    t.fontSize && `font-size: ${t.fontSize}px`,
    t.lineHeight && `line-height: ${t.lineHeight}`,
    typeof t.letterSpacing === "number" && `letter-spacing: ${t.letterSpacing}px`,
    t.color && `color: ${t.color}`,
    t.align && `text-align: ${t.align}`,
    t.transform && `text-transform: ${t.transform}`,
  ].filter(Boolean);
  return parts.join("; ");
}

function cssFontFamily(family) {
  // Wrap multi-word families in single quotes — the whole style string
  // is emitted inside style="..." on an HTML element, so double
  // quotes here would close the attribute and break every subsequent
  // property. Single quotes are valid CSS-side and safe HTML-side.
  const needs = /\s/.test(family);
  const wrapped = needs ? `'${family}'` : family;
  return `${wrapped}, ui-sans-serif, system-ui, sans-serif`;
}

const JUSTIFY_MAP = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

const ALIGN_MAP = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  baseline: "baseline",
  stretch: "stretch",
};

function sectionStyle(section) {
  const parts = ["display: flex"];
  const layout = section.layout || "flow-vertical";
  parts.push(`flex-direction: ${layout === "flow-horizontal" ? "row" : "column"}`);
  if (typeof section.gap === "number") parts.push(`gap: ${section.gap}px`);
  if (section.padding && section.padding.length === 4) {
    const [t, r, b, l] = section.padding;
    parts.push(`padding: ${t}px ${r}px ${b}px ${l}px`);
  }
  if (section.justify) parts.push(`justify-content: ${JUSTIFY_MAP[section.justify] ?? "flex-start"}`);
  if (section.align) parts.push(`align-items: ${ALIGN_MAP[section.align] ?? "stretch"}`);
  if (typeof section.width === "number" && section.width > 0) parts.push(`width: ${section.width}px`);
  if (typeof section.height === "number" && section.height > 0) parts.push(`height: ${section.height}px`);
  return parts.join("; ");
}

/* ─── node dispatch ─────────────────────────────────────── */

function textDiv(styleStr, text) {
  // Wrap in a full-width flex row so text-align works even when the
  // parent section is centered / flex-column.
  return `<div style="align-self: stretch;"><div style="${styleStr}">${escapeHtml(text)}</div></div>`;
}

function renderNode(node, scope) {
  if (!node) return "";
  if (node.visibleIf) {
    const v = resolvePath(scope, node.visibleIf);
    if (isFalsy(v)) return "";
  }

  switch (node.type) {
    case "text": {
      const text = interpolate(node.content, scope);
      if (!text) return "";
      return textDiv(typographyStyle(node.style), text);
    }
    case "placeholder-text": {
      const v = resolvePath(scope, node.bind);
      const text = isFalsy(v) ? (node.fallback ?? "") : String(v);
      if (!text) return "";
      return textDiv(typographyStyle(node.style), text);
    }
    case "divider": {
      const thick = node.thickness ?? 1;
      const color = node.color ?? "#000";
      return `<div style="align-self: stretch; height: ${thick}px; background: ${color}; margin: 4px 0"></div>`;
    }
    case "rect": {
      const parts = [
        "display: flex",
        `width: ${typeof node.width === "number" ? `${node.width}px` : "100%"}`,
        `height: ${typeof node.height === "number" ? `${node.height}px` : "12px"}`,
        `background: ${node.fill}`,
      ];
      if (typeof node.radius === "number") parts.push(`border-radius: ${node.radius}px`);
      if (node.stroke && node.strokeWidth) {
        parts.push(`border: ${node.strokeWidth}px solid ${node.stroke}`);
      }
      return `<div style="${parts.join("; ")}"></div>`;
    }
    case "bullet-list": {
      const list = resolvePath(scope, node.bind);
      if (!Array.isArray(list) || list.length === 0) return "";
      const style = typographyStyle(node.style);
      const marker = node.bulletChar ?? "•";
      if (node.layout === "inline") {
        const text = list.filter(Boolean).map(String).join(marker);
        return textDiv(style, text);
      }
      const gap = typeof node.gap === "number" ? node.gap : 2;
      const rows = list.filter(Boolean).map((line) =>
        `<div style="display: flex; gap: 6px; ${style}">` +
          `<div style="flex-shrink: 0">${escapeHtml(marker.trim() || "•")}</div>` +
          `<div>${escapeHtml(String(line))}</div>` +
        `</div>`
      );
      return `<div style="display: flex; flex-direction: column; gap: ${gap}px; align-self: stretch">${rows.join("")}</div>`;
    }
    case "section": {
      const kids = (node.children || [])
        .map((c) => renderNode(c, scope))
        .filter(Boolean);
      if (kids.length === 0) return "";
      return `<div style="${sectionStyle(node)}">${kids.join("")}</div>`;
    }
    case "repeater": {
      const arr = resolvePath(scope, node.bind);
      if (!Array.isArray(arr) || arr.length === 0) return "";
      const layout = node.layout || "flow-vertical";
      const parts = ["display: flex", `flex-direction: ${layout === "flow-horizontal" ? "row" : "column"}`, "align-self: stretch"];
      if (typeof node.gap === "number") parts.push(`gap: ${node.gap}px`);
      const kids = arr
        .map((row) => renderNode(node.template, row))
        .filter(Boolean);
      if (kids.length === 0) return "";
      return `<div style="${parts.join("; ")}">${kids.join("")}</div>`;
    }
    default:
      return "";
  }
}

/**
 * Build a self-contained HTML document. Google Fonts are loaded via
 * <link> tags for every family listed in doc.fonts (source: "google").
 * Playwright waits on document.fonts.ready before screenshotting.
 */
export function templateToHtml(doc, scope, pageBackground = "#FFFFFF") {
  const googleFamilies = (doc.fonts || [])
    .filter((f) => f.source === "google")
    .map((f) => {
      const weights = (f.weights || [400]).join(";");
      return `family=${encodeURIComponent(f.family).replace(/%20/g, "+")}:wght@${weights}`;
    });

  const googleLink = googleFamilies.length
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${googleFamilies.join("&")}&display=block">`
    : "";

  const rootHtml = renderNode(doc.root, scope);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(doc.name || doc.slug)}</title>
${googleLink}
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: ${doc.page.width}px;
    height: ${doc.page.height}px;
    background: ${pageBackground};
    color: #111;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
  }
  #page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>
<div id="page">${rootHtml}</div>
</body>
</html>`;
}
