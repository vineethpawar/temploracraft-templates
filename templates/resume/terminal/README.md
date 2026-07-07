# Terminal

Config-file resume for engineers. IBM Plex Sans body with JetBrains
Mono section headers prefixed by `#`. Reads like a well-commented
dotfile; parses like a resume.

- **Author**: [Vineeth Pawar](https://vpawar.me) · [@vineethpawar](https://github.com/vineethpawar)
- **License**: MIT
- **Page**: US Letter (816 × 1056 @ 96 dpi)
- **Fonts**: IBM Plex Sans + JetBrains Mono (both Google)
- **For**: Software engineers, SREs, ML engineers, security folks — anyone posting on r/EngineeringResumes.

## Placeholders used

- `fullName`, `headline`, `email`, `phone`, `location`, `summary`
- `experience[]` — `title`, `company`, `location`, `startDate`, `endDate`, `bullets[]`
- `education[]` — `institution`, `degree`, `field`, `startYear`, `endYear`
- `skills[]`

## Signature moves

- **Config-file header.** Key-value pairs (`role : Staff SWE`, `email : …`) in JetBrains Mono. Signals "engineer" without cosplay.
- **`# section` prefix.** Every section header is `# experience`, `# education`, `# skills` in green mono. The mono is used sparingly — only where it earns its keep. Body prose stays Plex Sans for readability.
- **`[startDate → endDate]` date ranges.** Ranges in mono square brackets with a right arrow, colored the same forest green as the section prefixes. Semantic accent, not decorative.
- **`▸` chevron bullets.** Nested-item marker without shouting.
- **Skills in mono.** The one place the mono earns its full read — token-style listing of technologies.
- **Green `#2F855A` accent** on section prefixes + date ranges only. Never in body prose.

## Notes vs shipped templates

- **Modern** — All Inter, sentence-case sections, terracotta. Terminal is a sans/mono pairing with a green semantic accent.
- **Classic** — Centered Playfair serif. Terminal is left-aligned sans + mono. No overlap.
- **Zurich** — Monochrome grid. Terminal has color (green) and a config-file feel.
- **Broadsheet** — Editorial serif. Terminal is engineered-feeling with mono accents.

## ATS notes

Two typefaces (Plex Sans body + JetBrains Mono accents). Single column.
Section names are visually rendered as `# experience` but the underlying
semantic text is "Experience" — parsers read the string; the `#` is
just a visual prefix. `▸` (chevron) and `→` (arrow) are non-ASCII —
export path substitutes `-` and `to` for legacy Taleo pipelines.
Green accent is CSS color only, not a color-encoded value; converts
to black in ATS plain-text extraction.
