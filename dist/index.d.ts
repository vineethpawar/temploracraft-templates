import { S as SectionNode, N as Node, R as RepeaterNode } from './manifest-BbcyDrHg.js';
export { A as Author, D as DividerNode, a as Domain, F as FlowLayout, b as FontManifestEntry, c as FontWeight, I as ImageNode, L as Layout, d as License, e as NodeFit, P as PageSize, f as PlaceholderTextNode, g as RectNode, T as TemplateDoc, h as TemplateVersion, i as TextAlign, j as TextNode, k as TextTransform, l as ThemeColor, m as TypographyStyle, n as findTemplate, t as templates } from './manifest-BbcyDrHg.js';
import { z } from 'zod';

declare const themeColorSchema: z.ZodString;
declare const fontWeightSchema: z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>;
declare const textAlignSchema: z.ZodEnum<["left", "center", "right", "justify"]>;
declare const textTransformSchema: z.ZodEnum<["uppercase", "lowercase", "none"]>;
declare const nodeFitSchema: z.ZodEnum<["cover", "contain"]>;
declare const flowLayoutSchema: z.ZodEnum<["flow-vertical", "flow-horizontal"]>;
declare const layoutSchema: z.ZodEnum<["absolute", "flow-vertical", "flow-horizontal"]>;
declare const typographyStyleSchema: z.ZodObject<{
    fontFamily: z.ZodString;
    fontWeight: z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>;
    fontSize: z.ZodNumber;
    lineHeight: z.ZodNumber;
    letterSpacing: z.ZodOptional<z.ZodNumber>;
    color: z.ZodString;
    align: z.ZodEnum<["left", "center", "right", "justify"]>;
    transform: z.ZodOptional<z.ZodEnum<["uppercase", "lowercase", "none"]>>;
}, "strip", z.ZodTypeAny, {
    fontFamily: string;
    fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
    fontSize: number;
    lineHeight: number;
    color: string;
    align: "left" | "center" | "right" | "justify";
    letterSpacing?: number | undefined;
    transform?: "uppercase" | "lowercase" | "none" | undefined;
}, {
    fontFamily: string;
    fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
    fontSize: number;
    lineHeight: number;
    color: string;
    align: "left" | "center" | "right" | "justify";
    letterSpacing?: number | undefined;
    transform?: "uppercase" | "lowercase" | "none" | undefined;
}>;
declare const fontManifestEntrySchema: z.ZodObject<{
    family: z.ZodString;
    weights: z.ZodArray<z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>, "many">;
    source: z.ZodEnum<["google", "system"]>;
}, "strip", z.ZodTypeAny, {
    family: string;
    weights: (300 | 400 | 500 | 600 | 700 | 800)[];
    source: "google" | "system";
}, {
    family: string;
    weights: (300 | 400 | 500 | 600 | 700 | 800)[];
    source: "google" | "system";
}>;
declare const textNodeSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"text">;
    content: z.ZodString;
    style: z.ZodObject<{
        fontFamily: z.ZodString;
        fontWeight: z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>;
        fontSize: z.ZodNumber;
        lineHeight: z.ZodNumber;
        letterSpacing: z.ZodOptional<z.ZodNumber>;
        color: z.ZodString;
        align: z.ZodEnum<["left", "center", "right", "justify"]>;
        transform: z.ZodOptional<z.ZodEnum<["uppercase", "lowercase", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    }, {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "text";
    id: string;
    x: number;
    y: number;
    content: string;
    style: {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    };
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}, {
    type: "text";
    id: string;
    x: number;
    y: number;
    content: string;
    style: {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    };
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}>;
declare const placeholderTextNodeSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"placeholder-text">;
    bind: z.ZodString;
    fallback: z.ZodOptional<z.ZodString>;
    style: z.ZodObject<{
        fontFamily: z.ZodString;
        fontWeight: z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>;
        fontSize: z.ZodNumber;
        lineHeight: z.ZodNumber;
        letterSpacing: z.ZodOptional<z.ZodNumber>;
        color: z.ZodString;
        align: z.ZodEnum<["left", "center", "right", "justify"]>;
        transform: z.ZodOptional<z.ZodEnum<["uppercase", "lowercase", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    }, {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "placeholder-text";
    id: string;
    x: number;
    y: number;
    style: {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    };
    bind: string;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
    fallback?: string | undefined;
}, {
    type: "placeholder-text";
    id: string;
    x: number;
    y: number;
    style: {
        fontFamily: string;
        fontWeight: 300 | 400 | 500 | 600 | 700 | 800;
        fontSize: number;
        lineHeight: number;
        color: string;
        align: "left" | "center" | "right" | "justify";
        letterSpacing?: number | undefined;
        transform?: "uppercase" | "lowercase" | "none" | undefined;
    };
    bind: string;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
    fallback?: string | undefined;
}>;
declare const imageNodeSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"image">;
    src: z.ZodString;
    fit: z.ZodEnum<["cover", "contain"]>;
}, "strip", z.ZodTypeAny, {
    type: "image";
    id: string;
    x: number;
    y: number;
    src: string;
    fit: "cover" | "contain";
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}, {
    type: "image";
    id: string;
    x: number;
    y: number;
    src: string;
    fit: "cover" | "contain";
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}>;
declare const rectNodeSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"rect">;
    fill: z.ZodString;
    stroke: z.ZodOptional<z.ZodString>;
    strokeWidth: z.ZodOptional<z.ZodNumber>;
    radius: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    fill: string;
    type: "rect";
    id: string;
    x: number;
    y: number;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    radius?: number | undefined;
}, {
    fill: string;
    type: "rect";
    id: string;
    x: number;
    y: number;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    radius?: number | undefined;
}>;
declare const dividerNodeSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"divider">;
    color: z.ZodString;
    thickness: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "divider";
    color: string;
    id: string;
    x: number;
    y: number;
    thickness: number;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}, {
    type: "divider";
    color: string;
    id: string;
    x: number;
    y: number;
    thickness: number;
    width?: number | undefined;
    height?: number | undefined;
    rotation?: number | undefined;
    opacity?: number | undefined;
}>;
declare const sectionNodeSchema: z.ZodType<SectionNode>;
declare const repeaterNodeSchema: z.ZodType<RepeaterNode>;
declare const nodeSchema: z.ZodType<Node>;
declare const authorSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    githubUsername: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    url?: string | undefined;
    githubUsername?: string | undefined;
}, {
    name: string;
    url?: string | undefined;
    githubUsername?: string | undefined;
}>;
declare const pageSizeSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
}, {
    width: number;
    height: number;
}>;
declare const templateDocSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    domain: z.ZodLiteral<"resume">;
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    author: z.ZodObject<{
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        githubUsername: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url?: string | undefined;
        githubUsername?: string | undefined;
    }, {
        name: string;
        url?: string | undefined;
        githubUsername?: string | undefined;
    }>;
    license: z.ZodLiteral<"MIT">;
    page: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width: number;
        height: number;
    }>;
    fonts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        family: z.ZodString;
        weights: z.ZodArray<z.ZodUnion<[z.ZodLiteral<300>, z.ZodLiteral<400>, z.ZodLiteral<500>, z.ZodLiteral<600>, z.ZodLiteral<700>, z.ZodLiteral<800>]>, "many">;
        source: z.ZodEnum<["google", "system"]>;
    }, "strip", z.ZodTypeAny, {
        family: string;
        weights: (300 | 400 | 500 | 600 | 700 | 800)[];
        source: "google" | "system";
    }, {
        family: string;
        weights: (300 | 400 | 500 | 600 | 700 | 800)[];
        source: "google" | "system";
    }>, "many">>;
    root: z.ZodType<SectionNode, z.ZodTypeDef, SectionNode>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: 1;
    domain: "resume";
    slug: string;
    author: {
        name: string;
        url?: string | undefined;
        githubUsername?: string | undefined;
    };
    license: "MIT";
    page: {
        width: number;
        height: number;
    };
    root: SectionNode;
    description?: string | undefined;
    fonts?: {
        family: string;
        weights: (300 | 400 | 500 | 600 | 700 | 800)[];
        source: "google" | "system";
    }[] | undefined;
}, {
    name: string;
    version: 1;
    domain: "resume";
    slug: string;
    author: {
        name: string;
        url?: string | undefined;
        githubUsername?: string | undefined;
    };
    license: "MIT";
    page: {
        width: number;
        height: number;
    };
    root: SectionNode;
    description?: string | undefined;
    fonts?: {
        family: string;
        weights: (300 | 400 | 500 | 600 | 700 | 800)[];
        source: "google" | "system";
    }[] | undefined;
}>;
type TemplateDocParsed = z.infer<typeof templateDocSchema>;

export { Node, RepeaterNode, SectionNode, type TemplateDocParsed, authorSchema, dividerNodeSchema, flowLayoutSchema, fontManifestEntrySchema, fontWeightSchema, imageNodeSchema, layoutSchema, nodeFitSchema, nodeSchema, pageSizeSchema, placeholderTextNodeSchema, rectNodeSchema, repeaterNodeSchema, sectionNodeSchema, templateDocSchema, textAlignSchema, textNodeSchema, textTransformSchema, themeColorSchema, typographyStyleSchema };
