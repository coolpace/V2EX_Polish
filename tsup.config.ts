import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    userscripts: 'src/userscripts/index.ts',
  },

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  noExternal: ['@floating-ui/dom'],
})
