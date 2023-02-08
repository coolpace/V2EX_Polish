void (function NestedComments() {
  'use strict'

  const commentCells = $('.cell[id^="r_"]')
  const cellTableRows = commentCells.find('table > tbody > tr')

  const commentData = cellTableRows
    .map((idx, tr) => {
      const id = commentCells[idx].id
      const td = $(tr).find('> td:nth-child(3)')
      const name = td.find('> strong > a').text()
      const content = td.find('> .reply_content').text()
      const likes = td.find('span.small').text() || 0
      const floor = td.find('span.no').text()

      return { id, name, content, likes, floor, index: idx }
    })
    .get()

  const popularCommentData = commentData.filter(({ likes }) => likes > 0).map(({ id }) => id)
  commentCells.each((_, cell) => {
    if (popularCommentData.includes(cell.id)) {
      console.log('bingo')
    }
  })

  /** 发帖人的昵称 */
  const ownerName = $('#Main > .box:nth-child(1) > .header > small > a').text()

  /** 登录人的昵称 */
  const loginName = $('#Top .tools > a[href^="/member"]').text()

  let i = 1
  while (i < commentCells.length) {
    const cellDom = commentCells[i]
    const { name, content } = commentData[i]

    if (name === ownerName) {
      cellDom.classList.add('owner')
    }

    if (name === loginName) {
      cellDom.classList.add('self')
    }

    if (content.includes('@')) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].name}`)) {
          cellDom.classList.add('responder')
          commentCells[j].append(commentCells[i])
          break
        }
      }
    }

    i++
  }
})()
