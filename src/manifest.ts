/**
 * Bundled template manifest. tsup inlines each JSON at build time
 * (see tsup.config.ts — json loader by default in ESM output).
 */
import type { TemplateDoc } from "./types.js";
import modern from "../templates/resume/modern/template.json" with { type: "json" };

export const templates: readonly TemplateDoc[] = [modern as unknown as TemplateDoc];

export function findTemplate(slug: string): TemplateDoc | undefined {
  return templates.find((t) => t.slug === slug);
}
