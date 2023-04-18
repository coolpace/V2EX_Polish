import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputFile = resolve(__dirname, './style.ts')

writeFileSync(outputFile, 'export const style = `✨`')

const css1 = readFileSync(resolve(__dirname, '../../extension/css/v2ex-theme-var.css'), 'utf8')
const css2 = readFileSync(resolve(__dirname, '../../extension/css/v2ex-theme-default.css'), 'utf8')
const css3 = readFileSync(resolve(__dirname, '../../extension/css/v2ex-effect.css'), 'utf8')

const contentToReplace = readFileSync(outputFile, 'utf8')
const newContent = contentToReplace.replace('✨', css1 + css2 + css3)

writeFileSync(outputFile, newContent)
