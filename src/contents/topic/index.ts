import { StorageKey } from '../../constants'
import { getStorage } from '../../utils'
import { $commentTableRows, $replyBox } from '../globals'
import { loadIcons } from '../helpers'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingLayout } from './layout'
import { handlingPaging } from './paging'
import { handleReply } from './reply'
import { handlingTools } from './tool'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  if (options.openInNewTab) {
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  handlingTools()

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
  await handlingComments()
  handleReply()

  handlingLayout()

  loadIcons()
})()
