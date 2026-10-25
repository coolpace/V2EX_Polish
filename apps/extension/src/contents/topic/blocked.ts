import { $commentBox } from '../globals'

/** 从回复 cell 中读取回复者昵称。 */
function getReplyMemberName(cellDom: Element): string {
  return $(cellDom)
    .find('> table > tbody > tr > td:nth-child(3) > strong > a')
    .first()
    .text()
    .trim()
}

/**
 * 更新回复列表顶部的已屏蔽提示。
 */
function renderNotice($box: JQuery): void {
  const $blockedCells = $box.find('.cell[id^="r_"].v2p-blocked-reply')
  let $notice = $box.find('> .v2p-blocked-notice')

  if ($blockedCells.length === 0) {
    $notice.remove()

    return
  }

  if ($notice.length === 0) {
    $notice = $(`
      <div class="v2p-blocked-notice">
        <span class="v2p-blocked-notice-text"></span>
        <a class="v2p-blocked-toggle" role="button" tabindex="0">显示</a>
      </div>
    `)

    $notice
      .find('.v2p-blocked-toggle')
      .on('click', (ev) => {
        const $toggle = $(ev.currentTarget)
        const reveal = $toggle.text() === '显示'

        $box.find('.v2p-blocked-reply').toggleClass('v2p-blocked-revealed', reveal)
        $toggle.text(reveal ? '隐藏' : '显示')
      })
      .on('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault()
          $(ev.currentTarget).trigger('click')
        }
      })
  }

  // 把提示放到第一条被折叠的回复附近，避免出现在用户当前视野之外。
  const firstBlockedCell = $blockedCells.get(0)
  let $noticeAnchor = firstBlockedCell ? $(firstBlockedCell) : $()
  const $outerCells = $noticeAnchor.parents('.cell[id^="r_"]')

  if ($outerCells.length > 0) {
    $noticeAnchor = $outerCells.last()
  }

  if ($noticeAnchor.length > 0) {
    $notice.detach().insertBefore($noticeAnchor)
  }
  else if ($notice.parent().length === 0) {
    $box.prepend($notice)
  }

  const names = Array.from(
    new Set(
      $blockedCells
        .toArray()
        .map((cell) => getReplyMemberName(cell))
        .filter(Boolean),
    ),
  )

  const nameText = names.length > 0 ? names.map((name) => `@${name}`).join('、') : '该用户'
  const isRevealed = $blockedCells.filter('.v2p-blocked-revealed').length > 0

  $notice
    .find('.v2p-blocked-notice-text')
    .text(`已屏蔽 ${nameText}，当前页 ${$blockedCells.length} 条回复已折叠`)

  $notice.find('.v2p-blocked-toggle').text(isRevealed ? '隐藏' : '显示')
}

/**
 * 在当前页折叠指定用户的回复。
 *
 * 屏蔽是账号级操作，刷新后由 V2EX 服务端接管；
 * 这里只负责让当前页立即给出反馈。
 */
export function foldBlockedMemberReplies(memberName: string): number {
  const $box = $commentBox.first()

  if (!memberName || $box.length === 0) {
    return 0
  }

  $box.find('.cell[id^="r_"]').each((_, cellDom) => {
    if (getReplyMemberName(cellDom) !== memberName) {
      return
    }

    const $cell = $(cellDom)

    $cell.addClass('v2p-blocked-reply')

    // 有楼中楼时只隐藏本条回复，避免连带隐藏其他人的嵌套回复。
    if ($cell.find('> .cell[id^="r_"]').length === 0) {
      $cell.addClass('v2p-blocked-reply-empty')
    }
  })

  // 新屏蔽用户后统一回到折叠状态，避免上一次“显示”状态影响判断。
  $box.find('.v2p-blocked-reply').removeClass('v2p-blocked-revealed')

  renderNotice($box)

  return $box.find('.v2p-blocked-reply').length
}
