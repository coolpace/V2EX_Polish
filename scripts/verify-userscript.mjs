import fs from 'node:fs'
import path from 'node:path'

const artifactPath = path.resolve('apps/extension/dist/userscript/index.min.js')
const packagePath = path.resolve('apps/extension/package.json')
const domainsPath = path.resolve('apps/extension/shared/v2ex-domains.ts')
const artifact = fs.readFileSync(artifactPath, 'utf8')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const domainsSource = fs.readFileSync(domainsPath, 'utf8')
const domains = [...domainsSource.matchAll(/['"]([^'"]+\.v2ex\.(?:com|co))['"]/g)]
  .map((match) => match[1])

const assertions = [
  ['UserScript metadata header', artifact.startsWith('// ==UserScript==')],
  ['namespace', artifact.includes('// @namespace    https://v2p.leoku.dev')],
  ['version', artifact.includes(`// @version      ${packageJson.version}`)],
  ['document-start', artifact.includes('// @run-at       document-start')],
  ['GM storage', artifact.includes('// @grant        GM_setValue')],
  ['GM menu', artifact.includes('// @grant        GM_registerMenuCommand')],
  ['unsafeWindow', artifact.includes('// @grant        unsafeWindow')],
  ['bundled jQuery', artifact.includes('jQuery JavaScript Library v3.6.4')],
  ['settings center', artifact.includes('v2p-settings-layout')],
  ['control center', artifact.includes('v2p-panel-tabs')],
  ['pageshow mission', artifact.includes('签到页重试失败')],
  ['notifications enhancement', artifact.includes('notifications')],
]

for (const domain of domains) {
  assertions.push([
    `match ${domain}`,
    artifact.includes(`// @match        https://${domain}/*`),
  ])
}

const failed = assertions.filter(([, passed]) => !passed)

if (failed.length > 0) {
  for (const [name] of failed) {
    console.error(`Missing userscript artifact requirement: ${name}`)
  }

  process.exit(1)
}

console.log(`Verified userscript artifact (${Buffer.byteLength(artifact)} bytes)`)
