import type { Config } from 'tailwindcss'

export default {
  content: ['./src/{app,components}/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      maxWidth: {
        container: '1280px',
      },

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
        accent: {
          50: 'var(--v2p-color-accent-50)',
          100: 'var(--v2p-color-accent-100)',
          200: 'var(--v2p-color-accent-200)',
          300: 'var(--v2p-color-accent-300)',
          400: 'var(--v2p-color-accent-400)',
          500: 'var(--v2p-color-accent-500)',
          600: 'var(--v2p-color-accent-600)',
        },
        foreground: 'var(--v2p-color-foreground)',
        background: 'var(--v2p-color-background)',
        content: 'var(--v2p-color-content)',
        subtle: 'var(--v2p-color-bg-subtle)',
      },

      boxShadow: {
        box: 'var(--v2p-box-shadow)',
      },
    },
  },

  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/container-queries')],
} satisfies Config
