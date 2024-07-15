import globals from "globals";
  
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    rules: {
        quotes: ['error', 'double'],
        'brace-style': ['error', 'allman'],
        semi: ['error', 'always'],
        indent: ['error', 'tab']
      }
    },
  { 
    ignores: ["dist/**", "build/**"],
  },
]