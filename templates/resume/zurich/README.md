# Zurich

Swiss-grid single column with hairline rules and small-caps section
headers. One typeface throughout — the discipline is the point.
Reads like a specimen; parses like a spreadsheet.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Font**: Inter Tight (Google)
- **For**: Designers, PMs, consultants — anyone who wants to signal taste through restraint.

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

All fields resolved from the app's canonical [`ResumeData`](https://github.com/vineethpawar/temploracraft/blob/main/apps/web/src/domains/resume/schema.ts).

## Signature moves

- **Header row.** Name and headline flush-left; contact strip flush-right on the same baseline. `flex-direction: row` + `justify-content: space-between` gets it in one line.
- **Hairline rules.** Every section title sits over a 1px black rule that spans the full column width. The rule is a divider node, not a text underline — clean at every zoom.
- **Small-caps section titles.** Inter Tight 10pt semibold, uppercase, letter-spacing +2.8. Tiny by convention; the rule carries the weight.
- **Em-dash bullets.** Not the mid-dot Modern uses, not the bare-indent Broadsheet prefers. The em-dash tells the reader "this is a nested item" without shouting.
- **Right-aligned dates.** Every experience + education entry pins dates on the same baseline as the role/institution using a nested `flow-horizontal` with `justify: between`.

## Notes vs shipped templates

- **Modern** — Modern is warm (terracotta), left-aligned, sentence-case sections. Zurich is cold (pure black), grid-aligned, small-caps sections. Same content, different personality.
- **Classic** — Classic is centered serif with letter-spaced uppercase titles. Zurich is left-aligned sans with hairline rules under smaller uppercase titles. Different rhythm.

## ATS notes

Single typeface (Inter Tight). Single column. Standard section names
(Experience, Education, Skills). Em-dash bullet is non-ASCII but
Workday / Greenhouse / Lever all handle it in 2026. If exporting for
a legacy Taleo / iCIMS pipeline, swap the bullet to a hyphen in the
schema before publish.
