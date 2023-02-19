import { defineConfig } from 'tsup'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  noExternal: ['@floating-ui/dom'],
})
