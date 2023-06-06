import { createButton } from '../../components/button'
import { createToast } from '../../components/toast'
import { MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT, StorageKey } from '../../constants'
import { iconIgnore, iconLove, iconStar, iconTwitter } from '../../icons'
import type { Member, Options, Tag } from '../../types'
import { getStorage, getStorageSync } from '../../utils'
import { $commentCells, $topicContentBox } from '../globals'
import { setMemberTags } from '../helpers'

/**
 * 处理主题的正文内容。
 */
export function handlingContent() {
  const storage = getStorageSync()
  const options = storage[StorageKey.Options]

  if (options.openInNewTab) {
    $topicContentBox
      .find('.topic_content a[href]')
      .prop('target', '_blank')
      .prop('rel', 'noopener noreferrer')
  }

  {
    const $topicContents = $topicContentBox.find('.subtle > .topic_content')

    const textLength = $topicContents.text().length

    if (textLength >= 200) {
      $topicContents.each((_, topicContent) => {
        if (textLength >= 400) {
          topicContent.style.fontSize = '14px'
        }
        topicContent.style.fontSize = '14.5px'
      })
    }
  }

  {
    const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb v2p-hover-btn')
    const $favoriteBtn = topicBtn.eq(0)
    $favoriteBtn.append(`<span class="v2p-tb-icon">${iconStar}</span>`)
    topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`)
    topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`)
    topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`)

    const url = $favoriteBtn.attr('href')

    // 在不刷新页面下执行主题的收藏操作。
    if (typeof url === 'string') {
      let hasFavorited = !url.startsWith('/favorite')

      $favoriteBtn.attr('href', 'javascript:').on('click', () => {
        void (async () => {
          createToast({ message: hasFavorited ? '正在取消收藏...' : '正在加入收藏...' })
          $favoriteBtn.css('pointer-events', 'none')
          try {
            const res = await fetch(hasFavorited ? url.replace('/favorite', '/unfavorite') : url)
            if (res.redirected) {
              const htmlText = await res.text()
              if (!hasFavorited && htmlText.includes('取消收藏')) {
                $favoriteBtn.html($favoriteBtn.html().replace('加入收藏', '取消收藏'))
                hasFavorited = true
              } else if (hasFavorited && htmlText.includes('加入收藏')) {
                $favoriteBtn.html($favoriteBtn.html().replace('取消收藏', '加入收藏'))
                hasFavorited = false
              }
            }
          } catch {
            createToast({ message: '❌ 加入收藏失败' })
          } finally {
            $favoriteBtn.css('pointer-events', 'auto')
          }
        })()
      })
    }
  }
}

/**
 * 处理回复内容：
 *  - 过长内容会被折叠。
 */
export function processReplyContent(
  $cellDom: JQuery,
  replyContentOptions: Options['replyContent']
) {
  if (!replyContentOptions.autoFold || $cellDom.find('.v2p-reply-content').length > 0) {
    return
  }

  const $replyContent = $cellDom.find('.reply_content')

  const contentHeight = $replyContent.height() ?? 0

  const shouldCollapsed = contentHeight + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT

  if (shouldCollapsed) {
    const collapsedCSS = {
      maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
      overflow: 'hidden',
      paddingBottom: '0',
    }

    const $contentBox = $('<div class="v2p-reply-content v2p-collapsed">').css(collapsedCSS)

    const $expandBtn = createButton({ children: '展开回复', className: 'v2p-expand-btn' })

    const toggleContent = () => {
      const collapsed = $contentBox.hasClass('v2p-collapsed')

      $contentBox
        .toggleClass('v2p-collapsed')
        .css(
          collapsed ? { maxHeight: 'none', overflow: 'auto', paddingBottom: '40px' } : collapsedCSS
        )
      $expandBtn.html(collapsed ? '收起回复' : '展开回复')
    }

    $expandBtn.on('click', () => {
      toggleContent()
    })

    $contentBox.append($replyContent.clone()).replaceAll($replyContent).append($expandBtn)
  }
}

/**
 * 根据用户的昵称设置用户的标签。
 */
export function updateMemberTag(memberName: Member['username'], tags: Tag[] | undefined) {
  const $v2pTags = $(`.v2p-tags-${memberName}`)

  const tagsValue = tags?.map((it) => it.name).join('，')

  if ($v2pTags.length > 0) {
    if (tagsValue) {
      $v2pTags.html(`<b>#</b>&nbsp;${tagsValue}`)
    } else {
      $v2pTags.remove()
    }
  } else {
    if (tagsValue) {
      $(`<div class="v2p-reply-tags v2p-tags-${memberName}"><b>#</b>&nbsp;${tagsValue}</div>`)
        .on('click', () => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          openTagsSetter(memberName)
        })
        .insertBefore(
          $commentCells
            .filter(`:has(> table strong > a[href="/member/${memberName}"])`)
            .find('> table .reply_content')
        )
    }
  }
}

export function openTagsSetter(memberName: Member['username']) {
  void (async () => {
    const storage = await getStorage(false)
    const latestTagsData = storage[StorageKey.MemberTag]

    const tagsValue = latestTagsData
      ? Reflect.has(latestTagsData, memberName)
        ? latestTagsData[memberName].tags?.map((it) => it.name).join('，')
        : undefined
      : undefined

    const newTagsValue = window.prompt(
      `对 @${memberName} 设置标签，多个标签以逗号（，）分隔。`,
      tagsValue
    )

    if (newTagsValue !== null) {
      const tags =
        newTagsValue.trim().length > 0
          ? newTagsValue.split(/,|，/g).map((it) => ({ name: it }))
          : undefined

      await setMemberTags(memberName, tags)

      updateMemberTag(memberName, tags)
    }
  })()
}
