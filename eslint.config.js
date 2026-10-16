import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "coverage"]),
  {
    files: ["src/**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // The project is plain JavaScript without PropTypes.
      "react/prop-types": "off",
    },
  },
  {
    files: ["src/**/*.test.{js,jsx}", "src/test/**"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["*.config.js"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
]);
