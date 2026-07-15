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

export type TemplateVersion = 1;
export type Domain = "resume";
export type License = "MIT";

export type ThemeColor = string; // hex or rgb() string
export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800;
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTransform = "uppercase" | "lowercase" | "none";
export type NodeFit = "cover" | "contain";
export type FlowLayout = "flow-vertical" | "flow-horizontal";
export type Layout = "absolute" | FlowLayout;
export type FlexJustify = "start" | "center" | "end" | "between" | "around";
export type FlexAlign = "start" | "center" | "end" | "baseline" | "stretch";

export interface Author {
  name: string;
  url?: string;
  githubUsername?: string;
}

export interface PageSize {
  width: number;   // canvas px, e.g. 816 (US Letter @ 96 dpi)
  height: number;  // canvas px, e.g. 1056
}

export interface TypographyStyle {
  fontFamily: string;
  fontWeight: FontWeight;
  fontSize: number;         // px
  lineHeight: number;       // multiplier, e.g. 1.5
  letterSpacing?: number;   // px
  color: ThemeColor;
  align: TextAlign;
  transform?: TextTransform;
}

export interface FontManifestEntry {
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

export interface TextNode extends BaseNode {
  type: "text";
  /** Supports `{{path}}` interpolation from the current data scope. */
  content: string;
  style: TypographyStyle;
}

export interface PlaceholderTextNode extends BaseNode {
  type: "placeholder-text";
  bind: string;             // e.g. "firstName" or "title" (inside a repeater)
  fallback?: string;        // preview text when data is empty
  style: TypographyStyle;
}

export interface ImageNode extends BaseNode {
  type: "image";
  src: string;              // base64 data URI or bundled asset path
  fit: NodeFit;
}

export interface RectNode extends BaseNode {
  type: "rect";
  fill: ThemeColor;
  stroke?: ThemeColor;
  strokeWidth?: number;
  radius?: number;
}

export interface DividerNode extends BaseNode {
  type: "divider";
  color: ThemeColor;
  thickness: number;
}

export interface BulletListNode extends BaseNode {
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

export interface SectionNode extends BaseNode {
  type: "section";
  label?: string;                        // shown in author tree, not rendered
  layout: Layout;
  gap?: number;
  padding?: [number, number, number, number];
  /** flex-justify-content when layout is flow-* */
  justify?: FlexJustify;
  /** flex-align-items when layout is flow-* */
  align?: FlexAlign;
  children: Node[];
}

export interface RepeaterNode extends BaseNode {
  type: "repeater";
  bind: string;                          // array key on the data
  layout: FlowLayout;
  gap?: number;
  template: SectionNode;                 // rendered once per data item
}

export type Node =
  | TextNode
  | PlaceholderTextNode
  | ImageNode
  | RectNode
  | DividerNode
  | BulletListNode
  | SectionNode
  | RepeaterNode;

export interface TemplateDoc {
  version: TemplateVersion;
  domain: Domain;
  slug: string;
  name: string;
  description?: string;
  author: Author;
  license: License;
  page: PageSize;
  fonts?: FontManifestEntry[];
  /**
   * True for first-party curated templates (Pro-only in the main app);
   * false or absent for community-submitted templates, which stay free
   * for everyone. Community contributors submitting a PR should leave
   * this false — the maintainer sets it on merge when incorporating a
   * template into the curated library. Not enforced by CI beyond a
   * warning; the main app is the actual paywall via `templates.is_premium`.
   */
  premium?: boolean;
  root: SectionNode;
}
