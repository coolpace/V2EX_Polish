import { iconChromeWebStore, iconGitHub, iconLogoDark, iconLogoLight } from '../icons'
import { colorTheme } from './globals'

{
  // 为顶部导航栏的按钮添加 hover 效果。
  $('#Top .site-nav .tools > .top').addClass('v2p-hover-btn')
}

{
  // 添加页面底部相关信息。
  const $extraFooter = $(`
  <div class="v2p-footer">
    <div class="v2p-footer-text">扩展自 V2EX Polish </div>

    <div class="v2p-footer-link">
      <span>
        <a href="https://v2p.app" target="_blank">插件主页</a>
      </span>
      <span>
        <a href="https://github.com/coolpace/V2EX_Polish/discussions/1" target="_blank">问题反馈</a>
      </span>
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

  const logo = colorTheme === 'light' ? iconLogoLight : iconLogoDark
  $(`<div class="v2p-footer-logo">${logo}</div>`).prependTo($extraFooter)

  $('#Bottom .content').append($extraFooter)
}
