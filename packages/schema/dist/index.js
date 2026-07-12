import {
  findTemplate,
  templates
} from "./chunk-O7SU5LFC.js";

// src/zod.ts
import { z } from "zod";
var themeColorSchema = z.string().regex(
  /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()/,
  "expected a hex or rgb color"
);
var fontWeightSchema = z.union([
  z.literal(300),
  z.literal(400),
  z.literal(500),
  z.literal(600),
  z.literal(700),
  z.literal(800)
]);
var textAlignSchema = z.enum(["left", "center", "right", "justify"]);
var textTransformSchema = z.enum(["uppercase", "lowercase", "none"]);
var nodeFitSchema = z.enum(["cover", "contain"]);
var flowLayoutSchema = z.enum(["flow-vertical", "flow-horizontal"]);
var layoutSchema = z.enum(["absolute", "flow-vertical", "flow-horizontal"]);
var typographyStyleSchema = z.object({
  fontFamily: z.string().min(1),
  fontWeight: fontWeightSchema,
  fontSize: z.number().positive().max(200),
  lineHeight: z.number().positive().max(3),
  letterSpacing: z.number().optional(),
  color: themeColorSchema,
  align: textAlignSchema,
  transform: textTransformSchema.optional()
});
var fontManifestEntrySchema = z.object({
  family: z.string(),
  weights: z.array(fontWeightSchema),
  source: z.enum(["google", "system"])
});
var baseNodeSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  rotation: z.number().min(-360).max(360).optional(),
  opacity: z.number().min(0).max(1).optional()
});
var textNodeSchema = baseNodeSchema.extend({
  type: z.literal("text"),
  content: z.string(),
  style: typographyStyleSchema
});
var placeholderTextNodeSchema = baseNodeSchema.extend({
  type: z.literal("placeholder-text"),
  bind: z.string().min(1),
  fallback: z.string().optional(),
  style: typographyStyleSchema
});
var imageNodeSchema = baseNodeSchema.extend({
  type: z.literal("image"),
  src: z.string().min(1),
  fit: nodeFitSchema
});
var rectNodeSchema = baseNodeSchema.extend({
  type: z.literal("rect"),
  fill: themeColorSchema,
  stroke: themeColorSchema.optional(),
  strokeWidth: z.number().nonnegative().optional(),
  radius: z.number().nonnegative().optional()
});
var dividerNodeSchema = baseNodeSchema.extend({
  type: z.literal("divider"),
  color: themeColorSchema,
  thickness: z.number().positive()
});
var sectionNodeSchema = z.lazy(
  () => baseNodeSchema.extend({
    type: z.literal("section"),
    label: z.string().optional(),
    layout: layoutSchema,
    gap: z.number().nonnegative().optional(),
    padding: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
    children: z.array(nodeSchema)
  })
);
var repeaterNodeSchema = z.lazy(
  () => baseNodeSchema.extend({
    type: z.literal("repeater"),
    bind: z.string().min(1),
    layout: flowLayoutSchema,
    gap: z.number().nonnegative().optional(),
    template: sectionNodeSchema
  })
);
var nodeSchema = z.lazy(
  () => z.union([
    textNodeSchema,
    placeholderTextNodeSchema,
    imageNodeSchema,
    rectNodeSchema,
    dividerNodeSchema,
    sectionNodeSchema,
    repeaterNodeSchema
  ])
);
var authorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  githubUsername: z.string().regex(/^[a-zA-Z0-9-]+$/).optional()
});
var pageSizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive()
});
var templateDocSchema = z.object({
  version: z.literal(1),
  domain: z.literal("resume"),
  slug: z.string().regex(/^[a-z0-9-]{3,60}$/, "slug must be kebab-case, 3-60 chars"),
  name: z.string().min(1).max(80),
  description: z.string().max(280).optional(),
  author: authorSchema,
  license: z.literal("MIT"),
  page: pageSizeSchema,
  fonts: z.array(fontManifestEntrySchema).optional(),
  root: sectionNodeSchema
});
export {
  authorSchema,
  dividerNodeSchema,
  findTemplate,
  flowLayoutSchema,
  fontManifestEntrySchema,
  fontWeightSchema,
  imageNodeSchema,
  layoutSchema,
  nodeFitSchema,
  nodeSchema,
  pageSizeSchema,
  placeholderTextNodeSchema,
  rectNodeSchema,
  repeaterNodeSchema,
  sectionNodeSchema,
  templateDocSchema,
  templates,
  textAlignSchema,
  textNodeSchema,
  textTransformSchema,
  themeColorSchema,
  typographyStyleSchema
};
//# sourceMappingURL=index.js.map