import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // Ignore build output and dependencies
  { ignores: ["dist/", "node_modules/", ".netlify/", "server/db/migrations/"] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Unused vars: error for vars, ignore underscore-prefixed args
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      // Relax some strict rules for existing codebase
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Allow require() in config files
  {
    files: ["tailwind.config.ts", "postcss.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
