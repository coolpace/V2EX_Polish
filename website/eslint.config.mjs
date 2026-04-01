import jsxA11y from 'prefer-code-style/eslint/jsx-a11y'
import nextPreset from 'prefer-code-style/eslint/preset/next'

export default [
  ...nextPreset,
  ...jsxA11y,

  {
    settings: {
      tailwindcss: {
        whitelist: ['twitter-tweet', 'hero-sub-heading'],
      },
    },
  },

  {
    ignores: ['.contentlayer/**/*'],
  },
]
