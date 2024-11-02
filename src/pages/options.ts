import { Check, CircleHelp, createIcons, Key, Plus, Settings, Tags, X } from 'lucide'

import { StorageKey, V2EX } from '../constants'
import { initTheme, setMemberTags } from '../contents/helpers'
import type { Options, ThemeType } from '../types'
import { getStorage, setStorage } from '../utils'
import { handleTokenForm } from './options.helper'

function loadIcons() {
  createIcons({
    attrs: { width: '100%', height: '100%' },
    icons: {
      Settings,
      Tags,
      Key,
      Plus,
      X,
      CircleHelp,
      Check,
    },
  })
}

async function saveOptions() {
  const currentOptions: Options = {
    openInNewTab: $('#openInNewTab').prop('checked'),
    autoCheckIn: {
      enabled: $('#autoCheckIn').prop('checked'),
    },
    theme: {
      type: (() => {
        const isLightDefault = $('#theme_type_light-default').prop('checked')
        const isDarkDefault = $('#theme_type_dark-default').prop('checked')
        const isDawn = $('#theme_type_dawn').prop('checked')

        if (isLightDefault) {
          return 'light-default'
        }

        if (isDarkDefault) {
          return 'dark-default'
        }

        if (isDawn) {
          return 'dawn'
        }

        return undefined
      })(),
      autoSwitch: $('#theme_autoSwitch').prop('checked'),
      mode: (() => {
        const isDefault = $('#theme_mode_default').prop('checked')
        const isCompact = $('#theme_mode_compact').prop('checked')

        if (isDefault) {
          return 'default'
        }

        if (isCompact) {
          return 'compact'
        }

        return undefined
      })(),
    },
    reply: {
      preload: (() => {
        const off = $('#reply_preload_off').prop('checked')
        const auto = $('#reply_preload_auto').prop('checked')

        if (off) {
          return 'off'
        }

        if (auto) {
          return 'auto'
        }

        return undefined
      })(),
      layout: $('#replyLayoutAuto').prop('checked')
        ? 'auto'
        : $('#replyLayoutHorizontal').prop('checked')
          ? 'horizontal'
          : $('#replyLayoutVertical').prop('checked')
            ? 'vertical'
            : undefined,
    },
    replyContent: {
      autoFold: $('#autoFold').prop('checked'),
      hideReplyTime: $('#hideReplyTime').prop('checked'),
      hideRefName: $('#hideRefName').prop('checked'),
      showImgInPage: $('#showImgInPage').prop('checked'),
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
    contextMenu: {
      enabled: $('#contextMenuEnabled').prop('checked'),
    },
    hideAccount: $('#hideAccount').prop('checked'),
  }

  await setStorage(StorageKey.Options, currentOptions)
}

function setThemeOptions() {
  const themeTypes = [
    { name: 'Light default', type: 'light-default' },
    { name: 'Dark default', type: 'dark-default' },
    { name: 'Rose Pine Dawn', type: 'dawn', vip: true },
  ] satisfies { name: string; type: ThemeType; vip?: boolean }[]

  themeTypes.forEach((themeConfig) => {
    const $themeOption = $($('#theme-option').clone().html())

    const $input = $themeOption.find('.theme-opt-input')
    const $label = $themeOption.find('.theme-option')
    const $preview = $themeOption.find('.theme-pv-view')
    const $typeName = $themeOption.find('.theme-type-name')
    const $vipTip = $themeOption.find('.vip-tip')

    $input.prop('value', themeConfig.type)
    const id = `theme_type_${themeConfig.type}`
    $input.prop('id', id)
    $label.prop('for', id)
    $preview.addClass(`v2p-theme-${themeConfig.type}`)
    $typeName.text(themeConfig.name)

    if (themeConfig.vip) {
      $vipTip.css('display', 'block')
    }

    $('.theme-select').append($themeOption)
  })
}

void (async function init() {
  setThemeOptions()
  loadIcons()

  const storage = await getStorage()

  // 初始化设置表单的值。
  {
    const options = storage[StorageKey.Options]

    initTheme({ autoSwitch: options.theme.autoSwitch, themeType: options.theme.type })

    $('#openInNewTab').prop('checked', options.openInNewTab)
    $('#autoCheckIn').prop('checked', options.autoCheckIn.enabled)

    $('#theme_type_light-default').prop(
      'checked',
      !options.theme.type || options.theme.type === 'light-default'
    )
    $('#theme_type_dark-default').prop('checked', options.theme.type === 'dark-default')
    $('#theme_type_dawn').prop('checked', options.theme.type === 'dawn')
    $('#theme_autoSwitch').prop('checked', options.theme.autoSwitch)
    $('#theme_mode_default').prop(
      'checked',
      !options.theme.mode || options.theme.mode === 'default'
    )
    $('#theme_mode_compact').prop('checked', options.theme.mode === 'compact')

    $('#autoFold').prop('checked', options.replyContent.autoFold)
    $('#hideReplyTime').prop('checked', options.replyContent.hideReplyTime)
    $('#hideRefName').prop('checked', options.replyContent.hideRefName)
    $('#showImgInPage').prop('checked', options.replyContent.showImgInPage)

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

    $('#replyLayoutAuto').prop('checked', options.reply.layout === 'auto')
    $('#replyLayoutHorizontal').prop('checked', options.reply.layout === 'horizontal')
    $('#replyLayoutVertical').prop(
      'checked',
      options.reply.layout === 'vertical' || !options.reply.layout
    )
    $('#contextMenuEnabled').prop('checked', !!options.contextMenu?.enabled)
    $('#hideAccount').prop('checked', options.hideAccount === true)

    $('input[type]').on('change', () => {
      void saveOptions()
    })
  }

  // 渲染已设置的用户标签列表。
  {
    const $contentTags = $('[data-content-key="tags"]')

    const renderEmptyTagsContent = () => {
      $contentTags.append($('#tags-empty').html())
    }

    const renderTagsContent = async () => {
      const storage = await getStorage(false)
      const tagData = storage[StorageKey.MemberTag]
      const bytesUsed = await chrome.storage.sync.getBytesInUse([StorageKey.MemberTag])

      $contentTags.empty()

      if (tagData) {
        const count = Object.keys(tagData).length

        if (count > 0) {
          const $tagList = $(`
            <div class="tags-list-wrapper">
              <div class="tags-tip">
                <span>已设置 ${count} 条用户标签</span>

                <div class="usage">
                  用量：${(bytesUsed / 1024).toFixed(2)}KB / 8KB
                  <div class="usage-help">
                    <span data-lucide="circle-help"></span>
                    <div class="usage-popover">
                      <div class="usage-popover-title">用量限制</div>
                      <div class="usage-popover-content">
                        由于浏览器的存储空间限制，你只能存储 8KB 的用户标签数据。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="tags-divider" />
              <ul class="tags-list">
                ${Object.entries(tagData)
              .map(([memberName, { tags, avatar }]) => {
                if (tags && tags.length > 0) {
                  return `
                        <li class="tag-item">
                          <div class="tag-member-name">
                            <a href="${V2EX.Origin}/member/${memberName}" target="_blank">
                              ${avatar ? `<img src="${avatar}">` : ''}
                              <span>${memberName}：</span>
                            </a>
                          </div>

                          <div class="tag-item-tags">
                            ${tags
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

              if (typeof memberName === 'string') {
                const newTagValue = window.prompt(`新增对 @${memberName} 的标签。`)

                if (typeof memberName === 'string') {
                  if (newTagValue && newTagValue.trim() !== '') {
                    const currentMemberTags = tagData[memberName].tags

                    if (currentMemberTags) {
                      await setMemberTags({
                        memberName,
                        tags: [...currentMemberTags, { name: newTagValue }],
                      })

                      renderTagsContent()
                    }
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
                      await setMemberTags({
                        memberName,
                        tags: currentMemberTags.map((it, idx) =>
                          idx === tagIdx ? { name: changedTagValue } : it
                        ),
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
                    await setMemberTags({
                      memberName,
                      tags: currentMemberTags.filter((_, idx) => idx !== tagIdx),
                    })
                  }

                  renderTagsContent()
                }
              }
            })()
          })

          $contentTags.append($tagList)

          loadIcons()
        } else {
          renderEmptyTagsContent()
        }
      } else {
        renderEmptyTagsContent()
      }
    }

    renderTagsContent()
  }

  handleTokenForm()

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

      // 通过 URL 参数控制直接访问侧边栏的菜单。
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

  $('.theme-select .form-radio').on('click', (ev) => {
    ev.stopPropagation()

    const $themeOption = $(ev.currentTarget).find('.theme-opt-input')
    const themeType = $themeOption.prop('value')

    if (themeType) {
      initTheme({
        themeType: themeType as ThemeType,
      })
    }

    $('#theme_autoSwitch').prop('checked', false)
  })
})()
