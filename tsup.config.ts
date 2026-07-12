import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/manifest.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Inline everything into index.js + manifest.js — otherwise tsup
  // emits chunk-<hash>.js files whose names change on every build,
  // breaking git-tag-installed consumers.
  splitting: false,
  target: "es2022",
});
