import './polyfill'

import { createToast } from '../components/toast'
import { Links, MessageFrom, StorageKey } from '../constants'
import { iconGitHub, iconLogo } from '../icons'
import { postTask } from '../post-task'
import type { MessageData, Options, SettingsSyncInfo } from '../types'
import {
  applyRemoteSettings,
  deepMerge,
  getStorage,
  getV2P_Settings,
  injectScript,
  isBrowserExtension,
  isMobileView,
  setStorage,
  showRemoteSyncDialog,
} from '../utils'
import { $body, $infoCard, $wrapper } from './globals'
import { openV2PSettings, toggleTheme } from './helpers'

if (isMobileView()) {
  $body.addClass('v2p-mobile')
}

void (async () => {
  const isBrowserExt = isBrowserExtension()

  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  if (options.theme.mode === 'compact') {
    $body.addClass('v2p-mode-compact')
  }

  const $toggle = $('#Rightbar .light-toggle').addClass('v2p-color-mode-toggle')

  const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')

  const handleColorSchemeChange = ({ matches }: MediaQueryListEvent) => {
    // 每次系统主题变更时，都要获取最新的选项设置主题，这样才能设置正确的主题。
    void getStorage(false).then((storage) => {
      const options = storage[StorageKey.Options]
      const themeType = options.theme.type || 'light-default'

      toggleTheme({
        $toggle,
        prefersDark: matches,
        themeType: matches ? 'dark-default' : themeType,
      })
    })
  }

  const themeType = options.theme.type || 'light-default'

  // 处理自动切换「明/暗」主题。
  if (options.theme.autoSwitch) {
    const prefersDark = colorMedia.matches

    toggleTheme({
      $toggle,
      prefersDark,
      themeType: prefersDark ? 'dark-default' : themeType,
    })

    colorMedia.addEventListener('change', handleColorSchemeChange)
  }
  else {
    /**
     * 如果没有开启自动切换主题，则根据当前主题类型判断是否为暗色主题。
     *
     * - 在浏览器扩展中，使用 `themeType` 判断是否为暗色主题。
     * - 在油猴脚本中，使用 `$wrapper.hasClass('Night')` 判断是否为暗色主题。
     */
    const prefersDark = isBrowserExt ? themeType === 'dark-default' : $wrapper.hasClass('Night')

    toggleTheme({ $toggle, prefersDark, themeType })
  }

  $toggle.on('click', () => {
    const wrapperDark = $wrapper.hasClass('Night')

    const newTheme: Partial<Options['theme']> = {
      type: wrapperDark ? 'light-default' : 'dark-default',
      autoSwitch: false, // 当用户主动设置颜色主题后，取消自动跟随系统。
    }

    void setStorage(StorageKey.Options, deepMerge(options, { theme: newTheme }))
  })

  /** 用户从浏览器扩展中同步的配置信息（不是远程备份）。 */
  const syncInfo = storage[StorageKey.SyncInfo]

  // Warning: 不能在登录/注册等认证页面请求 getV2P_Settings 接口，否则会导致无法成功跳转页面。
  const authPaths = ['/signin', '/signup', '/forgot', '/2fa']
  const isAuthPage = authPaths.some((path) => window.location.pathname.startsWith(path))

  // 当发现远程的配置有更新时，自动同步到本地。
  if (syncInfo) {
    const lastCheckTime = syncInfo.lastCheckTime
    const tenMinutes = 10 * 60 * 1000
    const neverChecked = !lastCheckTime

    // neverChecked 仅影响「是否发起检查」，不影响「是否执行同步」。
    // eslint-disable-next-line @stylistic/no-mixed-operators
    const shouldCheck = neverChecked || lastCheckTime && Date.now() - lastCheckTime >= tenMinutes

    if (shouldCheck && !isAuthPage) {
      // ✅ 乐观更新 lastCheckTime：在发起网络请求前先写入，
      // 防止多个标签页同时通过 shouldCheck 判断导致重复请求。
      const updatedSyncInfo: SettingsSyncInfo = {
        ...syncInfo,
        lastCheckTime: Date.now(),
      }
      void chrome.storage.sync.set({ [StorageKey.SyncInfo]: updatedSyncInfo })

      void getV2P_Settings()
        .then(async (res) => {
          /** 远程备份的配置信息。 */
          const settings = res?.config
          const remoteSyncInfo = settings?.[StorageKey.SyncInfo]

          if (remoteSyncInfo && syncInfo.version < remoteSyncInfo.version) {
            // 远程版本较新 → 执行同步（通过 applyRemoteSettings 正确分发数据）
            await applyRemoteSettings(settings, { lastCheckTime: Date.now() })

            // 不强制刷新页面，避免打断用户正在进行的编辑操作（如撰写回复）。
            // 显示持久 toast，用户可点击手动刷新。
            const toast = createToast({
              message: '远程配置已同步，<a class="v2p-toast-action" href="javascript:void(0)" style="text-decoration:underline;cursor:pointer;">刷新页面</a>以应用更改',
              duration: 0,
            })

            $('.v2p-toast-action').on('click', () => {
              toast.clear()
              window.location.reload()
            })
          }
        })
        .catch((err) => {
          console.warn('[V2EX Polish] 检查远程配置更新失败：', err)
        })
    }
  }
  else if (!isAuthPage) {
    // 首次安装：静默检查远程是否存在备份，如果有则智能处理
    void getV2P_Settings()
      .then(async (res) => {
        const remoteSettings = res?.config
        const remoteSyncInfo = remoteSettings?.[StorageKey.SyncInfo]

        if (remoteSettings && remoteSyncInfo) {
          // 使用智能对话框提示用户选择是否同步
          const shouldSync = await showRemoteSyncDialog(remoteSettings)

          // 无论用户选择同步还是稍后，都创建初始的 syncInfo，防止重复弹窗
          // 这样下次检查时会进入 if (syncInfo) 分支，遵循 10 分钟检查间隔
          const initialSyncInfo: SettingsSyncInfo = {
            version: remoteSyncInfo.version,
            lastSyncTime: remoteSyncInfo.lastSyncTime,
            lastCheckTime: Date.now(),
          }
          void chrome.storage.sync.set({ [StorageKey.SyncInfo]: initialSyncInfo })

          if (shouldSync) {
            // 用户选择同步，执行同步操作
            await applyRemoteSettings(remoteSettings, {
              lastCheckTime: Date.now(),
            })

            // 显示同步成功提示
            const toast = createToast({
              message: '远程配置已同步，<a class="v2p-toast-action" href="javascript:void(0)" style="text-decoration:underline;cursor:pointer;">刷新页面</a>以应用更改',
              duration: 0,
            })

            $('.v2p-toast-action').on('click', () => {
              toast.clear()
              window.location.reload()
            })
          }
          else {
            // 用户选择不同步，显示简要提示（告知稍后可在设置中手动同步）
            createToast({
              message: '您可以随时在插件设置中同步远程配置',
              duration: 5000,
            })
          }
        }
      })
      .catch(() => {
        // 首次安装时检查失败是正常的（可能未登录），静默忽略
      })
  }

  // 更换主题颜色切换的按钮。
  {
    const $toggleImg = $toggle.find('> img')

    const alt = $toggleImg.prop('alt')

    if (alt === 'Light') {
      $toggle.prop('title', '使用深色主题')
      $toggleImg.replaceWith('<i data-lucide="moon"></i>')
    }
    else if (alt === 'Dark') {
      $toggle.prop('title', '使用浅色主题')
      $toggleImg.replaceWith('<i data-lucide="sun"></i>')
    }
  }

  // 为顶部导航栏的按钮添加 hover 效果。
  {
    $('#Top .site-nav .tools > .top').addClass('v2p-hover-btn')
  }

  // 增加 SOV2EX 作为搜索引擎选项。
  // MARK: @deprecated: V2EX 原站已支持 SOV2EX，故不再需要此功能。
  // {
  //   const $searchItem = $('<a class="search-item cell" target="_blank">')

  //   $searchItem
  //     .on('mouseover', () => {
  //       $('#search-result .search-item.active').addClass('v2p-no-active')
  //       $searchItem.addClass('active')
  //     })
  //     .on('mouseleave', () => {
  //       $('#search-result .search-item.active').removeClass('v2p-no-active')
  //       $searchItem.removeClass('active')
  //     })

  //   const $search = $('#search')

  //   $search.on('input', (ev) => {
  //     const value = (ev.target as HTMLInputElement).value
  //     const $searchGroup = $('#search-result .search-item-group:last-of-type')
  //     $searchItem.text(`SOV2EX ${value}`).prop('href', `https://www.sov2ex.com/?q=${value}`)
  //     $searchGroup.append($searchItem)
  //   })
  // }

  if (options.hideAccount) {
    const faviconLink = $('link[rel~=\'icon\']')
    faviconLink.prop('href', `${Links.Home}/favicon.svg`)

    $('#Logo').append('<i data-lucide="house"></i>').addClass('v2p-logo')
    $('#Top').find('a[href^="/member/"]').remove()
    $infoCard
      .find('a[href^="/member/"], table:nth-of-type(1) td:nth-of-type(3) .fade')
      .addClass('v2p-hide-account')
    $infoCard.find('.balance_area').addClass('v2p-hide-balance')
  }

  if (isBrowserExt) {
    // 注入浏览器扩展的资源文件，用于处理页面解析。
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

  // 添加页面底部相关信息。
  {
    const $extraFooter = $(`
    <div class="v2p-footer">
      <div class="v2p-footer-text">扩展自 V2EX Polish </div>

      <div class="v2p-footer-links">
        <a class="v2p-footer-link v2p-hover-btn" href="${Links.Portfolio}#contact" target="_blank">商务联系</a>
        <a class="v2p-footer-link v2p-hover-btn" href="${Links.Feedback}" target="_blank">问题反馈</a>
        <a class="v2p-footer-link v2p-hover-btn" href="${Links.Support}" target="_blank">赞赏支持</a>
        <a class="v2p-footer-link v2p-hover-btn v2p-optbtn" href="javascript:void(0);">选项设置</a>
      </div>

      <div class="v2p-footer-brand">
        <a
          href="https://github.com/coolpace/V2EX_Polish"
          target="_blank"
          title="GitHub 仓库"
          class="v2p-hover-btn v2p-github-ref"
        >
          ${iconGitHub}
        </a>
      </div>
    </div>
    `)

    $extraFooter.find('.v2p-optbtn').on('click', () => {
      openV2PSettings()
    })

    $(`<div class="v2p-footer-logo">${iconLogo}</div>`).prependTo($extraFooter)

    $('#Bottom .content').append($extraFooter)
  }

  // MARK: 监测 Polish 选项设置的变化。
  chrome.storage.onChanged.addListener((changes, storageType) => {
    if (storageType === 'sync') {
      const options = changes[StorageKey.Options]

      if (options) {
        const { newValue, oldValue } = options as {
          newValue: Options | undefined
          oldValue: Options | undefined
        }

        const newOptions = newValue
        const oldOptions = oldValue

        const newTheme = newOptions?.theme
        const oldTheme = oldOptions?.theme

        // 监听 Polish 主题设置的变化，实时切换主题。
        if (newTheme && oldTheme) {
          const prefersDark = newTheme.autoSwitch
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : isBrowserExt
              ? newTheme.type === 'dark-default'
              : $wrapper.hasClass('Night')

          if (newTheme.type !== oldTheme.type) {
            toggleTheme({
              $toggle,
              prefersDark,
              themeType: newTheme.type,
            })
          }
          else {
            // 当主题类型未发生变化时，仅处理自动跟随系统主题的设置。
            if (newTheme.autoSwitch !== oldTheme.autoSwitch) {
              if (newTheme.autoSwitch) {
                colorMedia.addEventListener('change', handleColorSchemeChange)
              }
              else {
                colorMedia.removeEventListener('change', handleColorSchemeChange)
              }

              toggleTheme({
                $toggle,
                prefersDark,
                themeType: prefersDark ? 'dark-default' : newTheme.type,
              })
            }
          }

          // 处理空间间距模式。
          if (newTheme.mode !== oldTheme.mode) {
            if (newTheme.mode === 'compact') {
              $body.addClass('v2p-mode-compact')
            }
            else {
              $body.removeClass('v2p-mode-compact')
            }
          }
        }
      }
    }
  })
})()
