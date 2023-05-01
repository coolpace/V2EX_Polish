import { createButton } from '../../components/button'
import { hoverDelay, type PopupControl } from '../../components/popup'
import { fetchUserInfo } from '../../services'
import type { CommentData, Member } from '../../types'
import { formatTimestamp } from '../../utils'

const memberDataCache = new Map<Member['username'], Member>()

interface ProcessAvatar {
  $cellDom: JQuery
  popupControl: PopupControl
  commentData: CommentData
  onSetTagsClick?: () => void
}

/**
 * 处理用户头像元素：
 *  - 点击头像会展示该用户的信息。
 */
export function processAvatar(params: ProcessAvatar) {
  const { $cellDom, popupControl, commentData, onSetTagsClick: onSetTags } = params

  let abortController: AbortController | null = null

  const $avatar = $cellDom.find('.avatar')

  const handleOver = () => {
    popupControl.close()
    popupControl.open($avatar)

    const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <a class="v2p-avatar-box"></a>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username v2p-loading"></div>
            <div class="v2p-no v2p-loading"></div>
            <div class="v2p-created-date v2p-loading"></div>
          </div>
        </div>
      </div>
    `)

    popupControl.$content.empty().append($content)

    void (async () => {
      const memberName = commentData.memberName

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
        const memberName = data.username

        $content
          .find('.v2p-avatar-box')
          .prop('href', data.url)
          .removeClass('v2p-loading')
          .append(`<img class="v2p-avatar" src="${data.avatar_large}">`)

        const $memberName = $(`<a href="${data.url}">${memberName}</a>`)

        $content.find('.v2p-username').removeClass('v2p-loading').append($memberName)

        $content.find('.v2p-no').removeClass('v2p-loading').text(`V2EX 第 ${data.id} 号会员`)

        $content
          .find('.v2p-created-date')
          .removeClass('v2p-loading')
          .text(`加入于 ${formatTimestamp(data.created)}`)

        if (data.bio && data.bio.trim().length > 0) {
          $content.append(`<div class="v2p-bio">${data.bio}</div>`)
        }

        const $actions = $('<div class="v2p-member-card-actions">')
        createButton({ children: '添加用户标签' })
          .on('click', () => {
            popupControl.close()
            onSetTags?.()
          })
          .appendTo($actions)
        $content.append($actions)
      }
    })()
  }

  let isOver = false

  $avatar
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
    .wrap(`<a href="/member/${commentData.memberName}" style="cursor: pointer;">`)
}
