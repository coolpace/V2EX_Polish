import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  extensionUserscriptRoot,
  getExtensionBuildCssRoot,
} from './config.ts'

const outputFile = resolve(extensionUserscriptRoot, './style.ts')
const cssRoot = getExtensionBuildCssRoot('chrome')

const cssVar = readFileSync(resolve(cssRoot, 'v2ex-theme-var.css'), 'utf8')
const cssThemeLightDefault = readFileSync(resolve(cssRoot, 'v2ex-theme-default.css'), 'utf8')
const cssThemeDarkDefault = readFileSync(resolve(cssRoot, 'v2ex-theme-dark.css'), 'utf8')
const cssThemeRosePineDawn = readFileSync(resolve(cssRoot, 'v2ex-theme-dawn.css'), 'utf8')
const cssEffect = readFileSync(resolve(cssRoot, 'v2ex-effect.css'), 'utf8')

const style = [
  cssVar,
  cssThemeLightDefault,
  cssThemeDarkDefault,
  cssThemeRosePineDawn,
  cssEffect,
].join('')

writeFileSync(outputFile, `export const style = ${JSON.stringify(style)}\n`)
