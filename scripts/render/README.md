# Preview rasterizer

Turns `template.json` → `preview.png` next to it. Used both locally
(when authoring a new template) and by CI (`.github/workflows/render.yml`)
which regenerates the PNG on every push that touches a `template.json`.

## Local usage

```bash
npm run render                    # all templates
npm run render -- --slug modern   # single slug
```

The output PNG (~600 wide) gets written to
`templates/<domain>/<slug>/preview.png` and is committed alongside the
JSON. The gallery in the main app reads it straight from GitHub raw at
`raw.githubusercontent.com/vineethpawar/temploracraft-templates/main/templates/<domain>/<slug>/preview.png`.

## How it works

1. `nodeToSatori.mjs` walks the `TemplateDoc` tree and emits a
   satori-compatible React-element tree. Layout mapping: `flow-vertical`
   → flex column, `flow-horizontal` → flex row, padding + gap +
   justify + align translate verbatim to flexbox properties. Text
   nodes support `{{path}}` interpolation from the current scope, with
   missing-value + adjacent-separator collapsing.
2. `sampleData.mjs` provides a stock `ResumeData` — a realistic profile
   ("Sarah Aldridge") used across all previews so cards are comparable.
3. `render-preview.mjs` glues the two together: satori renders the tree
   to SVG, then `@resvg/resvg-js` rasterizes it to PNG at ~600 wide.

## Fonts

Static (non-variable) `.woff` files live in `scripts/render/fonts/`
because satori's opentype fork can't parse variable-font `fvar` tables.
They're copied from `@fontsource/*` at install time — Inter, Playfair
Display, IBM Plex Serif in the exact weight subset the current
templates use. Add new weights to `render-preview.mjs` when a template
introduces them.

## Two engines, auto by default

`--engine=auto` (the default and what CI uses) runs both engines on
the first render, pixel-diffs them, and keeps whichever is faithful
enough. The decision is cached in a sidecar file so subsequent runs
against the same `template.json` content hash only invoke the
chosen engine.

| Engine | Speed | Fidelity | When it wins |
|---|---|---|---|
| `satori` | ~200ms | Flexbox subset, static woff2 fonts, no transforms / filters | Simple resume-style layouts (Modern, Classic) — most of the marketplace |
| `playwright` | ~2s + 200MB Chromium | Real browser, real Google Fonts (variable + real kerning tables) | Templates with letter-spaced display headlines, glyph-hinted body copy, or anything with CSS satori doesn't implement |

Threshold: 3% differing pixels (pixelmatch at threshold 0.15). Under
that, satori wins on cost. Over, we hand it to Playwright.

**Sidecar format** (`templates/<domain>/<slug>/_render.json`):

```json
{
  "templateHash": "sha256:abc…",
  "engine": "satori" | "playwright",
  "diffRatio": 0.0299,
  "note": "…"
}
```

If `template.json` changes, the hash mismatch invalidates the cache
and the next render re-runs both engines.

## Manual overrides

- `--engine=satori` — force satori even if the sidecar says
  playwright. Useful when debugging satori regressions locally.
- `--engine=playwright` — force headless-browser render. Useful when
  authoring a new template that leans on features you know satori
  can't do.
