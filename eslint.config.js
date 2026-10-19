import eslintPluginAstro from "eslint-plugin-astro"
import eslintPluginReact from "eslint-plugin-react"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tsEslint from "typescript-eslint"
import js from "@eslint/js"

export default tsEslint.config(
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["dist/**/*", ".astro/**/*", "node_modules/**/*"],
  },
)
