import fs from 'node:fs'
import path from 'node:path'

/**
 * 构建脚本入口。
 * 作用：从 `extension` 目录拷贝源码到 `build-chrome` 与 `build-firefox`，
 * 并按浏览器差异处理清单文件（Manifest）。
 *
 * 使用场景：
 * - 在发布或本地调试前，生成浏览器可安装的扩展目录结构。
 *
 * 关键点：
 * - 先清空目标目录，再递归复制；
 * - 支持按文件名排除（如排除另一个浏览器的 manifest）；
 * - Firefox 目标会将 `manifest-firefox.json` 重命名为标准的 `manifest.json`。
 */

/**
 * 递归删除指定文件夹及其所有子内容。
 * 注意：为确保构建可重复执行，构建前会清理目标目录。
 * @param folderPath 绝对或相对目录路径
 */
function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })

    fs.rmdirSync(folderPath)
  }
}

interface BuildParams {
  /** 存放需要构建的源码的文件夹名称。 */
  source: string
  /** 构建输出的文件夹名称。 */
  target: string
  /** 不需要包含的文件。 */
  excludeFile?: string
}

/**
 * 递归复制 `source` 到 `target`，并执行浏览器差异化处理。
 * 拷贝规则：
 * - 如果指定了 `excludeFile`，在当前目录层级跳过该文件；
 * - 子目录继续递归处理；
 * - 构建完成后若 `target` 为空，删除之以避免产生空目录。
 * 特殊规则：
 * - 当 `target === 'build-firefox'` 时，将 `manifest-firefox.json` 重命名为 `manifest.json`。
 * @param params 构建参数
 */
function build({ source, target, excludeFile: exclude }: BuildParams) {
  // 校验源目录存在性。
  if (!fs.existsSync(source)) {
    throw new Error('源文件夹不存在。')
  }

  // 确保输出为干净目录：若存在则先删除，再重新创建。
  if (fs.existsSync(target)) {
    deleteFolderRecursive(target)
  }

  // 创建目标目录。
  fs.mkdirSync(target)

  // 列出当前源目录中的所有条目（文件/文件夹）。
  const files = fs.readdirSync(source)

  files.forEach((file) => {
    // 计算源与目标的完整路径，保持目录结构一致。
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)

    if (file !== exclude) {
      if (fs.statSync(sourcePath).isDirectory()) {
        // 子目录：递归构建。
        build({ source: sourcePath, target: targetPath })
      } else {
        // 普通文件：直接复制到目标目录。
        fs.copyFileSync(sourcePath, targetPath)
      }
    }
  })

  // 删除空的文件夹。
  // 目的：避免递归过程中产生无内容的空目录残留。
  if (fs.readdirSync(target).length === 0) {
    fs.rmdirSync(target)
  }

  if (target === 'build-firefox') {
    // Firefox 构建：将浏览器专属清单重命名为标准文件名，便于后续打包与加载。
    const oldFileName = path.join(target, 'manifest-firefox.json')
    const newFileName = path.join(target, 'manifest.json')

    if (fs.existsSync(oldFileName)) {
      fs.renameSync(oldFileName, newFileName)
    }
  }
}

// ==== 执行实际构建：分别生成 Chrome 与 Firefox 版本。 ====

// Chrome 版本：排除 Firefox 专用清单文件。
build({
  source: 'extension',
  target: 'build-chrome',
  excludeFile: 'manifest-firefox.json',
})

// Firefox 版本：排除 Chromium 清单文件，后续在目标目录中重命名其专用清单。
build({
  source: 'extension',
  target: 'build-firefox',
  excludeFile: 'manifest.json',
})
