/**
 * Runtime validators mirroring the TypeScript types.
 * Used by:
 *   - CI on the templates repo (validates every PR)
 *   - Main app on load (defensive parse of TemplateDoc from npm bundle)
 *   - Author tool on export (fail fast before opening the PR)
 */
import { z } from "zod";

export const themeColorSchema = z.string().regex(
  /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()/,
  "expected a hex or rgb color",
);

export const fontWeightSchema = z.union([
  z.literal(300), z.literal(400), z.literal(500),
  z.literal(600), z.literal(700), z.literal(800),
]);

export const textAlignSchema = z.enum(["left", "center", "right", "justify"]);
export const textTransformSchema = z.enum(["uppercase", "lowercase", "none"]);
export const nodeFitSchema = z.enum(["cover", "contain"]);
export const flowLayoutSchema = z.enum(["flow-vertical", "flow-horizontal"]);
export const layoutSchema = z.enum(["absolute", "flow-vertical", "flow-horizontal"]);

export const typographyStyleSchema = z.object({
  fontFamily: z.string().min(1),
  fontWeight: fontWeightSchema,
  fontSize: z.number().positive().max(200),
  lineHeight: z.number().positive().max(3),
  letterSpacing: z.number().optional(),
  color: themeColorSchema,
  align: textAlignSchema,
  transform: textTransformSchema.optional(),
});

export const fontManifestEntrySchema = z.object({
  family: z.string(),
  weights: z.array(fontWeightSchema),
  source: z.enum(["google", "system"]),
});

const baseNodeSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  rotation: z.number().min(-360).max(360).optional(),
  opacity: z.number().min(0).max(1).optional(),
});

export const textNodeSchema = baseNodeSchema.extend({
  type: z.literal("text"),
  content: z.string(),
  style: typographyStyleSchema,
});

export const placeholderTextNodeSchema = baseNodeSchema.extend({
  type: z.literal("placeholder-text"),
  bind: z.string().min(1),
  fallback: z.string().optional(),
  style: typographyStyleSchema,
});

export const imageNodeSchema = baseNodeSchema.extend({
  type: z.literal("image"),
  src: z.string().min(1),
  fit: nodeFitSchema,
});

export const rectNodeSchema = baseNodeSchema.extend({
  type: z.literal("rect"),
  fill: themeColorSchema,
  stroke: themeColorSchema.optional(),
  strokeWidth: z.number().nonnegative().optional(),
  radius: z.number().nonnegative().optional(),
});

export const dividerNodeSchema = baseNodeSchema.extend({
  type: z.literal("divider"),
  color: themeColorSchema,
  thickness: z.number().positive(),
});

// Section + Repeater reference `nodeSchema`, and each other. Zod
// handles recursion via z.lazy — pattern below matches the plyxui
// canvas layers schema (works, but keep the `Node` type export in
// sync with types.ts manually to keep autocomplete precise).
export const sectionNodeSchema: z.ZodType<import("./types.js").SectionNode> = z.lazy(() =>
  baseNodeSchema.extend({
    type: z.literal("section"),
    label: z.string().optional(),
    layout: layoutSchema,
    gap: z.number().nonnegative().optional(),
    padding: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
    children: z.array(nodeSchema),
  }),
);

export const repeaterNodeSchema: z.ZodType<import("./types.js").RepeaterNode> = z.lazy(() =>
  baseNodeSchema.extend({
    type: z.literal("repeater"),
    bind: z.string().min(1),
    layout: flowLayoutSchema,
    gap: z.number().nonnegative().optional(),
    template: sectionNodeSchema,
  }),
);

export const nodeSchema: z.ZodType<import("./types.js").Node> = z.lazy(() =>
  z.union([
    textNodeSchema,
    placeholderTextNodeSchema,
    imageNodeSchema,
    rectNodeSchema,
    dividerNodeSchema,
    sectionNodeSchema,
    repeaterNodeSchema,
  ]),
);

export const authorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  githubUsername: z.string().regex(/^[a-zA-Z0-9-]+$/).optional(),
});

export const pageSizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

export const templateDocSchema = z.object({
  version: z.literal(1),
  domain: z.literal("resume"),
  slug: z.string().regex(/^[a-z0-9-]{3,60}$/, "slug must be kebab-case, 3-60 chars"),
  name: z.string().min(1).max(80),
  description: z.string().max(280).optional(),
  author: authorSchema,
  license: z.literal("MIT"),
  page: pageSizeSchema,
  fonts: z.array(fontManifestEntrySchema).optional(),
  root: sectionNodeSchema,
});

export type TemplateDocParsed = z.infer<typeof templateDocSchema>;
