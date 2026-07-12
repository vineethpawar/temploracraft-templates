# temploracraft-templates

Open-source marketplace of resume templates for [temploracraft.com](https://temploracraft.com).

Every template in this repo is:

- **MIT-licensed**, attributed to its author, free forever
- Designed in the [temploracraft canvas author tool](https://app.temploracraft.com/author/resume/new) — no CLI required
- Submitted as a pull request (via the tool's built-in Publish flow or by hand)
- Consumed by the main app as the `@temploracraft/templates` npm package

## Contribute a template

The friendliest path is the one built into the app:

1. Open [app.temploracraft.com/templates](https://app.temploracraft.com/templates) → **Contribute a template**.
2. Design your template in the canvas editor.
3. Click **Publish**. Sign in with GitHub. The tool forks this repo, commits your `template.json` + `README.md` + `preview.png` under `templates/resume/<your-slug>/`, and opens the PR for you.
4. CI validates (schema, placeholder fields, preview dimensions). Green build → we merge → next redeploy of the main app shows your template.

Alternative paths (no OAuth needed):
- **"Open in GitHub"** button in the Publish modal → GitHub file editor with content prefilled.
- **Download a bundle** and follow the `HOW-TO-SUBMIT.md` inside.
- **Claude Code users**: paste the prompt the modal gives you into your local Claude, attach the files, let it open the PR from your terminal.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the details.

## Repo layout

```
temploracraft-templates/
├── templates/
│   └── resume/
│       ├── modern/
│       │   ├── template.json     # canvas + placeholder schema
│       │   ├── README.md         # description, author, license
│       │   └── preview.png       # 816×1056 thumbnail
│       └── ...
├── packages/
│   └── schema/                    # @temploracraft/templates npm package
│       ├── src/
│       │   ├── types.ts           # TemplateDoc + Node types
│       │   └── zod.ts             # runtime validators (CI + main app)
│       └── package.json
├── .github/workflows/
│   ├── validate.yml               # runs on every PR
│   └── publish.yml                # publishes @temploracraft/templates on merge
├── CONTRIBUTING.md
└── LICENSE
```

## Consuming these templates

Main app installs from GitHub for now (moves to npm registry once we cut v1.0.0):

```json
// apps/web/package.json
"@temploracraft/templates": "github:vineethpawar/temploracraft-templates#v0.0.0"
```

Import shape:

```ts
import { templates, type TemplateDoc } from "@temploracraft/templates";

templates.forEach((t) => console.log(t.slug, t.name, t.author.name));
```

## Roadmap

See [`docs/templates-module-plan.md`](https://github.com/vineethpawar/temploracraft/blob/main/docs/templates-module-plan.md) in the main app repo for the full plan.

## License

Templates: MIT (each author). Repo tooling: MIT (Vineeth Pawar).
