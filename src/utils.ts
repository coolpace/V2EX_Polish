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
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  } else if (userAgent.includes('android')) {
    os = 'android'
  } else if (userAgent.includes('linux')) {
    os = 'linux'
  }

  return os
}
