import { MessageKey, PendingOptionsMenuStorageKey } from '../constants'
import type { Runtime, RuntimeStorage, StorageArea } from './types'

function getArea(area: StorageArea): chrome.storage.StorageArea {
  return area === 'sync' ? chrome.storage.sync : chrome.storage.local
}

const storage: RuntimeStorage = {
  get(area) {
    return getArea(area).get()
  },

  async set(area, items) {
    await getArea(area).set(items)
  },

  async remove(area, keys) {
    await getArea(area).remove(keys as string[])
  },

  getBytesInUse(area, keys) {
    return getArea(area).getBytesInUse(keys as string[] | undefined)
  },

  subscribe(listener) {
    const handleChanges = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: chrome.storage.AreaName,
    ) => {
      if (area === 'sync' || area === 'local') {
        listener(area, changes)
      }
    }

    chrome.storage.onChanged.addListener(handleChanges)

    return () => {
      chrome.storage.onChanged.removeListener(handleChanges)
    }
  },
}

export const extensionRuntime: Runtime = {
  kind: 'extension',
  isBrowserExtension: true,
  storage,

  ui: {
    openOptions(section) {
      if (section) {
        void chrome.storage.local.set({
          [PendingOptionsMenuStorageKey]: section,
        })
      }

      void chrome.runtime.sendMessage({ [MessageKey.showOptions]: true })
    },

    openControlCenter() {
      // 扩展的工具栏弹窗由 action 直接打开，没有内容脚本等价入口。
    },

    openUrl(url, options = {}) {
      if (options.newTab === false) {
        window.location.assign(url)
      }
      else {
        window.open(url, '_blank', options.active === false ? 'noopener,noreferrer' : undefined)
      }
    },
  },

  executeInPage(expression) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const execute = new Function(`"use strict"; ${expression}`)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return execute()
  },

  registerMenuCommand() {
    // 浏览器扩展使用原生 contextMenus，不需要 UserScript 菜单。
  },
}
