import * as astroParser from "astro-eslint-parser";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import prettier from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  prettier,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        // This instructs astro-eslint-parser to use TS parser for scripts
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
        // Add if you use typed linting rules:
        // project: "./tsconfig.json",
      },
    },
  },
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    settings: {
      react: { version: "19" },
    },
  },
  globalIgnores([".astro", "public"]),
]);

export default eslintConfig;
