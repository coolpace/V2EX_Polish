import { V2EX_DOMAINS } from '../constants'

/** 判断消息是否来自真正的每日任务页面。 */
export function isMissionCheckInUrl(value: string | undefined): boolean {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)

    return (
      V2EX_DOMAINS.includes(url.hostname)
      && (url.pathname === '/mission/daily' || url.pathname === '/mission/daily/')
    )
  }
  catch {
    return false
  }
}

/** 判断 URL 是否属于登录态切换或认证流程页面。 */
export function isCheckInAuthUrl(value: string | undefined): boolean {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)

    return (
      V2EX_DOMAINS.includes(url.hostname)
      && /^\/(signin|signup|forgot|2fa)(?:\/|$)/.test(url.pathname)
    )
  }
  catch {
    return false
  }
}
