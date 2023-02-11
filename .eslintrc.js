module.exports = {
  root: true,
  globals: { $: true },
  extends: [
    require.resolve('prefer-code-style/eslint/browser'),
    require.resolve('prefer-code-style/eslint/node'),
  ],
}
