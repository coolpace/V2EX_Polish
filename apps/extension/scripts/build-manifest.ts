/**
 * V2EX Polish 扩展 Manifest 构建脚本
 *
 * 主要功能：
 * 1. 自动生成适用于 Chrome 和 Firefox 的 manifest.json 文件
 * 2. 统一管理扩展的配置信息，避免手动维护多个配置文件
 * 3. 根据不同浏览器的特性自动调整配置项
 * 4. 支持选择主要目标浏览器
 * 5. 版本号统一从 package.json 读取（见 getPackageVersion），无需在脚本或 manifest 中重复维护
 *
 * 使用方法：
 * - 默认（Chrome 为主）：bun scripts/build-manifest.ts
 * - Chrome 为主：bun scripts/build-manifest.ts --target chrome
 * - Firefox 为主：bun scripts/build-manifest.ts --target firefox
 * - 显示帮助：bun scripts/build-manifest.ts --help
 *
 * 生成的文件：
 * - apps/extension/dist/chrome/manifest.json
 * - apps/extension/dist/firefox/manifest.json
 *
 * 解决的问题：
 * - Chrome 和 Firefox 对 Manifest V3 的支持存在差异
 * - 手动维护多个 manifest 文件容易出错且效率低下
 * - 需要为多个 V2EX 域名生成匹配规则
 * - 支持灵活选择主要目标浏览器
 *
 * 主要差异处理：
 * - Firefox 不支持 sidePanel 权限，会自动过滤
 * - Firefox 使用 background.scripts 而非 background.service_worker
 * - Firefox 需要添加 browser_specific_settings.gecko.id
 */

import fs from 'node:fs'
import path from 'node:path'

import { consola } from 'consola'

import { V2EX_DOMAINS } from '../shared/v2ex-domains'
import {
  EXTENSION_TARGETS,
  type ExtensionTarget,
  getExtensionManifestPath,
  readExtensionPackageJson,
} from './config'

/**
 * 从 package.json 读取版本号，统一版本来源。
 *
 * 失败时抛出错误，由上层捕获并终止构建，以避免产生不一致的 Manifest。
 */
function getPackageVersion(): string {
  return readExtensionPackageJson().version
}

// 将版本读取操作放在生成时机，便于被主流程的 try/catch 捕获并输出一致化日志。

/**
 * 可注入与授权的 V2EX 主机名白名单。
 *
 * 用途：
 * - 生成 host_permissions（权限声明）
 * - 生成 content_scripts[].matches / exclude_matches（内容脚本注入范围）
 * - 生成 web_accessible_resources[].matches（可访问资源范围）
 * Chrome 与 Firefox 构建共用此列表。
 *
 * 覆盖范围：
 * - 主域名：v2ex.com, www.v2ex.com
 * - 地区镜像：cn, jp, de, us, hk, global
 * - 特殊用途：fast（CDN 加速）、s（短链接）、origin（源站）
 * - 开发/测试：staging（测试环境，发布前如无必要可移除）
 *
 * 维护说明：
 * - 仅填写主机名，不包含协议与路径，例如 "v2ex.com"
 * - 变更此列表会同时影响权限与脚本注入域，请审慎评估
 * - 不要添加通配符或端口；路径后缀在下游规则中统一追加
 * - 域名列表从 apps/extension/shared/v2ex-domains.ts 导入，统一维护
 */
export const HOSTS = V2EX_DOMAINS

type ManifestRunAt = 'document_start' | 'document_end' | 'document_idle'

interface ManifestContentScript {
  matches: string[]
  exclude_matches?: string[]
  css?: string[]
  js?: string[]
  run_at?: ManifestRunAt
  all_frames?: boolean
}

interface ManifestBackground {
  service_worker?: string
  scripts?: string[]
}

interface ManifestWebAccessibleResource {
  matches: string[]
  resources: string[]
}

interface ManifestOptionsUi {
  page: string
  open_in_tab?: boolean
}

interface ManifestAction {
  default_title?: string
  default_popup?: string
}

interface ManifestBrowserSpecificSettings {
  gecko: {
    id: string
  }
}

interface Manifest {
  manifest_version: 3
  name: string
  version: string
  description: string
  permissions?: string[]
  host_permissions?: string[]
  icons?: Record<number, string>
  content_scripts?: ManifestContentScript[]
  background?: ManifestBackground
  web_accessible_resources?: ManifestWebAccessibleResource[]
  options_ui?: ManifestOptionsUi
  action?: ManifestAction
  browser_specific_settings?: ManifestBrowserSpecificSettings
}

/**
 * 支持的目标浏览器类型
 */
/**
 * 命令行参数配置接口
 */
interface BuildOptions {
  target: ExtensionTarget // 主要目标浏览器
  help?: boolean // 显示帮助信息
}

/**
 * 解析命令行参数
 *
 * 支持的参数格式：
 * - --target chrome
 * - --target firefox
 * - --help
 */
const parseArgs = (): BuildOptions => {
  const args = process.argv.slice(2)
  const options: BuildOptions = {
    target: 'chrome', // 默认以 Chrome 为主
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--target':
        // fall through

      case '-t': {
        const target = args[++i]

        if (EXTENSION_TARGETS.includes(target as ExtensionTarget)) {
          options.target = target as ExtensionTarget
        }
        else {
          consola.error(`❌ 无效的目标浏览器: ${target}，支持的值: chrome, firefox`)
          process.exit(1)
        }

        break
      }

      case '--help':
        // fall through

      case '-h':
        options.help = true
        break

      default:
        if (arg.startsWith('--')) {
          consola.warn(`⚠️  未知参数: ${arg}`)
        }

        break
    }
  }

  return options
}

/**
 * 显示帮助信息
 */
const showHelp = () => {
  consola.log(`
V2EX Polish Manifest 构建工具

用法：
  bun scripts/build-manifest.ts [选项]

选项：
  --target, -t <浏览器>    设置主要目标浏览器 (chrome | firefox)
  --help, -h               显示此帮助信息

目标浏览器：
  chrome                   生成 dist/chrome/manifest.json (默认)
  firefox                  生成 dist/firefox/manifest.json

示例：
  bun scripts/build-manifest.ts                    # 默认，生成 Chrome manifest
  bun scripts/build-manifest.ts --target chrome    # 生成 Chrome manifest
  bun scripts/build-manifest.ts --target firefox   # 生成 Firefox manifest
`)
}

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
   * - 可选地为不带尾部斜杠的基础路径（如 /write, /settings, /notifications）
   *   额外生成带 query string 的匹配规则（例如 /write?*），用于覆盖
   *   `/write?node=create` 这类场景
   *
   * @param suffix - 可选的路径后缀，如 't', 'write', 'member' 等
   * @param addQueryForBasePath - 是否为基础路径额外生成 `?*` 匹配，仅用于
   *   像 /write、/settings、/notifications 这类不带尾部斜杠但可能携带
   *   query string 的页面。对带有子路径前缀（如 /t/*, /member/*）不需要
   *   开启此选项。
   * @returns {string[]} URL 匹配规则数组
   */
  const getMatches = (suffix?: string, addQueryForBasePath?: boolean) => {
    return HOSTS.reduce<string[]>((result, host) => {
      const base = `https://${host}`

      if (suffix) {
        const path = `/${suffix}`
        result.push(`${base}${path}/*`)

        if (addQueryForBasePath === true) {
          result.push(`${base}${path}?*`)
        }
      }
      else {
        result.push(`${base}/*`)
      }

      return result
    }, [])
  }

  // 为不同页面类型生成专用的匹配规则
  const matches = getMatches() // 全站匹配
  const topicMatches = getMatches('t') // 主题页面
  const writeMatches = getMatches('write', true) // 发帖页面
  const memberMatches = getMatches('member') // 用户页面
  const settingsMatches = getMatches('settings', true) // 设置页面
  const notificationsMatches = getMatches('notifications', true) // 通知页面
  const nodeMatches = getMatches('go') // 节点页面

  return {
    manifest_version: 3,

    name: 'V2EX Polish',

    version: getPackageVersion(),

    description: '专为 V2EX 用户设计，提供了丰富的扩展功能。',

    // 扩展所需的基本权限
    permissions: ['scripting', 'contextMenus', 'storage', 'alarms', 'sidePanel'],

    // 允许访问的主机权限（所有 V2EX 域名）
    host_permissions: matches,

    // 扩展图标配置（多尺寸适配）
    icons: {
      16: 'images/icon-16.png',
      32: 'images/icon-32.png',
      48: 'images/icon-48.png',
      128: 'images/icon-128.png',
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
          'css/v2ex-theme-minimalist.css',
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

/**
 * 将 Chrome manifest 转换为 Firefox 兼容版本
 *
 * @param chromeManifest - Chrome 版本的 manifest
 * @returns Firefox 兼容的 manifest
 */
const convertToFirefoxManifest = (chromeManifest: Manifest): Manifest => {
  const firefoxManifest = JSON.parse(JSON.stringify(chromeManifest)) as Manifest

  // 添加 Firefox 特有配置
  Object.assign(firefoxManifest, {
    browser_specific_settings: {
      gecko: {
        id: 'leokudev@gmail.com', // Firefox 扩展唯一标识符
      },
    },
  })

  // 移除 Firefox 不支持的 sidePanel 权限
  firefoxManifest.permissions = firefoxManifest.permissions?.filter(
    (permission) => permission !== 'sidePanel',
  )

  // 处理后台脚本配置差异
  if (firefoxManifest.background) {
    const serviceWorker = firefoxManifest.background.service_worker

    // Firefox 使用 scripts 数组而非 service_worker
    delete firefoxManifest.background.service_worker
    firefoxManifest.background.scripts = serviceWorker ? [serviceWorker] : []
  }

  return firefoxManifest
}

/**
 * 写入文件的 Promise 版本
 */
const writeFileAsync = async (filePath: string, content: string): Promise<void> => {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

// 主程序执行
const main = async () => {
  const options = parseArgs()

  // 显示帮助信息
  if (options.help) {
    showHelp()

    return
  }

  // 输出构建信息
  consola.start('🚀 开始构建 V2EX Polish Manifest 文件...')
  consola.info(`🎯 目标浏览器：${options.target}`)

  try {
    // 生成基础 Chrome manifest 配置
    const chromeManifest = generateManifest()

    if (options.target === 'chrome') {
      await writeFileAsync(
        getExtensionManifestPath('chrome'),
        JSON.stringify(chromeManifest, null, 2),
      )
      consola.success('✅ dist/chrome/manifest.json 生成成功')
    }
    else {
      const firefoxManifest = convertToFirefoxManifest(chromeManifest)
      await writeFileAsync(
        getExtensionManifestPath('firefox'),
        JSON.stringify(firefoxManifest, null, 2),
      )
      consola.success('✅ dist/firefox/manifest.json 生成成功')
    }

    consola.success('🎉 Manifest 文件构建完成！')
  }
  catch (error) {
    consola.error('❌ 构建失败:', error)
    process.exit(1)
  }
}

// 执行主程序
void main()
