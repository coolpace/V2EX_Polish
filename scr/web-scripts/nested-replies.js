void (function NestedReplies() {
  'use strict'

  const commentCells = $('.cell[id^="r_"]')
  const cellTableRows = commentCells.find('table > tbody > tr')

  const commentData = cellTableRows
    .map((idx, tr) => {
      const id = commentCells[idx].id
      const td = $(tr).find('> td:nth-child(3)')
      const name = td.find('> strong > a').text()
      const content = td.find('> .reply_content').text()

      return { id, name, content }
    })
    .get()

  /** 发帖人的昵称 */
  const ownerName = $('#Main > .box:nth-child(1) > .header > small > a').text()

  /** 登录人的昵称 */
  const loginName = $('#Top .tools > a[href^="/member"]').text()

  let i = 1

  // 遍历所有楼层
  while (i < commentCells.length) {
    const cellDom = commentCells[i]
    const { name, content } = commentData[i]

    if (name === ownerName) {
      cellDom.classList.add('owner')
    }

    if (name === loginName) {
      cellDom.classList.add('self')
    }

    // 向上遍历
    for (let j = i - 1; j >= 0; j--) {
      // 回复内容包含别人的 ID
      if (content.match(`@${commentData[j].name}`)) {
        cellDom.classList.add('responder')
        commentCells[j].append(commentCells[i])
        break
      }
    }

    i++
  }
})()
