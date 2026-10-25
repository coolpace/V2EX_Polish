import { createButton } from '../../components/button'
import { hoverDelay, type PopupControl } from '../../components/floating-popup'
import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { blockUser, crawlUserPage, fetchUserInfo, parseUserTopics } from '../../services'
import type { CommentData, Member, UserTopicItem } from '../../types'
import { escapeHTML, formatTimestamp, getStorageSync, isBrowserExtension } from '../../utils'
import { getRegisterDays } from '../helpers'
import { foldBlockedMemberReplies } from './blocked'
import { openTagsSetter } from './content'
import { createTopicPreview } from './preview'

const banned = Symbol()

/** 缓存的用户数据类型 */
interface CachedMemberData extends Member {
  registerDays: number
  /** 用户发帖记录（仅在成功获取时存在） */
  topics?: UserTopicItem[]
}

/** 缓存用户卡片的信息，减少重复的请求。 */
export const memberDataCache = new Map<
  Member['username'],
  CachedMemberData | typeof banned
>()

interface ProcessAvatar {
  /** 触发弹出框的元素。 */
  $trigger: JQuery
  popupControl: PopupControl
  commentData: Pick<CommentData, 'memberName' | 'memberAvatar' | 'memberLink'>
  /** 是否要包裹一层可点击链接。 */
  shouldWrap?: boolean
  /** 是否在新标签页中打开用户主页。 */
  openInNewTab?: boolean
  /** 点击「添加用户标签」按钮的回调。 */
  onSetTagsClick?: () => void
}

/**
 * 处理用户头像元素：
 *  - 鼠标悬浮头像会展示该用户的信息。
 */
export function processAvatar(params: ProcessAvatar) {
  const {
    $trigger,
    popupControl,
    commentData,
    shouldWrap = true,
    openInNewTab = false,
    onSetTagsClick,
  } = params

  const { memberName, memberAvatar, memberLink } = commentData

  const safeMemberName = escapeHTML(memberName)
  const safeMemberLink = escapeHTML(memberLink)
  const safeMemberAvatar = escapeHTML(memberAvatar)

  // 只在浏览器扩展环境中启用主题预览功能，避免在非扩展环境中创建无效的模态框。
  const topicPreview = isBrowserExtension() ? createTopicPreview() : null

  let abortController: AbortController | null = null

  const handleOver = () => {
    popupControl.close()
    popupControl.open($trigger)

    const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <a class="v2p-avatar-box" href="${safeMemberLink}" target="${openInNewTab ? '_blank' : '_self'}">
              <img class="v2p-avatar" src="${safeMemberAvatar}">
            </a>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username">
              <a href="${safeMemberLink}" target="${openInNewTab ? '_blank' : '_self'}">${safeMemberName}</a>
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

    createButton({ children: '添加用户标签', size: 'small' })
      .on('click', () => {
        popupControl.close()
        openTagsSetter({ memberName, memberAvatar })
        onSetTagsClick?.()
      })
      .appendTo($('.v2p-member-card-actions'))

    createButton({ children: '屏蔽该用户', size: 'small' })
      .on('click', (event) => {
        const $btn = $(event.currentTarget)

        // 防止重复点击
        if ($btn.hasClass('v2p-btn-loading')) {
          return
        }

        // 确认操作
        if (!confirm(`确定要屏蔽用户 ${memberName} 吗？`)) {
          return
        }

        $btn.addClass('v2p-btn-loading').text('屏蔽中...')

        void blockUser(memberName).then((result) => {
          if (result.success) {
            let foldedCount = 0

            try {
              foldedCount = foldBlockedMemberReplies(memberName)
            }
            catch (error) {
              console.error('折叠已屏蔽用户的回复失败:', error)
            }

            createToast({
              message: foldedCount > 0
                ? `✅ 已屏蔽该用户，当前页 ${foldedCount} 条回复已折叠`
                : result.message,
            })

            popupControl.close()
          }
          else {
            createToast({ message: result.message })
            $btn.removeClass('v2p-btn-loading').text('屏蔽该用户')
          }
        })
      })
      .appendTo($('.v2p-member-card-actions'))

    const options = getStorageSync()[StorageKey.Options]
    const openMode = options.topic?.openMode ?? 'default'

    /**
     * 渲染用户发帖记录列表。
     * 只有在成功获取到数据且有发帖记录时才插入 DOM。
     */
    const renderTopics = (topics: UserTopicItem[]) => {
      if (topics.length > 0) {
        const topicItemsHtml = topics
          .map((topic) => {
            const match = topic.url.match(/\/t\/(\d+)/)
            const topicId = match?.at(1) ?? ''

            // 根据 openMode 决定链接的 target 属性
            let linkTarget = '_self'

            if (openMode === 'newTab') {
              linkTarget = '_blank'
            }

            const safeTitle = escapeHTML(topic.title)
            const safeUrl = escapeHTML(topic.url)

            const previewBtnHtml = topicPreview
              ? `<button class="v2p-topic-preview-btn" data-topic-id="${topicId}" data-url="${safeUrl}" data-title="${safeTitle}">预览</button>`
              : ''

            return `
              <div class="v2p-member-topic-item-row" data-topic-id="${topicId}" data-url="${safeUrl}" data-title="${safeTitle}">
                <a class="v2p-member-topic-item" href="${safeUrl}" target="${linkTarget}" title="${safeTitle}">${safeTitle}</a>
                ${previewBtnHtml}
              </div>
            `
          })
          .join('')

        const $topicsSection = $(`
          <div class="v2p-member-topics">
            <div class="v2p-member-topics-header">最近发帖</div>
            <div class="v2p-member-topics-list">${topicItemsHtml}</div>
          </div>
        `)

        if (openMode === 'preview' && topicPreview) {
          $topicsSection.on('click', '.v2p-member-topic-item', function (this: HTMLElement, ev) {
            ev.preventDefault()
            const $row = $(this).closest('.v2p-member-topic-item-row')
            topicPreview.handlePreview({
              topicId: $row.data('topic-id') as string,
              topicTitle: $row.data('title') as string,
              linkHref: $row.data('url') as string,
            })
          })
        }

        if (topicPreview) {
          $topicsSection.on('click', '.v2p-topic-preview-btn', function (this: HTMLElement) {
            const $btn = $(this)
            topicPreview.handlePreview({
              topicId: $btn.data('topic-id') as string,
              topicTitle: $btn.data('title') as string,
              linkHref: $btn.data('url') as string,
            })
          })
        }

        $content.find('.v2p-member-card-actions').before($topicsSection)
      }
    }

    void (async () => {
      // 只有在无缓存时才请求远程数据。
      if (!memberDataCache.has(memberName)) {
        abortController = new AbortController()

        popupControl.onClose = () => {
          abortController?.abort()
        }

        try {
          // 并行发起用户信息和发帖记录请求
          const [memberData, userPageHtml] = await Promise.all([
            fetchUserInfo(memberName, { signal: abortController.signal }),
            crawlUserPage(memberName).catch(() => ''),
          ])

          // 解析发帖记录（静默处理错误）
          let topics: UserTopicItem[] = []

          try {
            topics = parseUserTopics(userPageHtml, 5)
          }
          catch {
            // 静默处理解析错误
          }

          memberDataCache.set(memberName, {
            ...memberData,
            registerDays: getRegisterDays(memberData.created),
            topics,
          })
        }
        catch (err) {
          if (err instanceof Error) {
            $content.empty().append($('<span>').text(err.message))

            if (err.cause === 404) {
              memberDataCache.set(memberName, banned)
            }
          }

          return null
        }
      }

      const data = memberDataCache.get(memberName)

      if (typeof data === 'object') {
        $content.find('.v2p-no').removeClass('v2p-loading').text(`V2EX 第 ${data.id} 号会员`)

        $content
          .find('.v2p-created-date')
          .removeClass('v2p-loading')
          .text(`加入于 ${formatTimestamp(data.created)}`)

        if (data.registerDays <= 30) {
          $content
            .find('.v2p-info-right')
            .append(
              `<div class="v2p-register-days" style="margin: 5px 0;">${data.registerDays <= 15 ? '15' : '30'} 天内注册</div>`,
            )
        }

        if (data.bio && data.bio.trim().length > 0) {
          $content.find('.v2p-bio').css('disply', 'block').text(data.bio)
        }
        else {
          $content.find('.v2p-bio').remove()
        }

        // 渲染发帖记录（只在有数据时显示）
        if (data.topics && data.topics.length > 0) {
          renderTopics(data.topics)
        }
      }
      else if (typeof data === 'symbol' && data === banned) {
        $content.html('<span>查无此用户，疑似已被封禁</span>')
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
    // 点击头像跳转到该用户的主页。
    $trigger.wrap(
      `<a href="/member/${commentData.memberName}" target="_blank" style="cursor: pointer;">`,
    )
  }
}
