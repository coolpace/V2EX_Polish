/**
 * V2EX Polish 扩展 Manifest 构建脚本
 *
 * 主要功能：
 * 1. 自动生成适用于 Chrome 和 Firefox 的 manifest.json 文件
 * 2. 统一管理扩展的配置信息，避免手动维护多个配置文件
 * 3. 根据不同浏览器的特性自动调整配置项
 *
 * 解决的问题：
 * - Chrome 和 Firefox 对 Manifest V3 的支持存在差异
 * - 手动维护多个 manifest 文件容易出错且效率低下
 * - 需要为多个 V2EX 域名生成匹配规则
 *
 * 生成的文件：
 * - extension/manifest.json (Chrome 版本)
 * - extension/manifest-firefox.json (Firefox 版本)
 *
 * 主要差异处理：
 * - Firefox 不支持 sidePanel 权限，会自动过滤
 * - Firefox 使用 background.scripts 而非 background.service_worker
 * - Firefox 需要添加 browser_specific_settings.gecko.id
 */

import fs from 'node:fs'
import path from 'node:path'

/**
 * 扩展能够识别的 V2EX 域名列表
 *
 * 包含了 V2EX 的所有官方域名和镜像站点：
 * - 主域名：v2ex.com, www.v2ex.com
 * - 地区镜像：cn, jp, de, us, hk, global
 * - 特殊用途：fast (CDN加速), s (短链接), origin (原始服务器)
 * - 开发环境：staging (测试环境)
 */
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

/**
 * 生成 Chrome 扩展的 Manifest V3 配置
 *
 * 该函数会创建一个完整的 manifest 配置对象，包含：
 * - 基本信息（名称、版本、描述）
 * - 权限配置（scripting, contextMenus, storage 等）
 * - 内容脚本配置（按页面类型分组注入）
 * - 背景脚本配置
 * - UI 配置（图标、弹窗、选项页）
 *
 * @returns {Manifest} 完整的 manifest 配置对象
 */
const generateManifest = (): Manifest => {
  /**
   * 生成 URL 匹配规则
   *
   * 为所有 V2EX 域名生成对应的 URL 匹配模式，支持：
   * - 通配符匹配所有路径
   * - 特定路径匹配（如 /t/*, /write/* 等）
   *
   * @param suffix - 可选的路径后缀，如 't', 'write', 'member' 等
   * @returns {string[]} URL 匹配规则数组
   */
  const getMatches = (suffix?: string) => {
    return HOSTS.map((host) => {
      const base = `https://${host}`
      const path = suffix ? `/${suffix}` : ''

      return `${base}${path}/*`
    })
  }

  // 为不同页面类型生成专用的匹配规则
  const matches = getMatches() // 全站匹配
  const topicMatches = getMatches('t') // 主题页面
  const writeMatches = getMatches('write') // 发帖页面
  const memberMatches = getMatches('member') // 用户页面
  const settingsMatches = getMatches('settings') // 设置页面
  const notificationsMatches = getMatches('notifications') // 通知页面
  const nodeMatches = getMatches('go') // 节点页面

  return {
    manifest_version: 3,

    name: 'V2EX Polish',

    version: '2.2.14', // <- 在发布前，需要手动修改版本。

    description: '专为 V2EX 用户设计，提供了丰富的扩展功能。',

    // 扩展所需的基本权限
    permissions: ['scripting', 'contextMenus', 'storage', 'alarms', 'sidePanel'],

    // 允许访问的主机权限（所有 V2EX 域名）
    host_permissions: matches,

    // 扩展图标配置（多尺寸适配）
    icons: {
      '16': 'images/icon-16.png',
      '32': 'images/icon-32.png',
      '48': 'images/icon-48.png',
      '128': 'images/icon-128.png',
    },

    content_scripts: [
      // 1. 主题样式注入（最高优先级，document_start 执行）
      {
        matches,
        css: [
          'css/v2ex-theme-var.css',
          'css/v2ex-theme-default.css',
          'css/v2ex-theme-dark.css',
          'css/v2ex-theme-compact.css',
          'css/v2ex-theme-dawn.css',
          'css/v2ex-theme-mobile.css',
        ],
        run_at: 'document_start',
        all_frames: true, // 支持所有框架（包括 iframes）
      },

      // 2. Polyfill 脚本注入（兼容性处理）
      {
        matches,
        js: ['scripts/polyfill.js'],
        run_at: 'document_end',
        all_frames: true,
      },

      // 3. 通用功能脚本（所有页面）
      {
        matches,
        css: ['css/v2ex-effect.css'],
        js: ['scripts/jquery.min.js', 'scripts/common.min.js'],
        all_frames: true,
      },

      // 4. 首页专用功能（排除特定页面）
      {
        matches,
        exclude_matches: [
          '*://*/t/*', // 排除主题页
          '*://*/notes/*', // 排除笔记页
          '*://*/settings', // 排除设置页
          '*://*/write', // 排除发帖页
          '*://*/member/*', // 排除用户页
        ],
        js: ['scripts/jquery.min.js', 'scripts/v2ex-home.min.js'],
        all_frames: true,
      },

      // 5-10. 各页面类型的专用功能脚本
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
        matches: settingsMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-settings.min.js'],
        all_frames: true,
      },
      {
        matches: notificationsMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-notifications.min.js'],
        all_frames: true,
      },
      {
        matches: nodeMatches,
        js: ['scripts/jquery.min.js', 'scripts/v2ex-go.min.js'],
        all_frames: true,
      },

      // 11. 图标切换功能（全局）
      {
        matches,
        js: ['scripts/toggle-icon.min.js'],
        all_frames: true,
      },
    ],

    // 后台服务脚本配置
    background: {
      service_worker: 'scripts/background.min.js',
    },

    // Web 可访问资源配置
    web_accessible_resources: [
      {
        matches,
        resources: ['scripts/web_accessible_resources.min.js'],
      },
    ],

    // 选项页面配置
    options_ui: {
      page: 'pages/options.html',
      open_in_tab: true, // 在新标签页中打开
    },

    // 扩展动作配置（工具栏图标点击行为）
    action: {
      default_title: 'V2EX Polish 用户面板',
      default_popup: 'pages/popup.html',
    },
  }
}

// 生成基础 manifest 配置
const manifest = generateManifest()

// 写入 Chrome 版本的 manifest.json
fs.writeFile(path.join('extension', 'manifest.json'), JSON.stringify(manifest), 'utf8', (err) => {
  if (err) {
    console.error('生成 Chrome manifest.json 失败:', err)
  } else {
    // eslint-disable-next-line no-console
    console.log('✅ Chrome manifest.json 生成成功')
  }
})

// 为 Firefox 创建特殊版本的 manifest
const manifestFirefox: Manifest = JSON.parse(JSON.stringify(manifest))

/**
 * Firefox 特殊配置处理
 *
 * Firefox 对 Manifest V3 的支持与 Chrome 存在差异，需要特殊处理：
 * 1. 添加 browser_specific_settings.gecko.id（Firefox 扩展 ID）
 * 2. 移除不支持的 sidePanel 权限
 * 3. 将 background.service_worker 改为 background.scripts
 */
Object.assign(manifestFirefox, {
  browser_specific_settings: {
    gecko: {
      id: 'leokudev@gmail.com', // Firefox 扩展唯一标识符
    },
  },
})

// 移除 Firefox 不支持的 sidePanel 权限
manifestFirefox.permissions = manifestFirefox.permissions?.filter(
  (permission) => permission !== 'sidePanel'
)

// 处理后台脚本配置差异
if (manifestFirefox.background) {
  const serviceWorker = manifestFirefox.background.service_worker

  // Firefox 使用 scripts 数组而非 service_worker
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-expect-error */
  delete manifestFirefox.background.service_worker

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-expect-error */
  manifestFirefox.background['scripts'] = [serviceWorker]
}

// 写入 Firefox 版本的 manifest.json
fs.writeFile(
  path.join('extension', 'manifest-firefox.json'),
  JSON.stringify(manifestFirefox),
  'utf8',
  (err) => {
    if (err) {
      console.error('生成 Firefox manifest-firefox.json 失败:', err)
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ Firefox manifest-firefox.json 生成成功')
    }
  }
)
