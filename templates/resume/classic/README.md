# Classic

Centered serif header, traditional resume rhythm. Playfair Display
for the name + section titles, IBM Plex Serif for body copy. Reads
well printed or ATS-scanned.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Fonts**: Playfair Display (Google), IBM Plex Serif (Google)

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

All fields resolved from the app's canonical [`ResumeData`](https://github.com/vineethpawar/temploracraft/blob/main/apps/web/src/domains/resume/schema.ts) type.

## Notes vs Modern

- **Header**: centered instead of left-aligned. Uppercase letter-spaced headline (SMALL CAPS feel).
- **Section titles**: centered, uppercase, letter-spaced 2px. No accent color — pure black — for a more formal read.
- **Experience bullets**: em-dash (`—`) marker instead of the mid-dot Modern uses. Small typographic tell that reinforces the "traditional" identity.
- **Summary**: centered — Modern left-aligns. Reads more like an epigraph.
- **No terracotta accent** anywhere. Classic keeps things monochrome for print/ATS compatibility.
