import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["bin/3ridge.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist/bin",
    clean: true,
    splitting: false,
    sourcemap: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
  {
    entry: ["bin/3ridge-mcp.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist/bin",
    clean: false,
    splitting: false,
    sourcemap: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
