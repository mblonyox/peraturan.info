import tsParser from "@typescript-eslint/parser";
import * as astroParser from "astro-eslint-parser";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

/**
 * @see https://eslint.org/docs/latest/use/configure/
 */
export default defineConfig([
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        project: "./tsconfig.json",
      },
    },
  },
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  globalIgnores([
    ".astro/",
    ".wrangler/",
    "dev-dist/",
    "dist/",
    "node_modules/",
    "public/",
  ]),
]);
