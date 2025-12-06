import { StorageKey } from '../../constants'
import { getStorage, isMobileView } from '../../utils'
import { $body, $commentTableRows, $replyBox, $topicHeader } from '../globals'
import { loadIcons } from '../helpers'
import { handleComments } from './comment'
import { handleContent } from './content'
import { handleLayout } from './layout'
import { handlePaging } from './paging'
import { handleRelatedTopics } from './related-topics'
import { handleReply } from './reply'
import { handleTools } from './tool'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  const searchParams = new URLSearchParams(window.location.search)

  const isPreview = searchParams.get('v2p-preview') === '1'

  if (isPreview) {
    $('#Top').hide()
    $('#Bottom').hide()
  }

  // 非移动端时，减少内容区的最小宽度，适配小屏预览的情况。
  if (!isMobileView()) {
    $body.css('min-width', '450px')
    $('.content').css('min-width', '450px')
  }

  handleLayout()

  if (options.openInNewTab) {
    $topicHeader.find('a[href^="/member/"]').prop('target', '_blank')

    // 支持新页签打开用户主页链接。
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  handleTools()

  // 按 Esc 隐藏回复框。
  {
    $(document).on('keydown', (ev) => {
      if (!ev.isDefaultPrevented()) {
        if (ev.key === 'Escape') {
          const $replyContent = $('#reply_content')

          if ($replyBox.hasClass('reply-box-sticky')) {
            $replyBox.removeClass('reply-box-sticky')
            $('#undock-button').css('display', 'none')
          }

          $replyContent.trigger('blur')
        }
      }
    })
  }

  handleContent()

  // 如果是从相同的主题跳转过来的，且含有分页参数，则被认为是执行翻页操作，跳过正文内容直接滚动到评论区。
  if (document.referrer !== '') {
    if (document.referrer.includes(document.location.pathname)) {
      const url = new URL(document.location.href)
      const page = url.searchParams.get('p')

      if (page && page !== '1') {
        document.querySelector('.topic_buttons')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  handlePaging()
  await handleComments()
  handleReply()

  loadIcons()

  // 加载相关主题推荐（异步执行，不阻塞主流程）
  void handleRelatedTopics()

  {
    const isFlamewarNode = $topicHeader.find('a[href^="/go"]').attr('href')?.endsWith('/flamewar')

    if (isFlamewarNode) {
      $('#node_sidebar').addClass('v2p-node-sidebar-flamewar')
    }
  }
})()
