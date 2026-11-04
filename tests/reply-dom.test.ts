// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest'

import {
  getReplyActionsFromCell,
  getReplyAuthorLinkFromCell,
  getReplyAuthorLinkFromRow,
  getReplyLinkFromActions,
  removeReplyActionsFromCell,
} from '../apps/extension/src/contents/reply-dom'

const flexCellHtml = `
  <div class="cell" id="r_1">
    <table>
      <tbody>
        <tr>
          <td><img class="avatar" alt="alice"></td>
          <td></td>
          <td>
            <div class="flex-one-row">
              <div class="flex-one-row gap10">
                <strong><a href="/member/alice">alice</a></strong>
              </div>
              <div class="flex-one-row gap10">
                <div class="thank_area">
                  <a class="thank" onclick="ignoreReply(1)">隐藏</a>
                </div>
                <a onclick="replyOne('alice')"><img alt="Reply"></a>
                <span class="no">3</span>
              </div>
            </div>
            <div class="reply_content">
              <strong><a href="https://example.com">正文加粗链接</a></strong>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`

const legacyCellHtml = `
  <div class="cell" id="r_2">
    <table>
      <tbody>
        <tr>
          <td><img class="avatar" alt="bob"></td>
          <td></td>
          <td>
            <strong><a href="/member/bob">bob</a></strong>
            <div class="fr">
              <div class="thank_area">
                <a class="thank" onclick="ignoreReply(2)">隐藏</a>
              </div>
              <a onclick="replyOne('bob')"><img alt="Reply"></a>
              <span class="no">4</span>
            </div>
            <div class="reply_content">旧版回复</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`

function render(html: string): HTMLElement {
  document.body.innerHTML = html

  return document.querySelector<HTMLElement>('.cell')!
}

describe('reply DOM compatibility', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('从新版 Flexbox 回复中提取作者，忽略正文里的加粗链接', () => {
    const cell = render(flexCellHtml)
    const row = cell.querySelector('tr')!
    const author = getReplyAuthorLinkFromRow(row)

    expect(author?.textContent).toBe('alice')
    expect(author?.getAttribute('href')).toBe('/member/alice')
    expect(getReplyAuthorLinkFromCell(cell)).toBe(author)
  })

  it('兼容旧版直接位于回复单元格中的作者链接', () => {
    const cell = render(legacyCellHtml)
    const row = cell.querySelector('tr')!
    const author = getReplyAuthorLinkFromRow(row)

    expect(author?.textContent).toBe('bob')
    expect(author?.getAttribute('href')).toBe('/member/bob')
    expect(getReplyAuthorLinkFromCell(cell)).toBe(author)
  })

  it('识别新版 Flexbox 操作栏和真正的回复链接', () => {
    const cell = render(flexCellHtml)
    const actions = getReplyActionsFromCell(cell)
    const replyLink = actions && getReplyLinkFromActions(actions)

    expect(actions?.classList.contains('flex-one-row')).toBe(true)
    expect(actions?.querySelector('.no')?.textContent).toBe('3')
    expect(replyLink?.getAttribute('onclick')).toBe('replyOne(\'alice\')')
  })

  it('兼容旧版 .fr 操作栏', () => {
    const cell = render(legacyCellHtml)
    const actions = getReplyActionsFromCell(cell)
    const replyLink = actions && getReplyLinkFromActions(actions)

    expect(actions?.classList.contains('fr')).toBe(true)
    expect(replyLink?.getAttribute('onclick')).toBe('replyOne(\'bob\')')
  })

  it.each([
    ['新版', flexCellHtml],
    ['旧版', legacyCellHtml],
  ])('预览页清理%s回复操作时保留楼层号和作者信息', (_, html) => {
    const cell = render(html)

    removeReplyActionsFromCell(cell)

    const actions = getReplyActionsFromCell(cell)

    expect(actions?.querySelector('.no')).not.toBeNull()
    expect(actions?.querySelector('.thank_area')).toBeNull()
    expect(actions && getReplyLinkFromActions(actions)).toBeNull()
    expect(getReplyAuthorLinkFromCell(cell)).not.toBeNull()
  })
})
