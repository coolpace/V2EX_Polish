import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  checkVersionChange,
  compareVersions,
  getCommittedVersion,
  incrementVersion,
  isValidSemver,
  readPackageVersion,
  resolveBumpVersion,
  updatePackageVersion,
} from '../apps/extension/scripts/version-utils'

const tempDirs: string[] = []

function createPackageJson(version: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v2ex-version-'))
  const file = path.join(dir, 'package.json')

  tempDirs.push(dir)
  fs.writeFileSync(
    file,
    `{\n  "name": "probe",\n  "version": "${version}",\n  "private": true\n}\n`,
    'utf8',
  )

  return file
}

function commitPackage(dir: string): void {
  const options = { cwd: dir, stdio: 'pipe' as const }

  execFileSync('git', ['init', '-q'], options)
  execFileSync('git', ['add', 'package.json'], options)
  execFileSync(
    'git',
    [
      '-c',
      'user.name=V2EX Test',
      '-c',
      'user.email=test@example.com',
      'commit',
      '-q',
      '-m',
      'init',
    ],
    options,
  )
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('isValidSemver', () => {
  it('只接受不带前导零的 x.y.z', () => {
    for (const valid of ['0.0.0', '2.5.7', '10.20.30']) {
      expect(isValidSemver(valid)).toBe(true)
    }

    for (const invalid of [
      '2.5',
      '2.5.7.1',
      'v2.5.7',
      '2.05.7',
      '2.5.-1',
      '2.5.7-beta',
      '',
      ' 2.5.7',
    ]) {
      expect(isValidSemver(invalid)).toBe(false)
    }
  })
})

describe('compareVersions', () => {
  it('按 major / minor / patch 逐段比较，不做字符串比较', () => {
    expect(compareVersions('2.5.8', '2.5.7')).toBe(1)
    expect(compareVersions('2.6.0', '2.5.99')).toBe(1)
    expect(compareVersions('3.0.0', '2.99.99')).toBe(1)
    expect(compareVersions('2.10.0', '2.9.9')).toBe(1)
    expect(compareVersions('2.5.7', '2.5.7')).toBe(0)
    expect(compareVersions('2.5.6', '2.5.7')).toBe(-1)
  })

  it('非法版本号会抛错', () => {
    expect(() => compareVersions('2.5', '2.5.7')).toThrow(/无效的版本号格式/)
  })
})

describe('incrementVersion', () => {
  it('patch / minor / major 各自进位', () => {
    expect(incrementVersion('2.5.7', 'patch')).toBe('2.5.8')
    expect(incrementVersion('2.5.7', 'minor')).toBe('2.6.0')
    expect(incrementVersion('2.5.7', 'major')).toBe('3.0.0')
    expect(incrementVersion('2.9.9', 'patch')).toBe('2.9.10')
  })
})

describe('resolveBumpVersion', () => {
  it('支持升级类型与显式版本号', () => {
    expect(resolveBumpVersion('patch', '2.5.7')).toBe('2.5.8')
    expect(resolveBumpVersion('minor', '2.5.7')).toBe('2.6.0')
    expect(resolveBumpVersion('major', '2.5.7')).toBe('3.0.0')
    expect(resolveBumpVersion('3.0.0', '2.5.7')).toBe('3.0.0')
  })

  it('拒绝非法或不大于当前版本的目标', () => {
    expect(() => resolveBumpVersion('next', '2.5.7')).toThrow(/无效的升级参数/)
    expect(() => resolveBumpVersion('2.5.7', '2.5.7')).toThrow(/必须大于当前版本/)
    expect(() => resolveBumpVersion('2.5.6', '2.5.7')).toThrow(/必须大于当前版本/)
  })
})

describe('readPackageVersion / updatePackageVersion', () => {
  it('读取 package.json 中的版本号', () => {
    expect(readPackageVersion(createPackageJson('2.5.7'))).toBe('2.5.7')
  })

  it('缺少 version 或 JSON 非法时给出明确错误', () => {
    const file = createPackageJson('2.5.7')

    fs.writeFileSync(file, '{ "name": "probe" }', 'utf8')
    expect(() => readPackageVersion(file)).toThrow(/version 无效/)

    fs.writeFileSync(file, '{', 'utf8')
    expect(() => readPackageVersion(file)).toThrow(/不是合法的 JSON/)
  })

  it('写回时只替换 version 字段，保留文件其余内容与格式', () => {
    const file = createPackageJson('2.5.7')
    const before = fs.readFileSync(file, 'utf8')

    updatePackageVersion('2.6.0', file)

    expect(readPackageVersion(file)).toBe('2.6.0')
    expect(fs.readFileSync(file, 'utf8')).toBe(
      before.replace('"version": "2.5.7"', '"version": "2.6.0"'),
    )
  })

  it('拒绝非法版本号与含多个 version 字段的文件', () => {
    const file = createPackageJson('2.5.7')

    expect(() => updatePackageVersion('v2.5.8', file)).toThrow(/无效的新版本号/)

    fs.writeFileSync(
      file,
      '{\n  "version": "1.0.0",\n  "nested": {\n    "version": "2.0.0"\n  }\n}\n',
      'utf8',
    )
    expect(() => updatePackageVersion('3.0.0', file)).toThrow(/只能有一个 version 字段/)
  })
})

describe('checkVersionChange', () => {
  it('无 Git 历史时视为首次提交', () => {
    const file = createPackageJson('2.5.7')
    const dir = path.dirname(file)

    expect(
      checkVersionChange({ packageJsonPath: file, gitRoot: dir, gitPath: 'package.json' }),
    ).toEqual({
      status: 'first-commit',
      committed: null,
      current: '2.5.7',
    })
  })

  it('相对 HEAD 正确区分 unchanged / bumped / downgraded', () => {
    const file = createPackageJson('2.5.7')
    const dir = path.dirname(file)

    commitPackage(dir)

    const options = { packageJsonPath: file, gitRoot: dir, gitPath: 'package.json' }

    expect(checkVersionChange(options).status).toBe('unchanged')
    expect(getCommittedVersion(options)).toBe('2.5.7')

    updatePackageVersion('2.5.8', file)
    expect(checkVersionChange(options)).toEqual({
      status: 'bumped',
      committed: '2.5.7',
      current: '2.5.8',
    })

    updatePackageVersion('2.5.6', file)
    expect(checkVersionChange(options)).toEqual({
      status: 'downgraded',
      committed: '2.5.7',
      current: '2.5.6',
    })
  })
})
