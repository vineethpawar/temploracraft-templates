# Ledger

Academic long-form CV. Source Serif 4 body with a left-margin date
rail — every entry reads as a scholarly chronology. Oxblood accent
on the name, small-caps Source Sans 3 section headers.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Fonts**: Source Serif 4 + Source Sans 3 (both Google)
- **For**: Researchers, PhDs, MDs, policy folks, and senior ICs with 15+ years of experience. Optimized for CVs that get scanned by section, not by scroll.

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

## Signature moves

- **Left-margin date rail.** Each experience + education entry is a `flow-horizontal` section with a 92px fixed date column on the left and content flexing on the right. Reads like a scholarly timeline.
- **Oxblood name + section titles.** `#7A1F1F` — the university-red the entire academic tradition trained us to read as "credential". Body stays black.
- **Serif + sans pairing.** Source Serif 4 for prose (long-form readability), Source Sans 3 for meta (small-caps section titles + dates). No mono anywhere.
- **Round bullets `•`.** Long-form readers prefer conventional markers over trendy dashes/chevrons.
- **Semibold name, not bold.** Source Serif 4 at weight 400 (regular) at 28pt — signals confidence, not shouting.

## Notes vs shipped templates

- **Modern / Classic / Zurich / Broadsheet / Terminal** — none of them use a date rail. Ledger is the only template where dates live in a dedicated left column.
- **Classic** — Classic uses Playfair Display centered with heavy uppercase letterspacing. Ledger uses Source Serif 4 left-aligned with a subtler small-caps treatment.
- **Broadsheet** — Broadsheet is a sans/serif contrast with an ink-navy accent and no dividers. Ledger uses an oxblood accent, no dividers, and a date rail.

## ATS notes

Serif body + sans meta. Single column technically — the date rail is
a flex row with two children, not a table or a multi-column layout,
so modern parsers (Workday / Greenhouse / Lever) read children in
DOM order (date, content). Standard round `•` bullets are universally
supported. Section titles are literal words ("EXPERIENCE") not glyphs.
Long publication lists tend to trip character limits before parsing
limits — no format issue there.
