import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Feature-Sliced boundaries (planning/ARCHITECTURE.md §2): import downward only,
// and only through a slice's index. Relative imports stay inside a slice.
const publicApiOnly = [
  {
    group: ["@/widgets/*/*", "@/features/*/*", "@/entities/*/*"],
    message: "Import a slice through its index, e.g. '@/entities/service'.",
  },
  {
    group: ["@/shared/ui/*", "@/shared/config/*", "@/shared/three/*", "@/shared/lib/*/*"],
    message: "Import shared code through its segment index, e.g. '@/shared/ui' or '@/shared/lib/animation'.",
  },
];

const layer = (files, forbidden, message) => ({
  files,
  rules: {
    "no-restricted-imports": ["error", { patterns: [...publicApiOnly, { group: forbidden, message }] }],
  },
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: publicApiOnly }] },
  },
  layer(["src/widgets/**"], ["@/app/*", "@/widgets/*"], "Widgets may import features, entities and shared, never other widgets."),
  layer(["src/features/**"], ["@/app/*", "@/widgets/*", "@/features/*"], "Features may import entities and shared only."),
  layer(["src/entities/**"], ["@/app/*", "@/widgets/*", "@/features/*", "@/entities/*"], "Entities may import shared only."),
  layer(["src/shared/**"], ["@/app/*", "@/widgets/*", "@/features/*", "@/entities/*"], "Shared code must not import higher layers."),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
