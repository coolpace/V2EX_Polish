// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest'

import { getHorizontalLayoutGroups } from '../apps/extension/src/contents/topic/layout-split'

const newStructure = `
  <div id="Main">
    <div class="sep20"></div>
    <div class="box" id="topic-box">
      <div class="cell"><div class="topic_content"></div></div>
    </div>
    <div class="sep20"></div>
    <div id="topic-replies">
      <div class="box" id="replies-box">
        <div class="cell" id="r_1"></div>
        <div class="cell" id="r_2"></div>
      </div>
      <div class="sep20"></div>
    </div>
    <div id="reply-box"></div>
  </div>
`

const legacyStructure = `
  <div id="Main">
    <div class="sep20"></div>
    <div class="box" id="topic-box">
      <div class="cell"><div class="topic_content"></div></div>
    </div>
    <div class="sep20"></div>
    <div class="box" id="replies-box">
      <div class="cell" id="r_1"></div>
    </div>
    <div class="sep20"></div>
    <div id="reply-box"></div>
  </div>
`

function render(html: string): { main: HTMLElement, target: HTMLElement } {
  document.body.innerHTML = html

  return {
    main: document.querySelector<HTMLElement>('#Main')!,
    target: document.querySelector<HTMLElement>('#replies-box')!,
  }
}

describe('主题页水平布局分组', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('新版 #topic-replies 包裹层下，以 #Main 直接子元素为界分出左右栏', () => {
    const { main, target } = render(newStructure)
    const groups = getHorizontalLayoutGroups(main, target)!

    expect(groups.left.map((el) => el.id || el.className)).toEqual(['sep20', 'topic-box'])
    expect(groups.right.map((el) => el.id || el.className)).toEqual(['sep20', 'topic-replies', 'reply-box'])
    expect(groups.left.some((el) => el.querySelector('.topic_content'))).toBe(true)
    expect(groups.right.some((el) => el.contains(target))).toBe(true)
    expect(groups.right.some((el) => el.querySelector('#r_1'))).toBe(true)
  })

  it('旧版扁平结构下保持原有的分界位置', () => {
    const { main, target } = render(legacyStructure)
    const groups = getHorizontalLayoutGroups(main, target)!

    expect(groups.left).toHaveLength(2)
    expect(groups.right).toHaveLength(4)
    expect(groups.right[0].classList.contains('sep20')).toBe(true)
    expect(groups.right).toContain(target)
  })

  it('没有前置 sep20 时仍以 #Main 直接子元素分栏', () => {
    const { main, target } = render(`
      <div id="Main">
        <div class="box" id="topic-box"></div>
        <div id="topic-replies"><div class="box" id="replies-box"></div></div>
      </div>
    `)
    const groups = getHorizontalLayoutGroups(main, target)!

    expect(groups.left.map((el) => el.id)).toEqual(['topic-box'])
    expect(groups.right.map((el) => el.id)).toEqual(['topic-replies'])
  })

  it('目标缺失或不在 #Main 内时不分栏', () => {
    const { main } = render(newStructure)

    expect(getHorizontalLayoutGroups(main, undefined)).toBeNull()
    expect(getHorizontalLayoutGroups(null, document.querySelector('#reply-box'))).toBeNull()
    expect(getHorizontalLayoutGroups(main, document.createElement('div'))).toBeNull()
  })

  it('已分栏或目标位于首位时不重复包裹', () => {
    const { main, target } = render(newStructure)
    const side = document.createElement('div')
    side.className = 'v2p-left-side'
    main.prepend(side)

    expect(getHorizontalLayoutGroups(main, target)).toBeNull()

    document.body.innerHTML = '<div id="Main"><div class="box" id="replies-box"></div></div>'

    expect(getHorizontalLayoutGroups(
      document.querySelector('#Main'),
      document.querySelector('#replies-box'),
    )).toBeNull()
  })
})
