import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'common.min': 'src/contents/common.ts',
    'v2ex-home.min': 'src/contents/home/index.ts',
    'v2ex-topic.min': 'src/contents/topic/index.ts',
    'v2ex-write.min': 'src/contents/write/index.ts',
    'v2ex-member.min': 'src/contents/member/index.ts',
    'decode-base64.min': 'src/contents/decode-base64.ts',
    'reading-list.min': 'src/contents/reading-list.ts',

    'popup.min': 'src/pages/popup.ts',
    'options.min': 'src/pages/options.ts',

    'toggle-icon.min': 'src/background/toggle-icon.ts',
    'background.min': 'src/background/main.ts',
    'web_accessible_resources.min': 'src/web_accessible_resources.ts',
  },

  outDir: './extension/scripts',

  minify: false,

  noExternal: ['@floating-ui/dom', 'webext-patterns', 'lucide'],

  esbuildOptions(options) {
    options.write = false
  },
})
