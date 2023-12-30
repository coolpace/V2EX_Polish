import { createIcons, Settings, Tags } from 'lucide'

import { StorageKey } from '../constants'
import type { Options } from '../types'
import { getStorage, setStorage } from '../utils'

const saveOptions = async () => {
  const currentOptions: Options = {
    openInNewTab: $('#openInNewTab').prop('checked'),
    autoCheckIn: {
      enabled: $('#autoCheckIn').prop('checked'),
    },
    theme: {
      autoSwitch: $('#autoSwitch').prop('checked'),
    },
    reply: {
      preload: (() => {
        const off = $('#reply_preload_off').prop('checked')
        const auto = $('#reply_preload_auto').prop('checked')

        if (off) {
          return 'off' as const
        }

        if (auto) {
          return 'auto' as const
        }

        return undefined
      })(),
    },
    replyContent: {
      autoFold: $('#autoFold').prop('checked'),
      hideReplyTime: $('#hideReplyTime').prop('checked'),
      hideRefName: $('#hideRefName').prop('checked'),
    },
    nestedReply: (() => {
      return {
        display: $('input[name="nestedReply.display"]:checked').prop('value'),
        multipleInsideOne: $('#nestedReply_multipleInsideOne').prop('checked') ? 'nested' : 'off',
      }
    })(),
    userTag: {
      display: $('input[name="userTag.display"]:checked').prop('value'),
    },
  }

  await setStorage(StorageKey.Options, currentOptions)
}

$('#options-form').on('submit', (ev) => {
  ev.preventDefault() // 阻止默认的表单提交行为
  void saveOptions()
})

void (async function init() {
  createIcons({
    attrs: {
      width: '100%',
      height: '100%',
    },
    icons: {
      Settings,
      Tags,
    },
  })

  const storage = await getStorage()

  {
    const options = storage[StorageKey.Options]

    $('#openInNewTab').prop('checked', options.openInNewTab)
    $('#autoCheckIn').prop('checked', options.autoCheckIn.enabled)
    $('#autoSwitch').prop('checked', options.theme.autoSwitch)
    $('#autoFold').prop('checked', options.replyContent.autoFold)
    $('#hideReplyTime').prop('checked', options.replyContent.hideReplyTime)
    $('#hideRefName').prop('checked', options.replyContent.hideRefName)

    $('#displayAlign').prop('checked', options.nestedReply.display === 'align')
    $('#displayIndent').prop('checked', options.nestedReply.display === 'indent')
    $('#displayOff').prop('checked', options.nestedReply.display === 'off')
    $('#nestedReply_multipleInsideOne').prop(
      'checked',
      options.nestedReply.multipleInsideOne === 'nested'
    )

    $('#reply_preload_off').prop('checked', options.reply.preload === 'off')
    $('#reply_preload_auto').prop('checked', options.reply.preload === 'auto')

    $('#userTagDisplayInline').prop('checked', options.userTag.display === 'inline')
    $('#userTagDisplayBlock').prop('checked', options.userTag.display === 'block')

    $('input[type]').on('change', () => {
      void saveOptions()
    })
  }

  {
    const tagData = storage[StorageKey.MemberTag]

    if (tagData) {
      const $a = $(`
        <ul class="tags-list">
          ${Object.entries(tagData)
            .map(([memberName, { tags }]) => {
              return `
                <li class="tag-item">
                  <div class="tag-member-name">${memberName}</div>
                  <div class="tag-item-tags">
                    ${
                      tags
                        ?.map((tag) => `<span class="tag-item-tag">${tag.name}</span>`)
                        .join('') || ''
                    }
                  </div>
                </li>
              `
            })
            .join('')}
        </ul>
      `)

      $('.content-tags').append($a)
    }
  }

  {
    $('.menu-item').on('click', (ev) => {
      const $target = $(ev.currentTarget)
      $target.addClass('active').siblings().removeClass('active')

      if ($target.hasClass('menu-item-settings')) {
        $('.content-settings').show()
        $('.content-tags').hide()
      } else if ($target.hasClass('menu-item-tags')) {
        $('.content-settings').hide()
        $('.content-tags').show()
      }
    })
  }
})()
