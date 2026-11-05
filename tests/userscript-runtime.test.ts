import { afterEach, describe, expect, it, vi } from 'vitest'

import { StorageKey } from '../apps/extension/src/constants'
import { userscriptRuntime } from '../apps/extension/src/runtime/userscript'

describe('UserScript GM storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('使用命名空间 JSON 持久化并订阅当前页面的写入', async () => {
    const values = new Map<string, string>()
    const listener = vi.fn()

    vi.stubGlobal('window', { __V2P_StorageCache: undefined })
    vi.stubGlobal('GM_getValue', (key: string) => values.get(key))
    vi.stubGlobal('GM_setValue', (key: string, value: string) => {
      values.set(key, value)
    })
    vi.stubGlobal('GM_deleteValue', (key: string) => {
      values.delete(key)
    })
    vi.stubGlobal('GM_addValueChangeListener', () => 1)
    vi.stubGlobal('GM_removeValueChangeListener', () => undefined)

    const unsubscribe = userscriptRuntime.storage.subscribe(listener)
    const options = {
      topic: { openMode: 'preview' as const },
    }

    await userscriptRuntime.storage.set('sync', {
      [StorageKey.Options]: options,
    })

    const stored = await userscriptRuntime.storage.get('sync')

    expect(stored[StorageKey.Options]).toEqual(options)
    expect(values.get(`v2p:v1:sync:${StorageKey.Options}`)).toBe(JSON.stringify(options))
    expect(listener).toHaveBeenCalledWith(
      'sync',
      expect.objectContaining({
        [StorageKey.Options]: { newValue: options },
      }),
    )

    unsubscribe()
  })

  it('读取损坏的 JSON 时回退为未设置，不覆盖原始值', async () => {
    const key = `v2p:v1:sync:${StorageKey.Options}`
    const values = new Map([[key, '{broken']])

    vi.stubGlobal('window', { __V2P_StorageCache: undefined })
    vi.stubGlobal('GM_getValue', (requestedKey: string) => values.get(requestedKey))
    vi.stubGlobal('GM_setValue', () => undefined)

    const stored = await userscriptRuntime.storage.get('sync')

    expect(stored[StorageKey.Options]).toBeUndefined()
    expect(values.get(key)).toBe('{broken')
  })
})
