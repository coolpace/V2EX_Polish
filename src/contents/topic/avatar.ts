import { createButton } from '../../components/button'
import { hoverDelay, type PopupControl } from '../../components/popup'
import { fetchUserInfo } from '../../services'
import type { CommentData, Member } from '../../types'
import { formatTimestamp } from '../../utils'
import { openTagsSetter } from './content'

export const memberDataCache = new Map<Member['username'], Member>()

interface ProcessAvatar {
  /** 触发弹出框的元素。 */
  $trigger: JQuery
  popupControl: PopupControl
  commentData: Pick<CommentData, 'memberName' | 'memberAvatar' | 'memberLink'>
  /** 是否要包裹一层可点击链接。 */
  shouldWrap?: boolean
  /** 点击「添加用户标签」按钮的回调。 */
  onSetTagsClick?: () => void
}

/**
 * 处理用户头像元素：
 *  - 鼠标悬浮头像会展示该用户的信息。
 */
export function processAvatar(params: ProcessAvatar) {
  const { $trigger, popupControl, commentData, shouldWrap = true, onSetTagsClick } = params

  const { memberName, memberAvatar, memberLink } = commentData

  let abortController: AbortController | null = null

  const handleOver = () => {
    popupControl.close()
    popupControl.open($trigger)

    const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <a class="v2p-avatar-box" href="${memberLink}">
              <img class="v2p-avatar" src="${memberAvatar}">
            </a>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username">
              <a href="${memberLink}">${memberName}</a>
            </div>
            <div class="v2p-no v2p-loading"></div>
            <div class="v2p-created-date v2p-loading"></div>
          </div>

          </div>

          <div class="v2p-bio" style="disply:none;"></div>

          <div class="v2p-member-card-actions"></div>
      </div>
    `)

    popupControl.$content.empty().append($content)

    createButton({ children: '添加用户标签' })
      .on('click', () => {
        popupControl.close()
        openTagsSetter(memberName)
        onSetTagsClick?.()
      })
      .appendTo($('.v2p-member-card-actions'))

    void (async () => {
      // 缓存用户卡片的信息，只有在无缓存时才请求远程数据。
      if (!memberDataCache.has(memberName)) {
        abortController = new AbortController()

        popupControl.onClose = () => {
          abortController?.abort()
        }

        try {
          const memberData = await fetchUserInfo(memberName, {
            signal: abortController.signal,
          })

          memberDataCache.set(memberName, memberData)
        } catch (err) {
          if (err && typeof err === 'object' && 'name' in err && err.name !== 'AbortError') {
            $content.html(`<span>获取用户信息失败</span>`)
          }
          return null
        }
      }

      const data = memberDataCache.get(memberName)

      if (data) {
        $content.find('.v2p-no').removeClass('v2p-loading').text(`V2EX 第 ${data.id} 号会员`)

        $content
          .find('.v2p-created-date')
          .removeClass('v2p-loading')
          .text(`加入于 ${formatTimestamp(data.created)}`)

        if (data.bio && data.bio.trim().length > 0) {
          $content.find('.v2p-bio').css('disply', 'block').text(data.bio)
        }
      }
    })()
  }

  let isOver = false

  $trigger
    .on('mouseover', () => {
      isOver = true
      setTimeout(() => {
        if (isOver) {
          handleOver()
        }
      }, hoverDelay)
    })
    .on('mouseleave', () => {
      isOver = false
      setTimeout(() => {
        if (!popupControl.isOver && !isOver) {
          popupControl.close()
        }
      }, hoverDelay)
    })

  if (shouldWrap) {
    $trigger.wrap(
      `<a href="/member/${commentData.memberName}" target="_blank" style="cursor: pointer;">`
    )
  }
}
