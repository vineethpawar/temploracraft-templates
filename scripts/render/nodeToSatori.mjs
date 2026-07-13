/**
 * TemplateDoc node → satori element tree.
 *
 * Satori accepts React-ish objects of shape { type, props: { style, children } }.
 * We build those directly (no JSX build in this repo).
 *
 * Layout mapping:
 *   flow-vertical    → display:flex; flexDirection:column
 *   flow-horizontal  → display:flex; flexDirection:row
 *   absolute         → we translate to relative flow — pure absolute layout
 *                      doesn't come up in the current templates, and the
 *                      author tool always exports flow-* for sections that
 *                      carry meaningful children.
 *
 * Interpolation:
 *   TextNode.content supports `{{path}}` from the current scope. When a
 *   token resolves to "" or undefined we collapse the neighbouring
 *   separators so a contact strip like "{{email}} · {{phone}}" reads
 *   cleanly even when phone is missing.
 */

/* ─── scope + interpolation ─────────────────────────────── */

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

/**
 * Interpolate `{{path}}` tokens. Missing tokens collapse together with
 * any adjacent separator (whitespace, " · ", " — ", " | ") so the
 * remaining text still reads naturally.
 */
function interpolate(content, scope) {
  const raw = String(content ?? "");
  // Replace tokens with a sentinel that we can then clean up.
  const SENTINEL = "MISSING";
  const withTokens = raw.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, path) => {
    const v = resolvePath(scope, path);
    return isFalsy(v) ? SENTINEL : String(v);
  });
  // Collapse a missing token together with a preceding OR following
  // separator run.
  const cleaned = withTokens
    .replace(new RegExp(`\\s*(?:[·—\\-|])\\s*${SENTINEL}`, "g"), "")
    .replace(new RegExp(`${SENTINEL}\\s*(?:[·—\\-|])\\s*`, "g"), "")
    .replace(new RegExp(SENTINEL, "g"), "");
  return cleaned.replace(/\s{2,}/g, " ").trim();
}

/* ─── style helpers ─────────────────────────────────────── */

function typographyToStyle(t) {
  if (!t) return {};
  const s = {
    fontFamily: t.fontFamily,
    fontWeight: t.fontWeight,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    color: t.color,
    textAlign: t.align,
  };
  if (typeof t.letterSpacing === "number") s.letterSpacing = t.letterSpacing;
  if (t.transform === "uppercase") s.textTransform = "uppercase";
  if (t.transform === "lowercase") s.textTransform = "lowercase";
  return s;
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

function sectionContainerStyle(section) {
  const s = { display: "flex" };
  const layout = section.layout || "flow-vertical";
  s.flexDirection = layout === "flow-horizontal" ? "row" : "column";
  if (typeof section.gap === "number") s.gap = section.gap;
  if (section.padding && section.padding.length === 4) {
    const [t, r, b, l] = section.padding;
    s.padding = `${t}px ${r}px ${b}px ${l}px`;
  }
  if (section.justify) s.justifyContent = JUSTIFY_MAP[section.justify] ?? "flex-start";
  if (section.align) s.alignItems = ALIGN_MAP[section.align] ?? "stretch";
  // Section width/height only apply when authored; otherwise the
  // parent flex distributes.
  if (typeof section.width === "number" && section.width > 0) s.width = section.width;
  if (typeof section.height === "number" && section.height > 0) s.height = section.height;
  return s;
}

/* ─── element factory ───────────────────────────────────── */

function el(type, style, children) {
  return { type, props: { style, children } };
}

const TEXTALIGN_TO_JUSTIFY = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  justify: "flex-start",
};

function textEl(style, text) {
  // Satori's quirk: `text-align` on a flex parent doesn't align the
  // inline-string child predictably. What DOES work is:
  //   1. Outer wrapper takes full width (alignSelf: stretch) so there
  //      is somewhere to align *into*.
  //   2. Outer wrapper is flex-row + justifyContent derived from
  //      textAlign — this positions the inner text block within the
  //      row for single-line text.
  //   3. `textAlign` on the inner block still handles multi-line
  //      wrapping (a wrapped run of text uses textAlign to align its
  //      own lines).
  // The two layers together get single-line + multi-line correct
  // without needing a "am I wrapping?" measurement.
  const textAlign = style.textAlign || "left";
  const outer = {
    display: "flex",
    alignSelf: "stretch",
    justifyContent: TEXTALIGN_TO_JUSTIFY[textAlign] ?? "flex-start",
  };
  const inner = { display: "flex", ...style };
  return el("div", outer, [el("div", inner, String(text ?? ""))]);
}

/* ─── node dispatch ─────────────────────────────────────── */

function renderNode(node, scope) {
  if (!node) return null;
  if (node.visibleIf) {
    const v = resolvePath(scope, node.visibleIf);
    if (isFalsy(v)) return null;
  }

  switch (node.type) {
    case "text": {
      const text = interpolate(node.content, scope);
      if (!text) return null;
      return textEl(typographyToStyle(node.style), text);
    }
    case "placeholder-text": {
      const v = resolvePath(scope, node.bind);
      const text = isFalsy(v) ? (node.fallback ?? "") : String(v);
      if (!text) return null;
      return textEl(typographyToStyle(node.style), text);
    }
    case "divider": {
      return el(
        "div",
        {
          display: "flex",
          width: "100%",
          height: node.thickness ?? 1,
          backgroundColor: node.color ?? "#000",
          marginTop: 4,
          marginBottom: 4,
        },
        [],
      );
    }
    case "rect": {
      const s = {
        display: "flex",
        width: node.width ?? "100%",
        height: node.height ?? 12,
        backgroundColor: node.fill,
      };
      if (typeof node.radius === "number") s.borderRadius = node.radius;
      if (node.stroke && node.strokeWidth) {
        s.border = `${node.strokeWidth}px solid ${node.stroke}`;
      }
      return el("div", s, []);
    }
    case "bullet-list": {
      const list = resolvePath(scope, node.bind);
      if (!Array.isArray(list) || list.length === 0) return null;
      const style = typographyToStyle(node.style);
      const marker = node.bulletChar ?? "•";
      if (node.layout === "inline") {
        // Join items into a single wrapping line with the marker as
        // a separator. Satori doesn't wrap arbitrary inline children
        // in a flex row cleanly; treat it as one big text block.
        const text = list.filter(Boolean).map(String).join(marker);
        return textEl(style, text);
      }
      // vertical (default)
      const gap = typeof node.gap === "number" ? node.gap : 2;
      const items = list.filter(Boolean).map((line, i) =>
        el(
          "div",
          { display: "flex", flexDirection: "row", gap: 6, ...style },
          [
            el("div", { display: "flex", flexShrink: 0 }, marker.trim() || "•"),
            el(
              "div",
              { display: "flex", flexGrow: 1, flexDirection: "column" },
              String(line),
            ),
          ],
        ),
      );
      // Insert vertical gaps between bullets by nesting them in a
      // flex column with `gap`.
      return el(
        "div",
        { display: "flex", flexDirection: "column", gap },
        items,
      );
    }
    case "section": {
      const kids = (node.children || [])
        .map((c) => renderNode(c, scope))
        .filter(Boolean);
      if (kids.length === 0) return null;
      return el("div", sectionContainerStyle(node), kids);
    }
    case "repeater": {
      const arr = resolvePath(scope, node.bind);
      if (!Array.isArray(arr) || arr.length === 0) return null;
      const layout = node.layout || "flow-vertical";
      const containerStyle = {
        display: "flex",
        flexDirection: layout === "flow-horizontal" ? "row" : "column",
      };
      if (typeof node.gap === "number") containerStyle.gap = node.gap;
      const kids = arr
        .map((row) => renderNode(node.template, row))
        .filter(Boolean);
      if (kids.length === 0) return null;
      return el("div", containerStyle, kids);
    }
    default:
      return null;
  }
}

/** Public entry: build the root element for a TemplateDoc + data scope. */
export function templateToSatori(doc, scope, pageBackground = "#FFFFFF") {
  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    width: doc.page.width,
    height: doc.page.height,
    backgroundColor: pageBackground,
    color: "#111",
    fontFamily: "Inter",
    fontSize: 12,
  };
  const rootEl = renderNode(doc.root, scope);
  const children = rootEl ? [rootEl] : [];
  return el("div", pageStyle, children);
}
