import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'common.min': 'src/content/common.ts',
    'v2ex-home.min': 'src/content/home/index.ts',
    'v2ex-topic.min': 'src/content/topic/index.ts',
    'decode-base64.min': 'src/content/decode-base64.ts',

    'popup.min': 'src/page/popup.ts',
    'options.min': 'src/page/options.ts',

    'toggle-icon.min': 'src/toggle-icon.ts',
    'background.min': 'src/background.ts',
  },

  outDir: './extension/scripts',

  minify: true,

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  noExternal: ['@floating-ui/dom'],
})
