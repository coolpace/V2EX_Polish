import { createIcons, Plus, Settings, Tags, X } from 'lucide'

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
      layout: $('#replyLayoutHorizontal').prop('checked') ? 'horizontal' : undefined,
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

void (async function init() {
  const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

  if (perfersDark.matches) {
    $(document.body).addClass('v2p-theme-dark')
  }

  perfersDark.addEventListener('change', ({ matches }) => {
    if (matches) {
      $(document.body).addClass('v2p-theme-dark')
    } else {
      $(document.body).removeClass('v2p-theme-dark')
    }
  })

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

  // 初始化设置表单的值。
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

    $('#replyLayoutDefault').prop('checked', !options.reply.layout)
    $('#replyLayoutHorizontal').prop('checked', options.reply.layout === 'horizontal')

    $('input[type]').on('change', () => {
      void saveOptions()
    })
  }

  // 渲染已设置的用户标签列表。
  {
    const $contentTags = $('[data-content-key="tags"]')

    const renderTagsContent = async () => {
      const storage = await getStorage(false)
      const tagData = storage[StorageKey.MemberTag]

      $contentTags.empty()

      if (tagData) {
        const count = Object.keys(tagData).length

        if (count > 0) {
          const $tagList = $(`
            <div class="tags-list-wrapper">
              <div class="tags-tip">已设置 ${count} 条用户标签</div>
              <hr class="tags-divider" />
              <ul class="tags-list">
                ${Object.entries(tagData)
                  .map(([memberName, { tags }]) => {
                    if (tags && tags.length > 0) {
                      return `
                        <li class="tag-item">
                          <div class="tag-member-name">
                            <a href="${V2EX.Origin}/member/${memberName}" target="_blank">
                              ${memberName}：
                            </a>
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

                                      <span class="tag-remove">
                                        <span data-lucide="x"></span>
                                      </span>
                                    </span>
                                  `
                                })
                                .join('') || ''
                            }

                            <span class="tag-item-tag tag-item-tag-add" data-member-name="${memberName}">
                              <span class="tag-add"><span data-lucide="plus"></span></span>
                              <span>添加标签</span>
                            </span>
                          </div>
                        </li>
                      `
                    }

                    return ''
                  })
                  .join('')}
              </ul>
            </div>
          `)

          $tagList.find('.tag-item-tag.tag-item-tag-add').on('click', (ev) => {
            void (async () => {
              const $target = $(ev.currentTarget)
              const { memberName } = $target.data()
              const newTagValue = window.prompt(`新增对 @${memberName} 的标签。`)

              if (typeof memberName === 'string') {
                if (newTagValue && newTagValue.trim() !== '') {
                  const currentMemberTags = tagData[memberName].tags

                  if (currentMemberTags) {
                    await setStorage(StorageKey.MemberTag, {
                      ...tagData,
                      [memberName]: {
                        tags: [...currentMemberTags, { name: newTagValue }],
                      },
                    })

                    renderTagsContent()
                  }
                }
              }
            })()
          })

          $tagList
            .find('.tag-item-tag')
            .not('.tag-item-tag-add')
            .on('click', (ev) => {
              void (async () => {
                const $target = $(ev.currentTarget)

                const { memberName, tagIdx, tagName: tn } = $target.data()
                const tagName = String(tn)

                if (typeof memberName === 'string' && typeof tagIdx === 'number') {
                  const changedTagValue = window.prompt(`修改 @${memberName} 的标签。`, tagName)

                  if (changedTagValue && changedTagValue.trim() !== '') {
                    const currentMemberTags = tagData[memberName].tags

                    if (currentMemberTags) {
                      await setStorage(StorageKey.MemberTag, {
                        ...tagData,
                        [memberName]: {
                          tags: currentMemberTags.map((it, idx) =>
                            idx === tagIdx ? { name: changedTagValue } : it
                          ),
                        },
                      })

                      renderTagsContent()
                    }
                  }
                }
              })()
            })

          $tagList.find('.tag-remove').on('click', (ev) => {
            ev.stopPropagation()

            void (async () => {
              const $target = $(ev.currentTarget)
              const $tagItem = $target.closest('.tag-item-tag')
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

          createIcons({ attrs: { width: '100%', height: '100%' }, icons: { Plus, X } })
        }
      } else {
        $contentTags.append($('#tags-empty').html())
      }
    }

    renderTagsContent()
  }

  // 控制切换显示菜单的内容。
  {
    const url = new URL(window.location.href)
    const DEFAULT_ACTIVE_KEY = 'settings'
    const MENU = 'menu'

    const menuKeys = new Set<string>()

    $('[data-menu-key]').each((_, ele) => {
      const menuKey = ele.dataset.menuKey

      if (typeof menuKey === 'string') {
        menuKeys.add(menuKey)
      }
    })

    const activeMenu = (activeKey = DEFAULT_ACTIVE_KEY) => {
      if (!menuKeys.has(activeKey)) {
        activeKey = DEFAULT_ACTIVE_KEY
      }

      $('[data-menu-key]').removeClass('active')
      $(`[data-menu-key="${activeKey}"]`).addClass('active')

      $('[data-content-key]').hide()
      $(`[data-content-key="${activeKey}"]`).show()

      if (activeKey === DEFAULT_ACTIVE_KEY) {
        url.searchParams.delete(MENU)
        history.replaceState(null, '', url.toString())
      } else {
        url.searchParams.set(MENU, activeKey)
        history.replaceState(null, '', url.toString())
      }
    }

    const initialMenuKey = url.searchParams.get(MENU) || DEFAULT_ACTIVE_KEY
    activeMenu(initialMenuKey)

    $('.menu-item').on('click', (ev) => {
      const $target = $(ev.currentTarget)
      const { menuKey } = $target.data()

      if (typeof menuKey === 'string') {
        activeMenu(menuKey)
      }
    })
  }
})()
