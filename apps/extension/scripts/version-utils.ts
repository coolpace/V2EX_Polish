/**
 * 构建期版本号工具
 *
 * 版本唯一来源仍是 apps/extension/package.json：manifest、userscript 元数据与 zip 名称
 * 都会在构建时读取该字段。本模块把「工作区版本」与「Git HEAD 版本」做比较，并提供
 * 升级与写回能力，供 check-version.ts 在生成任何产物之前调用。
 *
 * 纯逻辑（校验 / 比较 / 递增）与 IO（读文件 / 执行 git / 写文件）都支持参数注入，
 * 方便在 tests/ 中单测。
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'

import { extensionPackageJsonPath, workspaceRoot } from './config'

/** package.json 相对 Git 仓库根的路径；`git show` 的路径始终相对仓库根解析 */
export const VERSION_PACKAGE_GIT_PATH = 'apps/extension/package.json'

/** 语义化版本 x.y.z，各段不允许前导零 */
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

/** 只匹配 package.json 中带缩进的 version 字段行，避免重写整个 JSON */
const VERSION_FIELD_REGEX = /^(\s*"version"\s*:\s*")([^"]+)(")/gm

export type VersionBumpType = 'patch' | 'minor' | 'major'

export type VersionChangeStatus = 'first-commit' | 'bumped' | 'unchanged' | 'downgraded'

export interface VersionChangeResult {
  status: VersionChangeStatus
  /** HEAD 中的版本；无历史版本时为 null */
  committed: string | null
  /** 当前工作区的版本 */
  current: string
}

export interface VersionCheckOptions {
  packageJsonPath?: string
  gitRoot?: string
  gitPath?: string
}

export function isValidSemver(version: string): boolean {
  return SEMVER_REGEX.test(version)
}

function parseSemver(version: string): [number, number, number] {
  if (!isValidSemver(version)) {
    throw new Error(`无效的版本号格式: ${version}（应为 x.y.z，例如 2.5.7）`)
  }

  const [major, minor, patch] = version.split('.').map(Number)

  return [major, minor, patch]
}

/** a > b 返回 1，a < b 返回 -1，相等返回 0 */
export function compareVersions(a: string, b: string): number {
  if (a === b) {
    return 0
  }

  const [aMajor, aMinor, aPatch] = parseSemver(a)
  const [bMajor, bMinor, bPatch] = parseSemver(b)

  if (aMajor !== bMajor) {
    return aMajor > bMajor ? 1 : -1
  }

  if (aMinor !== bMinor) {
    return aMinor > bMinor ? 1 : -1
  }

  if (aPatch !== bPatch) {
    return aPatch > bPatch ? 1 : -1
  }

  return 0
}

export function incrementVersion(current: string, type: VersionBumpType): string {
  const [major, minor, patch] = parseSemver(current)
  const candidates: Record<VersionBumpType, string> = {
    patch: `${major}.${minor}.${patch + 1}`,
    minor: `${major}.${minor + 1}.0`,
    major: `${major + 1}.0.0`,
  }

  return candidates[type]
}

/** 把 patch / minor / major 或显式 x.y.z 解析为「大于当前版本」的目标版本 */
export function resolveBumpVersion(value: string, current: string): string {
  if (value === 'patch' || value === 'minor' || value === 'major') {
    return incrementVersion(current, value)
  }

  if (!isValidSemver(value)) {
    throw new Error(`无效的升级参数: ${value}（支持 patch / minor / major / x.y.z）`)
  }

  if (compareVersions(value, current) <= 0) {
    throw new Error(`目标版本 ${value} 必须大于当前版本 ${current}`)
  }

  return value
}

export function readPackageVersion(packageJsonPath: string = extensionPackageJsonPath): string {
  let raw: string

  try {
    raw = fs.readFileSync(packageJsonPath, 'utf8')
  }
  catch (error) {
    throw new Error(`无法读取 ${packageJsonPath}: ${(error as Error).message}`, { cause: error })
  }

  let version: unknown

  try {
    version = (JSON.parse(raw) as { version?: unknown }).version
  }
  catch (error) {
    throw new Error(`${packageJsonPath} 不是合法的 JSON: ${(error as Error).message}`, {
      cause: error,
    })
  }

  if (typeof version !== 'string' || !isValidSemver(version)) {
    throw new Error(`${packageJsonPath} 中的 version 无效: ${String(version)}（应为 x.y.z）`)
  }

  return version
}

/**
 * 读取 HEAD 提交中的版本号。
 *
 * 非 Git 仓库、无提交历史、路径不存在、git 不可用等场景统一退化为 null
 * （视为「无历史版本」），这样在全新克隆或离线环境下也不会阻断构建。
 */
export function getCommittedVersion(options: VersionCheckOptions = {}): string | null {
  const gitRoot = options.gitRoot ?? workspaceRoot
  const gitPath = options.gitPath ?? VERSION_PACKAGE_GIT_PATH

  try {
    const raw = execFileSync('git', ['show', `HEAD:${gitPath}`], {
      cwd: gitRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const version = (JSON.parse(raw) as { version?: unknown }).version

    return typeof version === 'string' && isValidSemver(version) ? version : null
  }
  catch (error) {
    const err = error as NodeJS.ErrnoException
    const message = err.message ?? ''

    if (
      err.code === 'ENOENT'
      || message.includes('fatal:')
      || message.includes('not a git repository')
      || message.includes('does not have any commits yet')
      || message.includes('bad revision')
    ) {
      return null
    }

    throw new Error(`读取 Git HEAD 版本失败: ${message}`, { cause: error })
  }
}

export function checkVersionChange(options: VersionCheckOptions = {}): VersionChangeResult {
  const current = readPackageVersion(options.packageJsonPath)
  const committed = getCommittedVersion(options)

  if (!committed) {
    return { status: 'first-commit', committed: null, current }
  }

  const result = compareVersions(current, committed)

  if (result > 0) {
    return { status: 'bumped', committed, current }
  }

  if (result < 0) {
    return { status: 'downgraded', committed, current }
  }

  return { status: 'unchanged', committed, current }
}

/**
 * 只替换 package.json 中的 version 字段，保留文件其余内容与格式，
 * 避免整体 JSON 序列化带来无关 diff。
 */
export function updatePackageVersion(
  newVersion: string,
  packageJsonPath: string = extensionPackageJsonPath,
): void {
  if (!isValidSemver(newVersion)) {
    throw new Error(`无效的新版本号: ${newVersion}（应为 x.y.z）`)
  }

  const raw = fs.readFileSync(packageJsonPath, 'utf8')
  const fields = [...raw.matchAll(VERSION_FIELD_REGEX)]

  if (fields.length !== 1) {
    throw new Error(
      `${packageJsonPath} 中需要且只能有一个 version 字段，实际找到 ${fields.length} 个`,
    )
  }

  const field = fields[0]
  const start = field.index ?? 0
  const updated = `${raw.slice(0, start)}${field[1]}${newVersion}${field[3]}${raw.slice(start + field[0].length)}`

  fs.writeFileSync(packageJsonPath, updated, 'utf8')
}
