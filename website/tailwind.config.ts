import type { Config } from 'tailwindcss'

export default {
  content: ['./src/{app,components}/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        main: {
          50: 'var(--v2p-color-main-50)',
          100: 'var(--v2p-color-main-100)',
          200: 'var(--v2p-color-main-200)',
          300: 'var(--v2p-color-main-300)',
          350: 'var(--v2p-color-main-350)',
          400: 'var(--v2p-color-main-400)',
          500: 'var(--v2p-color-main-500)',
          600: 'var(--v2p-color-main-600)',
          700: 'var(--v2p-color-main-700)',
          800: 'var(--v2p-color-main-800)',
        },
        content: 'var(--v2p-color-content)',
      },
      boxShadow: {
        box: 'var(--v2p-box-shadow)',
      },
    },
  },
} satisfies Config
