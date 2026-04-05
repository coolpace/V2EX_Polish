import fs from 'node:fs'
import path from 'node:path'

import {
  EXTENSION_TARGETS,
  extensionDistRoot,
  extensionPublicImagesRoot,
  extensionPublicPagesRoot,
  extensionPublicScriptsRoot,
  extensionPublicVendorRoot,
  type ExtensionTarget,
  getExtensionBuildRoot,
  getExtensionBuildScriptsRoot,
} from './config'

/**
 * Phase 4 组装脚本。
 * 作用：清理 `apps/extension/dist`，并将静态资源铺设到 `dist/<target>`。
 * 动态产物（css/scripts/manifest/userscript）由各自构建步骤直接写入 dist。
 */

/**
 * 删除目录（若存在）。
 * @param folderPath 绝对或相对目录路径
 */
function removeDirectory(folderPath: string) {
  const exists = fs.existsSync(folderPath)

  if (exists) {
    fs.rmSync(folderPath, { recursive: true, force: true })
  }
}

function ensureDirectory(folderPath: string) {
  fs.mkdirSync(folderPath, { recursive: true })
}

/**
 * 递归复制目录，并过滤掉系统垃圾文件。
 */
function copyDirectory(source: string, target: string) {
  if (!fs.existsSync(source)) {
    throw new Error(`源文件夹不存在：${source}`)
  }

  fs.cpSync(source, target, {
    recursive: true,
    filter(src) {
      return path.basename(src) !== '.DS_Store'
    },
  })
}

function copyFile(source: string, target: string) {
  ensureDirectory(path.dirname(target))
  fs.cpSync(source, target)
}

function prepareTarget(target: ExtensionTarget) {
  const targetRoot = getExtensionBuildRoot(target)
  const targetScriptsRoot = getExtensionBuildScriptsRoot(target)

  ensureDirectory(targetRoot)
  ensureDirectory(targetScriptsRoot)

  copyDirectory(extensionPublicImagesRoot, path.join(targetRoot, 'images'))
  copyDirectory(extensionPublicPagesRoot, path.join(targetRoot, 'pages'))
  copyDirectory(extensionPublicScriptsRoot, targetScriptsRoot)
  copyFile(
    path.join(extensionPublicVendorRoot, 'jquery.min.js'),
    path.join(targetScriptsRoot, 'jquery.min.js'),
  )
}

removeDirectory(extensionDistRoot)
ensureDirectory(extensionDistRoot)

for (const target of EXTENSION_TARGETS) {
  prepareTarget(target)
}
