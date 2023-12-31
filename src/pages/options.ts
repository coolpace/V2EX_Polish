import { createIcons, Settings, Tags, X } from 'lucide'

import { StorageKey, V2EX } from '../constants'
import type { MemberTag, Options } from '../types'
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

  const $contentSettings = $('.content-settings')
  const $contentTags = $('.content-tags')

  {
    /** 渲染已设置的用户标签列表。 */
    const renderTagsContent = async () => {
      const storage = await getStorage(false)
      const tagData = storage[StorageKey.MemberTag]

      $('.tags-list').remove()

      if (tagData && Object.keys(tagData).length > 0) {
        const $tagList = $(`
          <ul class="tags-list">
            ${Object.entries(tagData)
              .map(([memberName, { tags }]) => {
                if (tags && tags.length > 0) {
                  return `
                    <li class="tag-item">
                      <div class="tag-member-name">
                        <a href="${
                          V2EX.Origin
                        }/member/${memberName}" target="_blank">${memberName}</a>
                      </div>
                      <div class="tag-item-tags">
                        ${
                          tags
                            .map((tag, idx) => {
                              return `
                                <span
                                  class="tag-item-tag"
                                  data-member-name="${memberName}"
                                  data-tag-idx="${idx}"
                                  data-tag-name="${tag.name}"
                                >
                                  ${tag.name}
    
                                  <span class="tag-item-tag-remove">
                                    <span data-lucide="x"></span>
                                  </span>
                                </span>
                              `
                            })
                            .join('') || ''
                        }
                      </div>
                    </li>
                  `
                }

                return ''
              })
              .join('')}
          </ul>
        `)

        $tagList.find('.tag-item-tag').on('click', (ev) => {
          void (async () => {
            const $target = $(ev.currentTarget)
            const { memberName, tagIdx, tagName: tn } = $target.data()
            const tagName = String(tn)

            if (typeof memberName === 'string' && typeof tagIdx === 'number') {
              let newTagsValue = window.prompt(`修改 @${memberName} 的标签。`, tagName)
              newTagsValue = newTagsValue ? newTagsValue.trim() : null

              if (newTagsValue !== null) {
                const currentMemberTags = tagData[memberName].tags

                if (currentMemberTags) {
                  await setStorage(StorageKey.MemberTag, {
                    ...tagData,
                    [memberName]: {
                      tags: currentMemberTags.map((it, idx) =>
                        idx === tagIdx ? { name: newTagsValue! } : it
                      ),
                    },
                  })

                  renderTagsContent()
                }
              }
            }
          })()
        })

        $tagList.find('.tag-item-tag-remove').on('click', (ev) => {
          ev.stopPropagation()

          void (async () => {
            const $target = $(ev.currentTarget)
            const $tagItem = $target.closest('.tag-item')
            const { memberName, tagIdx } = $tagItem.data()

            if (typeof memberName === 'string' && typeof tagIdx === 'number') {
              const currentMemberTags = tagData[memberName].tags

              if (currentMemberTags) {
                if (currentMemberTags.length <= 1) {
                  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                  delete tagData[memberName]

                  await setStorage(StorageKey.MemberTag, tagData)
                } else {
                  const newTagData: MemberTag = {
                    ...tagData,
                    [memberName]: { tags: currentMemberTags.filter((_, idx) => idx !== tagIdx) },
                  }

                  await setStorage(StorageKey.MemberTag, newTagData)
                }

                renderTagsContent()
              }
            }
          })()
        })

        $contentTags.append($tagList)

        createIcons({ attrs: { width: '100%', height: '100%' }, icons: { X } })
      } else {
        $contentTags.append($('<p class="tags-empty">未对任何用户设置标签。</p>'))
      }
    }

    renderTagsContent()
  }

  {
    $('.menu-item').on('click', (ev) => {
      const $target = $(ev.currentTarget)
      $target.addClass('active').siblings().removeClass('active')

      if ($target.hasClass('menu-item-settings')) {
        $contentSettings.show()
        $contentTags.hide()
      } else if ($target.hasClass('menu-item-tags')) {
        $contentSettings.hide()
        $contentTags.show()
      }
    })
  }
})()
