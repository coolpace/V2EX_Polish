import { StorageKey } from '../../constants'
import { iconReply, iconScrollTop } from '../../icons'
import { getRunEnv, getStorage, injectScript } from '../../utils'
import { $commentTableRows, $replyBox, $replyTextArea } from '../globals'
import { hostCall } from '../helpers'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'
import { handleReply } from './reply'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]
  const runEnv = getRunEnv()

  if (runEnv === 'chrome' || runEnv === 'web-ext') {
    await injectScript(chrome.runtime.getURL('scripts/web_accessible_resources.min.js'))
    window.once = await hostCall('window.once')
  }

  if (options.openInNewTab) {
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  {
    const $tools = $(`
      <div class="cell v2p-tools">
        <span class="v2p-tool v2p-hover-btn v2p-tool-reply">
          <span class="v2p-tool-icon">${iconReply}</span>回复主题
        </span>
        <span class="v2p-tool v2p-hover-btn v2p-tool-scroll-top">
          <span class="v2p-tool-icon">${iconScrollTop}</span>回到顶部
        </span>
      </div>
    `)

    $tools.find('.v2p-tool-reply').on('click', () => {
      $replyTextArea.trigger('focus')
    })

    $tools.find('.v2p-tool-scroll-top').on('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    $('#Rightbar > .box:has("#member-activity")').addClass('v2p-tool-box').append($tools)
  }

  {
    // 按 Esc 隐藏回复框。
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

  handlingContent()

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

  handlingPaging()
  void handlingComments()
  handleReply()
})()
