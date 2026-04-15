const importPlugin = require('eslint-plugin-import');

module.exports = [
  // ... (Leave whatever Vite already generated here) ...

  {
    plugins: {
      import: importPlugin
    },
    // ADD THIS SETTINGS BLOCK:
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    rules: {
      "import/no-unresolved": ["error", { "caseSensitive": true }]
    }
  }
];