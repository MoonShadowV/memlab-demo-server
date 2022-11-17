module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    semi: [2, 'always'],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
};
