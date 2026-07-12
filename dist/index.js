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
var flexJustifySchema = z.enum(["start", "center", "end", "between", "around"]);
var flexAlignSchema = z.enum(["start", "center", "end", "baseline", "stretch"]);
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
  opacity: z.number().min(0).max(1).optional(),
  visibleIf: z.string().optional()
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
var bulletListNodeSchema = baseNodeSchema.extend({
  type: z.literal("bullet-list"),
  bind: z.string().min(1),
  layout: z.enum(["vertical", "inline"]).optional(),
  bulletChar: z.string().max(6).optional(),
  gap: z.number().nonnegative().optional(),
  style: typographyStyleSchema
});
var sectionNodeSchema = z.lazy(
  () => baseNodeSchema.extend({
    type: z.literal("section"),
    label: z.string().optional(),
    layout: layoutSchema,
    gap: z.number().nonnegative().optional(),
    padding: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
    justify: flexJustifySchema.optional(),
    align: flexAlignSchema.optional(),
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
    bulletListNodeSchema,
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

// templates/resume/modern/template.json
var template_default = {
  version: 1,
  domain: "resume",
  slug: "modern",
  name: "Modern",
  description: "Clean, ATS-friendly resume with a terracotta accent. Bold display name, form-field contact strip, and generously-spaced sections.",
  author: {
    name: "Vineeth Pawar",
    url: "https://vpawar.me",
    githubUsername: "vineethpawar"
  },
  license: "MIT",
  page: { width: 816, height: 1056 },
  fonts: [
    { family: "Inter", weights: [400, 500, 700, 800], source: "system" }
  ],
  root: {
    id: "root",
    type: "section",
    x: 0,
    y: 0,
    label: "Page",
    layout: "flow-vertical",
    gap: 24,
    padding: [56, 64, 56, 64],
    children: [
      {
        id: "header",
        type: "section",
        x: 0,
        y: 0,
        label: "Header",
        layout: "flow-vertical",
        gap: 4,
        children: [
          {
            id: "header-name",
            type: "placeholder-text",
            x: 0,
            y: 0,
            bind: "fullName",
            fallback: "Your name",
            style: {
              fontFamily: "Inter",
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1.1,
              letterSpacing: -0.6,
              color: "#1A1613",
              align: "left"
            }
          },
          {
            id: "header-headline",
            type: "placeholder-text",
            x: 0,
            y: 0,
            bind: "headline",
            fallback: "",
            visibleIf: "headline",
            style: {
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: 15,
              lineHeight: 1.4,
              color: "#E85D3A",
              align: "left"
            }
          },
          {
            id: "header-contact",
            type: "text",
            x: 0,
            y: 0,
            content: "{{email}}  \xB7  {{phone}}  \xB7  {{location}}",
            style: {
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: 1.4,
              color: "#6B635B",
              align: "left"
            }
          },
          {
            id: "header-rule",
            type: "divider",
            x: 0,
            y: 0,
            color: "#1A1613",
            thickness: 2
          }
        ]
      },
      {
        id: "summary",
        type: "section",
        x: 0,
        y: 0,
        label: "Summary",
        layout: "flow-vertical",
        visibleIf: "summary",
        children: [
          {
            id: "summary-body",
            type: "placeholder-text",
            x: 0,
            y: 0,
            bind: "summary",
            style: {
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#1A1613",
              align: "left"
            }
          }
        ]
      },
      {
        id: "experience",
        type: "section",
        x: 0,
        y: 0,
        label: "Experience",
        layout: "flow-vertical",
        gap: 12,
        visibleIf: "experience",
        children: [
          {
            id: "experience-title",
            type: "text",
            x: 0,
            y: 0,
            content: "Experience",
            style: {
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 11,
              lineHeight: 1.2,
              letterSpacing: 1.4,
              color: "#E85D3A",
              align: "left",
              transform: "uppercase"
            }
          },
          {
            id: "experience-list",
            type: "repeater",
            x: 0,
            y: 0,
            bind: "experience",
            layout: "flow-vertical",
            gap: 16,
            template: {
              id: "experience-item",
              type: "section",
              x: 0,
              y: 0,
              layout: "flow-vertical",
              gap: 6,
              children: [
                {
                  id: "experience-item-header",
                  type: "section",
                  x: 0,
                  y: 0,
                  layout: "flow-horizontal",
                  justify: "between",
                  align: "baseline",
                  gap: 12,
                  children: [
                    {
                      id: "experience-item-title",
                      type: "text",
                      x: 0,
                      y: 0,
                      content: "{{title}}  \xB7  {{company}}",
                      style: {
                        fontFamily: "Inter",
                        fontWeight: 700,
                        fontSize: 14,
                        lineHeight: 1.3,
                        color: "#1A1613",
                        align: "left"
                      }
                    },
                    {
                      id: "experience-item-dates",
                      type: "text",
                      x: 0,
                      y: 0,
                      content: "{{startDate}} \u2014 {{endDate}}",
                      style: {
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: 1.3,
                        color: "#6B635B",
                        align: "right"
                      }
                    }
                  ]
                },
                {
                  id: "experience-item-location",
                  type: "placeholder-text",
                  x: 0,
                  y: 0,
                  bind: "location",
                  visibleIf: "location",
                  style: {
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: 1.3,
                    color: "#6B635B",
                    align: "left"
                  }
                },
                {
                  id: "experience-item-bullets",
                  type: "bullet-list",
                  x: 0,
                  y: 0,
                  bind: "bullets",
                  visibleIf: "bullets",
                  bulletChar: "\xB7",
                  gap: 2,
                  style: {
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "#1A1613",
                    align: "left"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        id: "education",
        type: "section",
        x: 0,
        y: 0,
        label: "Education",
        layout: "flow-vertical",
        gap: 12,
        visibleIf: "education",
        children: [
          {
            id: "education-title",
            type: "text",
            x: 0,
            y: 0,
            content: "Education",
            style: {
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 11,
              lineHeight: 1.2,
              letterSpacing: 1.4,
              color: "#E85D3A",
              align: "left",
              transform: "uppercase"
            }
          },
          {
            id: "education-list",
            type: "repeater",
            x: 0,
            y: 0,
            bind: "education",
            layout: "flow-vertical",
            gap: 8,
            template: {
              id: "education-item",
              type: "section",
              x: 0,
              y: 0,
              layout: "flow-horizontal",
              justify: "between",
              align: "baseline",
              gap: 12,
              children: [
                {
                  id: "education-item-left",
                  type: "section",
                  x: 0,
                  y: 0,
                  layout: "flow-vertical",
                  gap: 2,
                  children: [
                    {
                      id: "education-item-institution",
                      type: "placeholder-text",
                      x: 0,
                      y: 0,
                      bind: "institution",
                      fallback: "Institution",
                      style: {
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.3,
                        color: "#1A1613",
                        align: "left"
                      }
                    },
                    {
                      id: "education-item-degree",
                      type: "text",
                      x: 0,
                      y: 0,
                      content: "{{degree}}, {{field}}",
                      style: {
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: 1.3,
                        color: "#6B635B",
                        align: "left"
                      }
                    }
                  ]
                },
                {
                  id: "education-item-dates",
                  type: "text",
                  x: 0,
                  y: 0,
                  content: "{{startYear}} \u2014 {{endYear}}",
                  style: {
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: 1.3,
                    color: "#6B635B",
                    align: "right"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        id: "skills",
        type: "section",
        x: 0,
        y: 0,
        label: "Skills",
        layout: "flow-vertical",
        gap: 12,
        visibleIf: "skills",
        children: [
          {
            id: "skills-title",
            type: "text",
            x: 0,
            y: 0,
            content: "Skills",
            style: {
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 11,
              lineHeight: 1.2,
              letterSpacing: 1.4,
              color: "#E85D3A",
              align: "left",
              transform: "uppercase"
            }
          },
          {
            id: "skills-body",
            type: "bullet-list",
            x: 0,
            y: 0,
            bind: "skills",
            layout: "inline",
            bulletChar: "  \xB7  ",
            style: {
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.65,
              color: "#1A1613",
              align: "left"
            }
          }
        ]
      }
    ]
  }
};

// src/manifest.ts
var templates = [template_default];
function findTemplate(slug) {
  return templates.find((t) => t.slug === slug);
}
export {
  authorSchema,
  bulletListNodeSchema,
  dividerNodeSchema,
  findTemplate,
  flexAlignSchema,
  flexJustifySchema,
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