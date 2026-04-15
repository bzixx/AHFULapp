const importPlugin = require('eslint-plugin-import');

module.exports = [
  // ... (Leave whatever Vite already generated here) ...

  {
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-unresolved": ["error", { "caseSensitive": true }]
    }
  }
];