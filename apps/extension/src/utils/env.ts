import { V2EX } from '../constants'

/** 动态获取 V2EX 的域名，防止跨域。 */
export const V2EX_ORIGIN
  = typeof window !== 'undefined' && /v2ex\.(com|co)/.test(window.location.origin)
    ? window.location.origin
    : V2EX.Origin

/**
 * 获取用户的操作系统。
 */
export function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const iosPlatforms = /(iphone|ipad|ipod)/i

  let os: 'macos' | 'ios' | 'windows' | 'android' | 'linux' | null = null

  if (macosPlatforms.test(userAgent)) {
    os = 'macos'
  }
  else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  }
  else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  }
  else if (userAgent.includes('android')) {
    os = 'android'
  }
  else if (userAgent.includes('linux')) {
    os = 'linux'
  }

  return os
}

/**
 * 检查运行在哪个扩展中。
 */
export function getRunEnv(): 'chrome' | 'web-ext' | null {
  if (typeof chrome === 'object' && typeof chrome.extension !== 'undefined') {
    return 'chrome'
  }

  if (typeof browser === 'object' && typeof browser.extension !== 'undefined') {
    return 'web-ext'
  }

  return null
}

/**
 * 判断当前运行环境是否为浏览器扩展。
 */
export function isBrowserExtension() {
  const runEnv = getRunEnv()

  return runEnv === 'chrome' || runEnv === 'web-ext'
}

/**
 * 判断当前是否为移动端
 * 通过检查 `#site-header` 元素是否存在来判断
 * @returns 是否为移动端
 */
export function isMobileView(): boolean {
  return $('#site-header').length > 0
}
