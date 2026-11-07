#!/usr/bin/env bun

/**
 * 构建前版本检查（由 `pnpm build` 在生成任何产物之前调用）
 *
 * - 工作区版本相对 Git HEAD 已升级 / 无历史版本 → 直接通过
 * - 版本未变更或降级 → 交互式选择 patch / minor / major / 自定义版本，并写回 package.json
 * - 非交互环境（CI、管道）→ 只提示不阻塞，版本一致性由发布 tag 校验负责
 * - --bump / V2EX_VERSION_BUMP → 无提示自动升级，便于脚本化构建
 * - --skip / V2EX_SKIP_VERSION_CHECK=1 → 显式跳过检查
 *
 * 交互复用项目已有的 consola.prompt（内置 clack 风格菜单），不引入新依赖。
 */

import process from 'node:process'

import { consola } from 'consola'

import {
  checkVersionChange,
  compareVersions,
  incrementVersion,
  isValidSemver,
  readPackageVersion,
  resolveBumpVersion,
  updatePackageVersion,
  type VersionBumpType,
} from './version-utils'

/** consola.prompt({ cancel: 'symbol' }) 在 Esc / Ctrl+C 时返回该符号 */
const CANCEL = Symbol.for('cancel')

const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  USER_CANCELLED: 130,
} as const

type MainAction = 'update' | 'skip' | 'cancel'
type VersionAction = VersionBumpType | 'custom' | 'back'
type InteractiveResult = 'updated' | 'skipped' | 'cancelled'

interface SelectOption<T extends string> {
  value: T
  label: string
  hint?: string
}

interface CliOptions {
  bump: string | null
  skip: boolean
}

function parseCliOptions(argv: string[]): CliOptions {
  const options: CliOptions = {
    bump: process.env.V2EX_VERSION_BUMP ?? null,
    skip: process.env.V2EX_SKIP_VERSION_CHECK === '1',
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--bump' || arg === '-b') {
      options.bump = argv[++index] ?? null
    }
    else if (arg.startsWith('--bump=')) {
      options.bump = arg.slice('--bump='.length)
    }
    else if (arg === '--skip') {
      options.skip = true
    }
  }

  return options
}

function isNonInteractive(): boolean {
  return !process.stdin.isTTY || Boolean(process.env.CI) || Boolean(process.env.GITHUB_ACTIONS)
}

function isCancelled(value: unknown): value is symbol {
  return value === CANCEL
}

async function select<T extends string>(
  message: string,
  options: SelectOption<T>[],
  initial: T,
): Promise<T | symbol> {
  const result = await consola.prompt(message, {
    type: 'select',
    options,
    initial,
    cancel: 'symbol',
  })

  return result as T | symbol
}

async function text(message: string, placeholder: string): Promise<string | symbol> {
  return await consola.prompt(message, {
    type: 'text',
    placeholder,
    cancel: 'symbol',
  })
}

async function confirm(message: string): Promise<boolean> {
  const result = await consola.prompt(message, {
    type: 'confirm',
    initial: true,
    cancel: 'symbol',
  })

  return result === true
}

/** 自定义版本输入：格式与「必须大于当前版本」校验失败时留在当前页重试 */
async function askCustomVersion(current: string): Promise<string | null> {
  while (true) {
    const value = await text('输入新版本号（留空或按 Esc 返回上一级）', current)

    if (isCancelled(value) || value.trim() === '') {
      return null
    }

    const candidate = value.trim()

    if (!isValidSemver(candidate)) {
      consola.warn('版本号格式不正确，应为 x.y.z（如 2.5.8）')
      continue
    }

    if (compareVersions(candidate, current) <= 0) {
      consola.warn(`新版本号必须大于当前版本 ${current}`)
      continue
    }

    return candidate
  }
}

/** 版本选择 → 确认，返回写回的目标版本；null 表示回到主菜单 */
async function chooseVersion(current: string): Promise<string | null> {
  const versions: Record<VersionBumpType, string> = {
    patch: incrementVersion(current, 'patch'),
    minor: incrementVersion(current, 'minor'),
    major: incrementVersion(current, 'major'),
  }

  while (true) {
    const choice = await select<VersionAction>(
      '选择版本升级类型',
      [
        { value: 'patch', label: 'Patch', hint: `${current} → ${versions.patch}` },
        { value: 'minor', label: 'Minor', hint: `${current} → ${versions.minor}` },
        { value: 'major', label: 'Major', hint: `${current} → ${versions.major}` },
        { value: 'custom', label: '自定义版本号' },
        { value: 'back', label: '← 返回上一级（Esc）' },
      ],
      'patch',
    )

    if (isCancelled(choice) || choice === 'back') {
      return null
    }

    const target = choice === 'custom' ? await askCustomVersion(current) : versions[choice]

    if (target === null) {
      continue
    }

    if (await confirm(`确认将版本号更新为 ${target}？`)) {
      return target
    }
  }
}

async function runInteractive(current: string): Promise<InteractiveResult> {
  while (true) {
    const action = await select<MainAction>(
      '版本号未更新，请选择操作',
      [
        { value: 'update', label: '更新版本号后继续构建（推荐）' },
        { value: 'skip', label: '跳过检查，继续构建' },
        { value: 'cancel', label: '取消构建' },
      ],
      'update',
    )

    if (isCancelled(action) || action === 'cancel') {
      return 'cancelled'
    }

    if (action === 'skip') {
      return 'skipped'
    }

    const target = await chooseVersion(current)

    if (target === null) {
      continue
    }

    updatePackageVersion(target)

    return 'updated'
  }
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2))
  const change = checkVersionChange()

  // 脚本化构建：显式指定升级类型时不弹菜单，直接写回版本号
  if (options.bump) {
    const target = resolveBumpVersion(options.bump, change.current)

    updatePackageVersion(target)
    consola.success(`版本号已自动更新：${change.current} → ${target}`)

    return
  }

  if (options.skip) {
    consola.info('已跳过构建前版本检查。')

    return
  }

  if (change.status === 'first-commit') {
    consola.info(`未找到历史版本，使用当前版本 ${change.current} 继续构建。`)

    return
  }

  if (change.status === 'bumped') {
    consola.success(`版本号已更新：${change.committed} → ${change.current}`)

    return
  }

  // CI / 管道中无法交互；发布流程另有 tag 与 package.json 版本一致性校验
  if (isNonInteractive()) {
    consola.warn(`非交互环境，跳过版本升级（当前 ${change.current}，HEAD ${change.committed}）。`)
    consola.warn('发布时请确认 apps/extension/package.json 版本与 Git tag 一致。')

    return
  }

  consola.info(`当前版本 ${change.current} · HEAD 版本 ${change.committed}`)

  if (change.status === 'downgraded') {
    consola.warn('当前版本号低于 HEAD 版本，请确认是否重新升级。')
  }
  else {
    consola.warn('当前版本号与 HEAD 相同，本次构建建议使用新版本号。')
  }

  const result = await runInteractive(change.current)

  if (result === 'cancelled') {
    consola.error('构建已取消。')
    process.exit(EXIT_CODES.USER_CANCELLED)
  }

  if (result === 'skipped') {
    consola.info('跳过版本更新，使用当前版本继续构建。')

    return
  }

  consola.success(`版本号已更新为 ${readPackageVersion()}，继续构建。`)
}

main().catch((error: unknown) => {
  consola.error(`版本检查失败: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(EXIT_CODES.ERROR)
})
