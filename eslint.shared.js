import tseslint from 'typescript-eslint'

export const disableTypeAwareLintForJavaScript = {
  ...tseslint.configs.disableTypeChecked,
  files: ['**/*.{js,jsx,mjs,cjs}'],
  languageOptions: {
    parserOptions: {
      projectService: false,
    },
  },
}

export const disableTypeAwareLintForTests = {
  ...tseslint.configs.disableTypeChecked,
  files: ['tests/**/*.ts', 'vitest.config.ts'],
  languageOptions: {
    parserOptions: {
      projectService: false,
    },
  },
}

export const sharedTypeScriptRuleRelaxations = {
  rules: {
    '@typescript-eslint/prefer-readonly-parameter-types': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
  },
}
