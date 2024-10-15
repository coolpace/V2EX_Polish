/**
 * 为了方便兼容 Chrome 和 Firefox，并且方便管理和修改 manifest.json，
 * 这个脚本会帮助生成 manifest.json。
 */

import fs from 'node:fs'
import path from 'node:path'

/** 扩展能够识别的 V2EX 域名列表。 */
export const HOSTS = [
  'v2ex.com',
  'www.v2ex.com',
  'cn.v2ex.com',
  'jp.v2ex.com',
  'de.v2ex.com',
  'us.v2ex.com',
  'hk.v2ex.com',
  'global.v2ex.com',
  'fast.v2ex.com',
  's.v2ex.com',
  'origin.v2ex.com',
  'staging.v2ex.com',
]

type Manifest = chrome.runtime.ManifestV3

const generateManifest = (): Manifest => {
  const getMatches = (surrfix?: string) =>
    HOSTS.map((host) => `https://${host}${surrfix ? `/${surrfix}` : ''}/*`)

  const matches = getMatches()
  const topicMatches = getMatches('t')
  const writeMatches = getMatches('write')
  const memberMatches = getMatches('member')

  return {
    manifest_version: 3,

    name: 'V2EX Polish',

    version: '1.11.10', // <- 在发布前，需要手动修改版本。

    description: '专为 V2EX 用户设计，提供了丰富的扩展功能。',

    permissions: ['scripting', 'contextMenus', 'storage', 'alarms', 'sidePanel'],

    host_permissions: matches,

    icons: {
      '16': 'images/icon-16.png',
      '32': 'images/icon-32.png',
      '48': 'images/icon-48.png',
      '128': 'images/icon-128.png',
    },

    content_scripts: [
      {
        matches: matches,
        css: [
          'css/v2ex-theme-var.css',
          'css/v2ex-theme-default.css',
          'css/v2ex-theme-dark.css',
          'css/v2ex-theme-compact.css',
          'css/v2ex-theme-dawn.css',
          'css/v2ex-theme-mobile.css',
        ],
        run_at: 'document_start',
        all_frames: true,
      },
      {
        matches: matches,
        js: ['scripts/polyfill.js'],
        run_at: 'document_end',
        all_frames: true,
      },

      {
        matches: matches,
        css: ['css/v2ex-effect.css'],
        js: ['scripts/jquery.min.js', 'scripts/common.min.js'],
        all_frames: true,
      },
      {
        matches: matches,
        exclude_matches: [
          '*://*/t/*',
          '*://*/notes/*',
          '*://*/settings',
          '*://*/write',
          '*://*/member/*',
        ],
        js: ['scripts/jquery.min.js', 'scripts/v2ex-home.min.js'],
        all_frames: true,
      },
      {
        matches: topicMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-topic.min.js'],
        all_frames: true,
      },
      {
        matches: writeMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-write.min.js'],
        all_frames: true,
      },
      {
        matches: memberMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-member.min.js'],
        all_frames: true,
      },

      {
        matches: matches,
        js: ['scripts/toggle-icon.min.js'],
        all_frames: true,
      },
    ],

    background: {
      service_worker: 'scripts/background.min.js',
    },

    web_accessible_resources: [
      {
        matches: matches,
        resources: ['scripts/web_accessible_resources.min.js'],
      },
    ],

    options_ui: {
      page: 'pages/options.html',
      open_in_tab: true,
    },

    action: {
      default_title: 'V2EX Polish 用户面板',
      default_popup: 'pages/popup.html',
    },
  }
}

const manifest = generateManifest()

fs.writeFile(path.join('extension', 'manifest.json'), JSON.stringify(manifest), 'utf8', (err) => {
  if (err) {
    console.error(err)
  }
})

const manifestFirefox: Manifest = JSON.parse(JSON.stringify(manifest))

Object.assign(manifestFirefox, {
  browser_specific_settings: {
    gecko: {
      id: 'leokudev@gmail.com',
    },
  },
})

manifestFirefox.permissions = manifestFirefox.permissions?.filter(
  (permission) => permission !== 'sidePanel'
)

if (manifestFirefox.background) {
  const serviceWorker = manifestFirefox.background.service_worker

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-expect-error */
  delete manifestFirefox.background.service_worker

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-expect-error */
  manifestFirefox.background['scripts'] = [serviceWorker]
}

fs.writeFile(
  path.join('extension', 'manifest-firefox.json'),
  JSON.stringify(manifestFirefox),
  'utf8',
  (err) => {
    if (err) {
      console.error(err)
    }
  }
)
