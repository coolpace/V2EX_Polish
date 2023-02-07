module.exports = {
  root: true,
  global: { $: true },
  extends: [
    require.resolve('prefer-code-style/eslint/browser'),
    require.resolve('prefer-code-style/eslint/node'),
  ],
}
