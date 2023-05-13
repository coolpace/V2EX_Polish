import { Links, StorageKey } from '../constants'
import { iconChromeWebStore, iconDark, iconGitHub, iconLight, iconLogo } from '../icons'
import { getStorage } from '../utils'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  if (options.theme.autoSwitch) {
    const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

    if (perfersDark.matches) {
      $('#Wrapper').addClass('Night')
    }

    perfersDark.addEventListener('change', ({ matches }) => {
      if (matches) {
        $('#Wrapper').addClass('Night')
      } else {
        $('#Wrapper').removeClass('Night')
      }
    })
  }

  {
    // 为顶部导航栏的按钮添加 hover 效果。
    $('#Top .site-nav .tools > .top').addClass('v2p-hover-btn')
  }

  {
    const $toggle = $('#Rightbar .light-toggle').addClass('v2p-color-mode-toggle')
    const $toggleImg = $toggle.find('> img')
    const alt = $toggleImg.prop('alt')

    if (alt === 'Light') {
      $toggle.prop('title', '使用深色主题')
      $toggleImg.replaceWith(iconDark)
    } else if (alt === 'Dark') {
      $toggle.prop('title', '使用浅色主题')
      $toggleImg.replaceWith(iconLight)
    }
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
