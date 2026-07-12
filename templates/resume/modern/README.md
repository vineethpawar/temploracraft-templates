# Modern

Clean, ATS-friendly resume with a terracotta accent (`#E85D3A`). Bold
34px display name, muted contact strip separated by center-dots, and
three tight sections (Experience, Education, Skills) with uppercase
letter-spaced eyebrow labels.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Fonts**: Inter (system)

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

All fields resolved from the app's canonical [`ResumeData`](https://github.com/vineethpawar/temploracraft/blob/main/apps/web/src/domains/resume/schema.ts) type.

## Notes for authors reading this as reference

- The header uses a `text` node with `content: "{{email}}  ·  {{phone}}  ·  {{location}}"` so missing fields collapse without leaving orphan separators.
- Experience uses a `repeater` with a `bullet-list` inside — bullets render as `<ul>` in HTML and `· ` in PDF.
- Skills uses `bullet-list` with `layout: "inline"` to render as one paragraph joined by `  ·  `.
- Every optional section carries `visibleIf` — nothing renders if the user hasn't filled that block.
