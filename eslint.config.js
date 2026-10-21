import browser from 'prefer-code-style/eslint/browser'
import node from 'prefer-code-style/eslint/node'
import typescript from 'prefer-code-style/eslint/typescript'

import {
  disableTypeAwareLintForJavaScript,
  disableTypeAwareLintForTests,
  sharedTypeScriptRuleRelaxations,
} from './eslint.shared.js'

export default [
  ...node,
  ...browser,
  ...typescript,
  disableTypeAwareLintForJavaScript,
  disableTypeAwareLintForTests,
  sharedTypeScriptRuleRelaxations,

  {
    ignores: [
      'apps/extension/dist/**/*',
      'apps/extension/public/vendor/**/*.js',
      'apps/extension/src/user-scripts/style.ts',
      'apps/website/**/*',
      '*-profile*/**/*',
    ],
  },
]
