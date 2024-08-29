import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: [".wrangler/*"] },

  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
    },
  },
  eslintPluginPrettierRecommended,
];
