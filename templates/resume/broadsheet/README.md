# Broadsheet

Editorial serif with a sans/serif contrast. Newsreader body under IBM
Plex Sans small-caps section titles, ink-navy name. Feels like a
masthead, not a form.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Fonts**: Newsreader + IBM Plex Sans (both Google)
- **For**: Senior operators, executives, lawyers, academics, editors — anyone whose CV should feel like a masthead.

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

## Signature moves

- **Ink-navy name.** `#1F2B4A` on cream — the only color anywhere on the page.
- **Sans/serif contrast.** Newsreader for the readable prose; IBM Plex Sans small-caps for the section titles. The contrast is the identity.
- **No dividers.** Section rhythm comes from spacing (28px gap between sections), not rules. Reads like a newspaper column.
- **Uppercase Plex Sans meta line.** Under every role: company · location · dates as one uppercased small-caps run. Doubles as an ATS-friendly canonical "company / date" line.
- **Guillemet bullets `»`.** Small typographic tell that signals "editorial" over "corporate".

## Notes vs shipped templates

- **Modern** — Modern uses Inter and mid-dot bullets. Broadsheet uses Newsreader and guillemets.
- **Classic** — Classic centers everything and uses Playfair Display. Broadsheet is left-aligned and uses Newsreader with a sans/serif contrast.
- **Zurich** — Zurich is pure monochrome sans with hairline rules. Broadsheet is warm cream with a navy accent and no rules.

## ATS notes

Two typefaces (Newsreader + IBM Plex Sans). Single column. Standard
section names. Guillemet `»` parses in modern ATS (Workday, Greenhouse,
Lever) but strips in legacy Taleo — swap to a hyphen in the schema
before publish if you're targeting an older pipeline.
