void (function () {
  'use strict'

  const commentCells = $('.cell[id^="r_"]')
  const cellTableRow = commentCells.find('table > tbody > tr')

  const commentData = cellTableRow
    .map((idx, el) => {
      const id = commentCells[idx].id
      const td = $(el).find('> td:nth-child(3)')
      const name = td.find('> strong > a').text()
      const content = td.find('> .reply_content').text()

      return { id, name, content }
    })
    .get()

  let i = 1

  // 遍历所有楼层
  while (i < commentCells.length) {
    const { content } = commentData[i]

    // 向上遍历
    for (let j = i - 1; j >= 0; j--) {
      // 回复内容包含别人的 ID
      if (content.match(commentData[j].name)) {
        commentCells[i].classList.add('responder')
        commentCells[j].append(commentCells[i])
        break
      }
    }

    i++
  }
})()
