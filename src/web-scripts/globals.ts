/** 登录人的昵称 */
export const loginName = $('#Top .tools > a[href^="/member"]').text()

/** 发帖人的昵称 */
export const ownerName = $('#Main > .box:nth-child(1) > .header > small > a').text()

/** 主题内容区 */
export const topicContentBox = $('#Main .box:has(.topic_content)')

/** 评论区 */
export const commentBox = $('#Main .box:has(.cell[id^="r_"])')

/** 评论区的回复 */
export const commentCells = commentBox.find('.cell[id^="r_"]')

export const cellTableRows = commentCells.find('table > tbody > tr')

/** 评论数据 */
export const commentData = cellTableRows
  .map((idx, tr) => {
    const id = commentCells[idx].id
    const td = $(tr).find('> td:nth-child(3)')
    const name = td.find('> strong > a').text() //回复者昵称
    const content = td.find('> .reply_content').text() //回复内容
    const likes = Number(td.find('span.small').text()) //感谢数
    const floor = td.find('span.no').text() //层数

    return { id, name, content, likes, floor, index: idx }
  })
  .get()
