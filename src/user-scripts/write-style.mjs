import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 输出文件路径：要将样式文件内容写入到此文件。
const outputFile = resolve(__dirname, './style.ts')

// 初始化输出文件：输出文件内容为「✨」。
writeFileSync(outputFile, 'export const style = `✨`')

const cssVar = readFileSync(resolve(__dirname, '../../extension/css/v2ex-theme-var.css'), 'utf8')
const cssThemeLightDefault = readFileSync(
  resolve(__dirname, '../../extension/css/v2ex-theme-default.css'),
  'utf8'
)
const cssThemeDarkDefault = readFileSync(
  resolve(__dirname, '../../extension/css/v2ex-theme-dark.css'),
  'utf8'
)
const cssThemeRosePineDawn = readFileSync(
  resolve(__dirname, '../../extension/css/v2ex-theme-dawn.css'),
  'utf8'
)
const cssEffect = readFileSync(resolve(__dirname, '../../extension/css/v2ex-effect.css'), 'utf8')

const contentToReplace = readFileSync(outputFile, 'utf8')

// 将样式文件内容写入输出文件：将「✨」替换为样式文件内容。
const newContent = contentToReplace.replace(
  '✨',
  cssVar + cssThemeLightDefault + cssThemeDarkDefault + cssThemeRosePineDawn + cssEffect
)

writeFileSync(outputFile, newContent)
