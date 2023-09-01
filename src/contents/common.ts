import { Links, MessageFrom, StorageKey } from '../constants'
import { iconChromeWebStore, iconGitHub, iconLogo } from '../icons'
import type { MessageData } from '../types'
import { deepMerge, getRunEnv, getStorage, injectScript, setStorage } from '../utils'
import { postTask } from './helpers'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  {
    // 更换主题颜色切换的按钮。

    const $toggle = $('#Rightbar .light-toggle').addClass('v2p-color-mode-toggle')

    const $toggleImg = $toggle.find('> img')
    const alt = $toggleImg.prop('alt')

    if (alt === 'Light') {
      $toggle.prop('title', '使用深色主题')
      $toggleImg.replaceWith('<i data-lucide="moon"></i>')
    } else if (alt === 'Dark') {
      $toggle.prop('title', '使用浅色主题')
      $toggleImg.replaceWith(`<i data-lucide="sun"></i>`)
    }

    if (options.theme.autoSwitch) {
      const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

      if (perfersDark.matches) {
        $('body').addClass('v2p-theme-dark')
        $('#Wrapper').addClass('Night')
      }

      perfersDark.addEventListener('change', ({ matches }) => {
        if (matches) {
          $('body').addClass('v2p-theme-dark')
          $('#Wrapper').addClass('Night')
        } else {
          $('body').removeClass('v2p-theme-dark')
          $('#Wrapper').removeClass('Night')
        }
      })

      $toggle.on('click', () => {
        // 当用户主动设置颜色主题后，取消自动跟随系统。
        void setStorage(StorageKey.Options, deepMerge(options, { theme: { autoSwitch: false } }))
      })
    }
  }

  {
    // 为顶部导航栏的按钮添加 hover 效果。
    $('#Top .site-nav .tools > .top').addClass('v2p-hover-btn')
  }

  {
    // 增加 SOV2EX 作为搜索引擎选项。
    const $searchItem = $('<a class="search-item cell" target="_blank">')

    $searchItem
      .on('mouseover', () => {
        $('#search-result .search-item.active').addClass('v2p-no-active')
        $searchItem.addClass('active')
      })
      .on('mouseleave', () => {
        $('#search-result .search-item.active').removeClass('v2p-no-active')
        $searchItem.removeClass('active')
      })

    const $search = $('#search')

    $search.on('input', (ev) => {
      const value = (ev.target as HTMLInputElement).value
      const $searchGroup = $('#search-result .search-item-group:last-of-type')
      $searchItem.text(`SOV2EX ${value}`).prop('href', `https://www.sov2ex.com/?q=${value}`)
      $searchGroup.append($searchItem)
    })
  }

  {
    const runEnv = getRunEnv()

    if (runEnv === 'chrome' || runEnv === 'web-ext') {
      injectScript(chrome.runtime.getURL('scripts/web_accessible_resources.min.js'))

      window.addEventListener('message', (ev: MessageEvent<MessageData>) => {
        if (ev.data.from === MessageFrom.Web) {
          const payload = ev.data.payload
          const task = payload?.task

          if (payload?.status === 'ready') {
            postTask('if (typeof window.once === "string") { return window.once; }', (result) => {
              if (typeof result === 'string') {
                window.once = result
              }
            })
          }

          if (task) {
            window.__V2P_Tasks?.get(task.id)?.(task.result)
          }
        }
      })
    }
  }

  {
    // 添加页面底部相关信息。
    const $extraFooter = $(`
    <div class="v2p-footer">
      <div class="v2p-footer-text">扩展自 V2EX Polish </div>
  
      <div class="v2p-footer-links">
        <a class="v2p-footer-link v2p-hover-btn" href="${Links.Home}" target="_blank">插件主页</a>
        <a class="v2p-footer-link v2p-hover-btn" href="${Links.Feedback}" target="_blank">问题反馈</a>
      </div>
  
      <div class="v2p-footer-brand">
        <span>
          <a
            href="https://chrome.google.com/webstore/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm"
            target="_blank"
            title="Chrome 应用商店"
          >
            ${iconChromeWebStore}
          </a>
        </span>
        <span>
          <a
            href="https://github.com/coolpace/V2EX_Polish"
            target="_blank"
            title="GitHub 仓库"
          >
            ${iconGitHub}
          </a>
        </span>
      </div>
    </div>
    `)

    $(`<div class="v2p-footer-logo">${iconLogo}</div>`).prependTo($extraFooter)

    $('#Bottom .content').append($extraFooter)
  }
})()
