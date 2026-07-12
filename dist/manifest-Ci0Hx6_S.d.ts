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
 *
 * TextNode.content supports `{{path}}` interpolation from the same
 * scope, so a contact strip can be written once as
 *   "{{email}} · {{phone}} · {{location}}"
 * and the renderer collapses missing values + their separators.
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
type FlexJustify = "start" | "center" | "end" | "between" | "around";
type FlexAlign = "start" | "center" | "end" | "baseline" | "stretch";
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
    /**
     * Hide this node when the referenced field is falsy (undefined, "",
     * 0, or empty array). Useful for sections that shouldn't render
     * if the user hasn't filled them in.
     */
    visibleIf?: string;
}
interface TextNode extends BaseNode {
    type: "text";
    /** Supports `{{path}}` interpolation from the current data scope. */
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
interface BulletListNode extends BaseNode {
    type: "bullet-list";
    /** Path to a string[] on the current scope, e.g. "bullets". */
    bind: string;
    /**
     * "vertical" (default) renders one item per line with `bulletChar`
     * prefix (HTML renderer: `<ul><li>`). "inline" joins items into one
     * paragraph with `bulletChar` as separator — used for skills-style
     * flat lists.
     */
    layout?: "vertical" | "inline";
    /** Character shown before / between items. */
    bulletChar?: string;
    /** px between items when layout is vertical. */
    gap?: number;
    style: TypographyStyle;
}
interface SectionNode extends BaseNode {
    type: "section";
    label?: string;
    layout: Layout;
    gap?: number;
    padding?: [number, number, number, number];
    /** flex-justify-content when layout is flow-* */
    justify?: FlexJustify;
    /** flex-align-items when layout is flow-* */
    align?: FlexAlign;
    children: Node[];
}
interface RepeaterNode extends BaseNode {
    type: "repeater";
    bind: string;
    layout: FlowLayout;
    gap?: number;
    template: SectionNode;
}
type Node = TextNode | PlaceholderTextNode | ImageNode | RectNode | DividerNode | BulletListNode | SectionNode | RepeaterNode;
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
 * Bundled template manifest. tsup inlines each JSON at build time
 * (see tsup.config.ts — json loader by default in ESM output).
 */

declare const templates: readonly TemplateDoc[];
declare function findTemplate(slug: string): TemplateDoc | undefined;

export { type Author as A, type BulletListNode as B, type DividerNode as D, type FlexAlign as F, type ImageNode as I, type Layout as L, type Node as N, type PageSize as P, type RepeaterNode as R, type SectionNode as S, type TemplateDoc as T, type Domain as a, type FlexJustify as b, type FlowLayout as c, type FontManifestEntry as d, type FontWeight as e, type License as f, type NodeFit as g, type PlaceholderTextNode as h, type RectNode as i, type TemplateVersion as j, type TextAlign as k, type TextNode as l, type TextTransform as m, type ThemeColor as n, type TypographyStyle as o, findTemplate as p, templates as t };
