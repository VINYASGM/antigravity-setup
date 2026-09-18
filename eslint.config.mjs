// Flat ESLint configuration for CodeRabbit automated static analysis
export default [
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "complexity": ["warn", 10]
    }
  }
];
