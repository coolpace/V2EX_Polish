import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'userscripts.min': 'src/userscripts/index.ts',
  },

  outDir: './extension/scripts',

  minify: true,

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  noExternal: ['@floating-ui/dom'],
})
