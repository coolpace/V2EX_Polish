import { MessageKey } from '../../constants'

/**
 * 打开 V2EX Polish 的设置页面。
 *
 * 通过消息通道委托 background 打开，避免在 content script 里直接 `window.open`
 * 一个 `chrome-extension://` URL 被 Chrome 当作不可信导航屏蔽。
 */
export function openV2PSettings() {
  void chrome.runtime.sendMessage({ [MessageKey.showOptions]: true })
}
