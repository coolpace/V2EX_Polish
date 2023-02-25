import { $commentBox } from '../globals'

export function paging() {
  const notCommentCells = $commentBox.find('> .cell:not([id^="r_"])')

  if (notCommentCells.length <= 1) {
    return
  }

  const pagingCells = notCommentCells.slice(1).addClass('v2p-paging')
  const pageBtns = pagingCells.find('.super.button')
  pageBtns.eq(0).addClass('v2p-prev-btn')
  pageBtns.eq(1).addClass('v2p-next-btn')
}
