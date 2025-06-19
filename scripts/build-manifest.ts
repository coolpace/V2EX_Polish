/* eslint-disable no-console */
/**
 * V2EX Polish 扩展 Manifest 构建脚本
 *
 * 主要功能：
 * 1. 自动生成适用于 Chrome 和 Firefox 的 manifest.json 文件
 * 2. 统一管理扩展的配置信息，避免手动维护多个配置文件
 * 3. 根据不同浏览器的特性自动调整配置项
 * 4. 支持选择主要目标浏览器
 *
 * 使用方法：
 * - 默认（Chrome 为主）：bun scripts/build-manifest.ts
 * - Chrome 为主：bun scripts/build-manifest.ts --target chrome
 * - Firefox 为主：bun scripts/build-manifest.ts --target firefox
 * - 显示帮助：bun scripts/build-manifest.ts --help
 *
 * 生成的文件（Chrome 为主）：
 * - extension/manifest.json (Chrome 版本)
 * - extension/manifest-firefox.json (Firefox 版本)
 *
 * 生成的文件（Firefox 为主）：
 * - extension/manifest.json (Firefox 版本)
 * - extension/manifest-chrome.json (Chrome 版本)
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
 * 支持的目标浏览器类型
 */
type TargetBrowser = 'chrome' | 'firefox'

/**
 * 命令行参数配置接口
 */
interface BuildOptions {
  target: TargetBrowser // 主要目标浏览器
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
      case '-t': {
        const target = args[++i]
        if (target === 'chrome' || target === 'firefox') {
          options.target = target
        } else {
          console.error(`❌ 无效的目标浏览器: ${target}，支持的值: chrome, firefox`)
          process.exit(1)
        }
        break
      }
      case '--help':
      case '-h':
        options.help = true
        break
      default:
        if (arg.startsWith('--')) {
          console.warn(`⚠️  未知参数: ${arg}`)
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
  console.log(`
V2EX Polish Manifest 构建工具

用法：
  bun scripts/build-manifest.ts [选项]

选项：
  --target, -t <浏览器>    设置主要目标浏览器 (chrome | firefox)
  --help, -h               显示此帮助信息

目标浏览器：
  chrome                   以 Chrome 为主要目标 (默认)
                          生成: manifest.json (Chrome) + manifest-firefox.json
  firefox                  以 Firefox 为主要目标
                          生成: manifest.json (Firefox) + manifest-chrome.json

示例：
  bun scripts/build-manifest.ts                    # 默认，Chrome 为主
  bun scripts/build-manifest.ts --target chrome    # Chrome 为主
  bun scripts/build-manifest.ts --target firefox   # Firefox 为主
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

/**
 * 将 Chrome manifest 转换为 Firefox 兼容版本
 *
 * @param chromeManifest - Chrome 版本的 manifest
 * @returns Firefox 兼容的 manifest
 */
const convertToFirefoxManifest = (chromeManifest: Manifest): Manifest => {
  const firefoxManifest: Manifest = JSON.parse(JSON.stringify(chromeManifest))

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
    (permission) => permission !== 'sidePanel'
  )

  // 处理后台脚本配置差异
  if (firefoxManifest.background) {
    const serviceWorker = firefoxManifest.background.service_worker

    // Firefox 使用 scripts 数组而非 service_worker
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-expect-error */
    delete firefoxManifest.background.service_worker

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-expect-error */
    firefoxManifest.background['scripts'] = [serviceWorker]
  }

  return firefoxManifest
}

/**
 * 写入文件的 Promise 版本
 */
const writeFileAsync = (filePath: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * 安全删除文件的 Promise 版本
 *
 * 先检查文件是否存在，存在则删除，不存在则直接返回
 * 返回值表示是否真正删除了文件
 */
const deleteFileAsync = (filePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 先检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在，返回 false
        resolve(false)
        return
      }

      // 文件存在，执行删除操作
      fs.unlink(filePath, () => {
        // 删除完成，返回 true
        resolve(true)
      })
    })
  })
}

/**
 * 清理所有现有的 manifest 文件
 *
 * 删除 extension 目录下所有以 manifest 开头的 JSON 文件，
 * 确保生成新文件前没有旧文件残留
 * 只有文件真正存在并被删除时才会打印删除信息
 */
const cleanupManifestFiles = async (): Promise<void> => {
  const extensionDir = path.join('extension')
  const manifestFiles = ['manifest.json', 'manifest-chrome.json', 'manifest-firefox.json']

  console.log('🧹 清理现有的 manifest 文件...')

  const deleteResults = await Promise.all(
    manifestFiles.map(async (filename) => {
      const filePath = path.join(extensionDir, filename)
      const wasDeleted = await deleteFileAsync(filePath)
      return { filename, wasDeleted }
    })
  )

  // 只打印真正被删除的文件
  const deletedFiles = deleteResults.filter((result) => result.wasDeleted)
  if (deletedFiles.length > 0) {
    deletedFiles.forEach(({ filename }) => {
      console.log(`   删除: ${filename}`)
    })
  } else {
    console.log('   没有找到需要清理的文件')
  }

  console.log('✅ manifest 文件清理完成')
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
  console.log('🚀 开始构建 V2EX Polish Manifest 文件...')
  console.log(`🎯 主要目标浏览器: ${options.target}`)

  try {
    // 首先清理所有现有的 manifest 文件
    await cleanupManifestFiles()

    // 生成基础 Chrome manifest 配置
    const chromeManifest = generateManifest()

    // 生成 Firefox manifest 配置
    const firefoxManifest = convertToFirefoxManifest(chromeManifest)

    if (options.target === 'chrome') {
      // Chrome 为主：manifest.json (Chrome) + manifest-firefox.json (Firefox)
      await Promise.all([
        writeFileAsync(
          path.join('extension', 'manifest.json'),
          JSON.stringify(chromeManifest, null, 2)
        ),
        writeFileAsync(
          path.join('extension', 'manifest-firefox.json'),
          JSON.stringify(firefoxManifest, null, 2)
        ),
      ])

      console.log('✅ manifest.json (Chrome) 生成成功')
      console.log('✅ manifest-firefox.json (Firefox) 生成成功')
    } else {
      // Firefox 为主：manifest.json (Firefox) + manifest-chrome.json (Chrome)
      await Promise.all([
        writeFileAsync(
          path.join('extension', 'manifest.json'),
          JSON.stringify(firefoxManifest, null, 2)
        ),
        writeFileAsync(
          path.join('extension', 'manifest-chrome.json'),
          JSON.stringify(chromeManifest, null, 2)
        ),
      ])

      console.log('✅ manifest.json (Firefox) 生成成功')
      console.log('✅ manifest-chrome.json (Chrome) 生成成功')
    }

    console.log('🎉 Manifest 文件构建完成！')
  } catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  }
}

// 执行主程序
main()
