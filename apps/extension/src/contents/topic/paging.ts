import { $commentBox } from '../globals'

/**
 * 处理主题分页。
 */
export function handlePaging() {
  const $notCommentCells = $commentBox.find('> .cell:not([id^="r_"])')

  if ($notCommentCells.length <= 1) {
    return
  }

  // $notCommentCells 的第一个为 “xxx 条回复”
  const pagingCells = $notCommentCells.slice(1).addClass('v2p-paging')

  const pageBtns = pagingCells.find('.super.button')
  pageBtns.eq(0).addClass('v2p-prev-btn')
  pageBtns.eq(1).addClass('v2p-next-btn')
}
