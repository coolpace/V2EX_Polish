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

/**
 * 将时间戳格式化为「年月日」。
 */
export function formatTimestamp(timestamp: number, includesTime = false) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const YMH = `${year}-${month}-${day}`

  if (includesTime) {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${YMH} ${hour}:${minute}:${second}`
  }

  return YMH
}
