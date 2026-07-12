/**
 * temploracraft template schema — TypeScript types.
 *
 * A template is a tree of Nodes rendered onto a fixed-size page.
 * Two consumers of the same TemplateDoc:
 *   1. Konva canvas — author tool + browser preview.
 *   2. @react-pdf/renderer — server-side PDF export.
 *
 * Bindings (`bind: "firstName"` on a PlaceholderTextNode) reference
 * field paths on the app's canonical ResumeData type. Inside a
 * Repeater bound to `experience`, `bind: "title"` refers to
 * `data.experience[i].title` for each iteration.
 */
type TemplateVersion = 1;
type Domain = "resume";
type License = "MIT";
type ThemeColor = string;
type FontWeight = 300 | 400 | 500 | 600 | 700 | 800;
type TextAlign = "left" | "center" | "right" | "justify";
type TextTransform = "uppercase" | "lowercase" | "none";
type NodeFit = "cover" | "contain";
type FlowLayout = "flow-vertical" | "flow-horizontal";
type Layout = "absolute" | FlowLayout;
interface Author {
    name: string;
    url?: string;
    githubUsername?: string;
}
interface PageSize {
    width: number;
    height: number;
}
interface TypographyStyle {
    fontFamily: string;
    fontWeight: FontWeight;
    fontSize: number;
    lineHeight: number;
    letterSpacing?: number;
    color: ThemeColor;
    align: TextAlign;
    transform?: TextTransform;
}
interface FontManifestEntry {
    family: string;
    weights: FontWeight[];
    source: "google" | "system";
}
interface BaseNode {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;
}
interface TextNode extends BaseNode {
    type: "text";
    content: string;
    style: TypographyStyle;
}
interface PlaceholderTextNode extends BaseNode {
    type: "placeholder-text";
    bind: string;
    fallback?: string;
    style: TypographyStyle;
}
interface ImageNode extends BaseNode {
    type: "image";
    src: string;
    fit: NodeFit;
}
interface RectNode extends BaseNode {
    type: "rect";
    fill: ThemeColor;
    stroke?: ThemeColor;
    strokeWidth?: number;
    radius?: number;
}
interface DividerNode extends BaseNode {
    type: "divider";
    color: ThemeColor;
    thickness: number;
}
interface SectionNode extends BaseNode {
    type: "section";
    label?: string;
    layout: Layout;
    gap?: number;
    padding?: [number, number, number, number];
    children: Node[];
}
interface RepeaterNode extends BaseNode {
    type: "repeater";
    bind: string;
    layout: FlowLayout;
    gap?: number;
    template: SectionNode;
}
type Node = TextNode | PlaceholderTextNode | ImageNode | RectNode | DividerNode | SectionNode | RepeaterNode;
interface TemplateDoc {
    version: TemplateVersion;
    domain: Domain;
    slug: string;
    name: string;
    description?: string;
    author: Author;
    license: License;
    page: PageSize;
    fonts?: FontManifestEntry[];
    root: SectionNode;
}

/**
 * The bundled manifest. Populated at build time by scanning
 * `templates/resume/<slug>/template.json`. Empty for now (v0.0.0);
 * the first entry lands in Milestone T-1 when we migrate the Modern
 * preset.
 */

declare const templates: readonly TemplateDoc[];
declare function findTemplate(slug: string): TemplateDoc | undefined;

export { type Author as A, type DividerNode as D, type FlowLayout as F, type ImageNode as I, type Layout as L, type Node as N, type PageSize as P, type RepeaterNode as R, type SectionNode as S, type TemplateDoc as T, type Domain as a, type FontManifestEntry as b, type FontWeight as c, type License as d, type NodeFit as e, type PlaceholderTextNode as f, type RectNode as g, type TemplateVersion as h, type TextAlign as i, type TextNode as j, type TextTransform as k, type ThemeColor as l, type TypographyStyle as m, findTemplate as n, templates as t };
