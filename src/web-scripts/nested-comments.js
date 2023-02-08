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
      const likes = Number(td.find('span.small').text())
      const floor = td.find('span.no').text()

      return { id, name, content, likes, floor, index: idx }
    })
    .get()

  const popularCommentData = commentData
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  const commentBox = $('#Main > .box:has(.cell[id^="r_"])')

  const commentContainer = $(
    '<div id="b" style="position:fixed;inset:50px 100px;z-index:999;background-color:#fff;overflow-y:auto;visibility:hidden"><div><button id="close">关闭</button></div></div>'
  )

  commentContainer.find('#close').click(() => {
    $('#b').css({ visibility: 'hidden' })
  })

  commentBox.find('.cell:first-of-type').append('<button id="popular">本页热门评论</button>')

  $('#popular').click(() => {
    $('#b').css({ visibility: 'visible' })
  })

  popularCommentData.forEach(({ index }) => {
    commentContainer.append(commentCells.eq(index).clone())
  })

  commentBox.append(commentContainer)

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
