import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'common.min': 'src/userscripts/common.ts',
    'v2ex-home.min': 'src/userscripts/home/index.ts',
    'v2ex-topic.min': 'src/userscripts/topic/index.ts',
    'decode-base64.min': 'src/userscripts/decode-base64.ts',
    'background.min': 'src/service-worker/background.ts',
    'toggle-icon.min': 'src/toggle-icon.ts',
  },

  outDir: './extension/scripts',

  minify: true,

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  noExternal: ['@floating-ui/dom'],
})
