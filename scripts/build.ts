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
 * 删除目录（若存在）。
 * @param folderPath 绝对或相对目录路径
 */
function removeDirectory(folderPath: string) {
  const exists = fs.existsSync(folderPath)

  if (exists) {
    fs.rmSync(folderPath, { recursive: true, force: true })
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
  const sourceExists = fs.existsSync(source)

  if (!sourceExists) {
    throw new Error('源文件夹不存在。')
  }

  // 确保输出为干净目录：若存在则先删除。
  removeDirectory(target)

  // 使用 fs.cpSync 执行递归复制，并保留排除语义。
  // 说明：当 excludeFile 指定时，忽略所有 basename 等于该值的文件。
  const filter = (src: string) => {
    let allowed = true

    if (exclude) {
      const basename = path.basename(src)

      if (basename === exclude) {
        allowed = false
      }
    }

    return allowed
  }

  fs.cpSync(source, target, { recursive: true, filter })

  // Firefox 构建：将浏览器专属清单重命名为标准文件名，便于后续打包与加载。
  if (target === 'build-firefox') {
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
