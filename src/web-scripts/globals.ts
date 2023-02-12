/** 登录人的昵称 */
export const loginName = $('#Top .tools > a[href^="/member"]').text()

/** 发帖人的昵称 */
export const ownerName = $('#Main > .box:nth-child(1) > .header > small > a').text()

/** 评论区 */
export const commentBox = $('#Main .box:has(.cell[id^="r_"])')

/** 评论区的回复 */
export const commentCells = $('#Main .cell[id^="r_"]')

export const cellTableRows = commentCells.find('table > tbody > tr')

/** 评论数据 */
export const commentData = cellTableRows
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
