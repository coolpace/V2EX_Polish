import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

import { Window } from 'happy-dom'

const artifactPath = path.resolve('apps/extension/dist/userscript/index.min.js')
const source = fs.readFileSync(artifactPath, 'utf8')
const window = new Window({ url: 'https://www.v2ex.com/' })
const { document } = window

document.body.innerHTML = `
  <div id="Wrapper"><div class="content">
    <div id="Top"><div class="site-nav"><div class="tools"><a href="/member/test">test</a></div></div></div>
    <div id="Main"></div>
    <div id="Rightbar"><div class="box" id="member-activity"></div></div>
    <div id="Bottom"><div class="content"></div></div>
  </div></div>
`

const values = new Map([['v2p:v1:sync:options', JSON.stringify({ autoCheckIn: { enabled: false } })]])
const errors = []
const menuCommands = []

const context = vm.createContext({
  window,
  document,
  navigator: window.navigator,
  localStorage: window.localStorage,
  location: window.location,
  URL,
  URLSearchParams,
  Blob: window.Blob,
  File: window.File,
  FileReader: window.FileReader,
  DOMParser: window.DOMParser,
  CustomEvent: window.CustomEvent,
  KeyboardEvent: window.KeyboardEvent,
  HTMLElement: window.HTMLElement,
  HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement,
  Element: window.Element,
  Node: window.Node,
  MutationObserver: window.MutationObserver,
  chrome: {
    extension: {},
    runtime: { id: 'script-manager-extension-id' },
  },
  TextEncoder,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  console: {
    ...console,
    error: (...args) => {
      errors.push(args)
    },
  },
  GM_getValue: (key) => values.get(key),
  GM_setValue: (key, value) => values.set(key, value),
  GM_deleteValue: (key) => values.delete(key),
  GM_addValueChangeListener: () => 1,
  GM_removeValueChangeListener: () => {},
  GM_registerMenuCommand: (label) => {
    menuCommands.push(label)
  },
  GM_addStyle: () => {},
  unsafeWindow: window,
})

context.globalThis = context
vm.runInContext(source, context, { filename: 'index.min.js' })
window.document.dispatchEvent(new window.Event('DOMContentLoaded'))

await new Promise((resolve) => setTimeout(resolve, 400))
window.dispatchEvent(new window.CustomEvent('v2p:open-options', { detail: {} }))
await new Promise((resolve) => setTimeout(resolve, 400))

const host = document.querySelector('#v2p-userscript-host')
const settingsText = host?.shadowRoot?.textContent ?? ''
const settingsOpened = settingsText.includes('控制选项')
  && settingsText.includes('配置备份与恢复')
const themeSelect = host?.shadowRoot?.querySelector('[name="theme.type"]')

if (themeSelect instanceof window.HTMLSelectElement) {
  themeSelect.value = 'dark-default'
  host?.shadowRoot?.querySelector('[data-action="save-settings"]')?.dispatchEvent(
    new window.MouseEvent('click', { bubbles: true }),
  )
  await new Promise((resolve) => setTimeout(resolve, 250))
}

const settingsPersisted = (() => {
  try {
    const stored = JSON.parse(values.get('v2p:v1:sync:options') ?? '{}')

    return stored.theme?.type === 'dark-default'
  }
  catch {
    return false
  }
})()

window.dispatchEvent(new window.CustomEvent('v2p:open-control-center', { detail: {} }))
await new Promise((resolve) => setTimeout(resolve, 250))
const controlCenterText = host?.shadowRoot?.textContent ?? ''
const controlCenterOpened = controlCenterText.includes('稍后阅读')
  && controlCenterText.includes('签到')

const chromeReferenceError = errors.some((entry) =>
  String(entry[1] ?? entry[0]).includes('chrome'),
)
const passed = Boolean(host)
  && settingsOpened
  && settingsPersisted
  && controlCenterOpened
  && menuCommands.includes('V2EX Polish 设置')
  && !chromeReferenceError
  && errors.length === 0

console.log(JSON.stringify({
  launcher: Boolean(host?.shadowRoot?.querySelector('.v2p-launcher')),
  settingsOpened,
  settingsPersisted,
  controlCenterOpened,
  menuCommands,
  chromeReferenceError,
  errorCount: errors.length,
}))

process.exit(passed ? 0 : 1)
