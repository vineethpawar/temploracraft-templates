# Meridian

Contemporary Manrope with a saturated teal accent. Heavy uppercase
section titles, pipe-separated meta, bare-indent bullets. The
polished mid-career workhorse — not designer, not corporate, just
deliberate.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Font**: Manrope (Google)
- **For**: Mid-career professionals in marketing, ops, finance, HR, healthcare admin — the broad "polished but not designer" middle where Novoresume and Kickresume live.

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

## Signature moves

- **Teal accent** `#0E7C86`. Used only on the headline directly under the name + on uppercase section titles. Body text stays slate `#1F2937`; muted meta at `#6B7280`.
- **Heavy uppercase section titles.** Manrope 700 at 11pt, letter-spacing +2.4, in the teal accent. Big enough to be anchors as you scan.
- **Pipe-separated metadata.** `email | phone | location` in the header, `company | location | dates` under each role. Modern uses mid-dots, Classic uses em-dashes — pipes are Meridian's tell.
- **Bare-indent bullets.** No marker, no character. The role title carries the visual weight; the bullets are just indented text below. Signals modern-editorial confidence.
- **Skills as pipe-joined inline.** Consistent with the meta line style throughout.

## Notes vs shipped templates

- **Modern** — Modern is Inter with terracotta + mid-dots. Meridian is Manrope with teal + pipes. Fully different accent color and typography.
- **Classic** — Classic centers Playfair Display serif. Meridian is left-aligned Manrope sans. Zero visual overlap.
- **Zurich** — Zurich is monochrome sans with hairline rules under section titles. Meridian has color (teal) and no rules.
- **Broadsheet** — Broadsheet is a sans/serif pairing with an ink-navy accent. Meridian is single-family sans with a teal accent.
- **Terminal** — Terminal is Plex Sans + JetBrains Mono with a `# section` prefix. Meridian is pure Manrope with heavy uppercase.
- **Ledger** — Ledger uses a left-margin date rail with oxblood accent. Meridian has no rail, teal accent.

## ATS notes

Single typeface, single column, standard section names. Pipe `|` is
ASCII-safe and universally parsed. Em-dash `—` in date ranges is
non-ASCII but modern ATS (Workday, Greenhouse, Lever) handles it in
2026. Bare bullets (space character as marker) are safe because the
list layout is still `<li>`-shaped semantically — ATS treats each
bullet as a discrete line item.
