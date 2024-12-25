module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // Allow any TypeScript-related comments
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // Allow unused imports
    'unused-imports/no-unused-imports-ts': 'off',
    // Disable other rules if needed
    '@typescript-eslint/consistent-type-definitions': 'off',
    'no-var': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
