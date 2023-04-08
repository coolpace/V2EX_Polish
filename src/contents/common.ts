import { Links } from '../constants'
import { iconChromeWebStore, iconDark, iconGitHub, iconLight, iconLogo } from '../icons'

{
  // 为顶部导航栏的按钮添加 hover 效果。
  $('#Top .site-nav .tools > .top').addClass('v2p-hover-btn')
}

{
  const $toggle = $('#Rightbar .light-toggle').addClass('v2p-color-mode-toggle')
  const $toggleImg = $toggle.find('> img')

  if ($toggleImg.prop('alt') === 'Light') {
    $toggle.prop('title', '使用深色主题')
    $toggleImg.replaceWith(iconDark)
  }

  if ($toggleImg.prop('alt') === 'Dark') {
    $toggle.prop('title', '使用浅色主题')
    $toggleImg.replaceWith(iconLight)
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
