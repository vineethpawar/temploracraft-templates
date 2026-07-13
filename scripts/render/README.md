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

## Caveats + Playwright fallback

Satori is a flexbox subset and doesn't do everything a browser does.
Known gaps for our templates: no arbitrary CSS transforms, no shadow /
filter, no per-glyph kerning tables (letter-spacing only). For templates
that need pixel-faithful renders — anything with a hand-tuned display
face or overlapping elements — the plan is a Playwright fallback that
mounts the same React canvas the author sees and screenshots the
Konva stage. Not built yet; tracked as the T-7 followup.
