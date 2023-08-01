import type { Config } from 'tailwindcss'

export default {
  content: ['./src/{app,components}/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        main: '#1e293b',
        fade: '#cbd5e1',
      },
    },
  },
} satisfies Config
