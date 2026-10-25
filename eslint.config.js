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
      // style.ts 由构建生成且与同名类型桩共存时，TypeScript 会优先采用 style.ts，
      // 导致 projectService 认为这个 .d.ts 不属于任何 project 而报错，故一并忽略。
      'apps/extension/src/user-scripts/style.d.ts',
      'apps/website/**/*',
      '*-profile*/**/*',
    ],
  },
]
