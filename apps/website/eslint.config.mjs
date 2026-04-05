import jsxA11y from 'prefer-code-style/eslint/jsx-a11y'
import next from 'prefer-code-style/eslint/next'
import normal from 'prefer-code-style/eslint/preset/normal'
import typescript from 'prefer-code-style/eslint/typescript'

import {
  disableTypeAwareLintForJavaScript,
  sharedTypeScriptRuleRelaxations,
} from '../../eslint.shared.js'

import tailwindcss from 'prefer-code-style/eslint/tailwindcss'

export default [
  ...normal,
  ...typescript,
  ...next,
  ...tailwindcss,
  ...jsxA11y,
  disableTypeAwareLintForJavaScript,
  sharedTypeScriptRuleRelaxations,

  {
    settings: {
      tailwindcss: {
        whitelist: ['twitter-tweet', 'hero-sub-heading'],
      },
    },
  },

  {
    ignores: ['.next/**/*', '.velite/**/*'],
  },
]
