import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const EXTENSION_TARGETS = ['chrome', 'firefox'] as const

export type ExtensionTarget = (typeof EXTENSION_TARGETS)[number]

export const extensionAppRoot = path.resolve(__dirname, '..')
export const workspaceRoot = path.resolve(extensionAppRoot, '../..')

export const extensionSourceRoot = path.join(extensionAppRoot, 'src')
export const extensionStylesRoot = path.join(extensionSourceRoot, 'styles')
export const extensionUserscriptRoot = path.join(extensionSourceRoot, 'user-scripts')
export const extensionPublicRoot = path.join(extensionAppRoot, 'public')
export const extensionPublicImagesRoot = path.join(extensionPublicRoot, 'images')
export const extensionPublicPagesRoot = path.join(extensionPublicRoot, 'pages')
export const extensionPublicScriptsRoot = path.join(extensionPublicRoot, 'scripts')
export const extensionPublicVendorRoot = path.join(extensionPublicRoot, 'vendor')

export const extensionDistRoot = path.join(extensionAppRoot, 'dist')
export const extensionBuildRoots: Record<ExtensionTarget, string> = {
  chrome: path.join(extensionDistRoot, 'chrome'),
  firefox: path.join(extensionDistRoot, 'firefox'),
}
export const extensionBuildCssRoots: Record<ExtensionTarget, string> = {
  chrome: path.join(extensionBuildRoots.chrome, 'css'),
  firefox: path.join(extensionBuildRoots.firefox, 'css'),
}
export const extensionBuildScriptsRoots: Record<ExtensionTarget, string> = {
  chrome: path.join(extensionBuildRoots.chrome, 'scripts'),
  firefox: path.join(extensionBuildRoots.firefox, 'scripts'),
}
export const extensionManifestPaths: Record<ExtensionTarget, string> = {
  chrome: path.join(extensionBuildRoots.chrome, 'manifest.json'),
  firefox: path.join(extensionBuildRoots.firefox, 'manifest.json'),
}
export const extensionPackagesRoots: Record<ExtensionTarget, string> = {
  chrome: path.join(extensionDistRoot, 'packages', 'chrome'),
  firefox: path.join(extensionDistRoot, 'packages', 'firefox'),
}

export const extensionPackageJsonPath = path.join(extensionAppRoot, 'package.json')
export const extensionUserscriptDistRoot = path.join(extensionDistRoot, 'userscript')
export const chromeProfileRoot = path.join(workspaceRoot, 'chrome-dist-profile')
export const firefoxProfileRoot = path.join(workspaceRoot, 'firefox-dist-profile')
export const extensionStartUrl = 'https://www.v2ex.com/'

export function readExtensionPackageJson(): {
  version: string
} {
  const raw = fs.readFileSync(extensionPackageJsonPath, 'utf8')
  const parsed = JSON.parse(raw) as { version?: unknown }

  if (typeof parsed.version !== 'string' || parsed.version.trim().length === 0) {
    throw new Error(`Invalid version in ${extensionPackageJsonPath}`)
  }

  return {
    version: parsed.version,
  }
}

export function isExtensionTarget(value: string | undefined): value is ExtensionTarget {
  return EXTENSION_TARGETS.includes(value as ExtensionTarget)
}

export function resolveExtensionTarget(value: string | undefined): ExtensionTarget {
  if (!isExtensionTarget(value)) {
    throw new Error(`Invalid extension target: ${value ?? '<empty>'}`)
  }

  return value
}

export function getExtensionBuildRoot(target: ExtensionTarget): string {
  return extensionBuildRoots[target]
}

export function getExtensionBuildCssRoot(target: ExtensionTarget): string {
  return extensionBuildCssRoots[target]
}

export function getExtensionBuildScriptsRoot(target: ExtensionTarget): string {
  return extensionBuildScriptsRoots[target]
}

export function getExtensionManifestPath(target: ExtensionTarget): string {
  return extensionManifestPaths[target]
}

export function getExtensionPackagesRoot(target: ExtensionTarget): string {
  return extensionPackagesRoots[target]
}
