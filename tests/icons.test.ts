/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it } from 'vitest'

import { loadIcons } from '../apps/extension/src/contents/helpers/icons'

describe('Lucide 图标加载', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('只处理指定容器内的扩展专属图标占位符', () => {
    const root = document.createElement('div')
    const otherRoot = document.createElement('div')
    root.innerHTML = '<i data-v2p-icon="heart"></i><i data-lucide="sun"></i>'
    otherRoot.innerHTML = '<i data-v2p-icon="moon"></i>'
    document.body.append(root, otherRoot)
    const hostIcon = root.querySelector('i[data-lucide]')
    const otherIcon = otherRoot.firstElementChild

    loadIcons(root)

    expect(root.querySelector('svg')?.classList.contains('lucide-heart')).toBe(true)
    expect(root.querySelector('i[data-lucide]')).toBe(hostIcon)
    expect(otherRoot.firstElementChild).toBe(otherIcon)
  })

  it('再次加载时保留已有 SVG，只替换新增占位符', () => {
    const root = document.createElement('div')
    root.innerHTML = '<i data-v2p-icon="heart"></i>'
    document.body.append(root)
    loadIcons(root)
    const existingIcon = root.querySelector('svg')
    root.insertAdjacentHTML('beforeend', '<i data-v2p-icon="moon"></i>')

    loadIcons(root)

    expect(root.querySelector('.lucide-heart')).toBe(existingIcon)
    expect(root.querySelectorAll('svg')).toHaveLength(2)
    expect(root.querySelector('[data-v2p-icon]')).toBeNull()
  })
})
