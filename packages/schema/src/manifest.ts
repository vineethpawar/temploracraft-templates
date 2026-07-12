/**
 * The bundled manifest. Populated at build time by scanning
 * `templates/resume/<slug>/template.json`. Empty for now (v0.0.0);
 * the first entry lands in Milestone T-1 when we migrate the Modern
 * preset.
 */
import type { TemplateDoc } from "./types.js";

export const templates: readonly TemplateDoc[] = [];

export function findTemplate(slug: string): TemplateDoc | undefined {
  return templates.find((t) => t.slug === slug);
}
