export const $body = $(document.body)
export const $wrapper = $('#Wrapper')
export const $wrapperContent = $wrapper.find('> .content')

export const $main = $('#Main')

export const $topicList = $(
  '#Main #Tabs ~ .cell.item, #Main #TopicsNode > .cell, #Main .cell.item:has(.item_title > .topic-link)'
)

/** 个人信息卡片。 */
export const $infoCard = $('#Rightbar > .box:has("#member-activity")')

/** 主题内容区。 */
export const $topicContentBox = $('#Main .box:has(.topic_buttons)')

/** 主题内容区的头部 */
export const $topicHeader = $topicContentBox.find('.header')

/** 主题下的评论区。 */
export const $commentBox = $('#Main .box:has(.cell[id^="r_"])')

/** 评论区的回复。 */
export let $commentCells = $commentBox.find('.cell[id^="r_"]')

export let $commentTableRows = $commentCells.find('> table > tbody > tr')

/** 当文档结构发生改变时，执行此方法以重新选择到最新的元素。 */
export function updateCommentCells() {
  $commentCells = $commentBox.find('.cell[id^="r_"]')
  $commentTableRows = $commentCells.find('> table > tbody > tr')
}

/** 回复输入控件。 */
export const $replyBox = $('#reply-box')
export const $replyForm = $replyBox.find('form[action^="/t"]')

/** 主题回复输入框。 */
export const $replyTextArea = $('#reply_content')
export const replyTextArea = document.querySelector('#reply_content')

/** 登录人的昵称 */
export const loginName = $('#Top .tools > a[href^="/member"]').text()

/** 题主的昵称。 */
export const topicOwnerName = $topicHeader.find('> small > a[href^="/member"]').text()

export const topicId = window.location.pathname.match(/\/t\/(\d+)/)?.at(1)
