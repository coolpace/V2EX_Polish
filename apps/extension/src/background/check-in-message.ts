import { V2EX_DOMAINS } from '../constants'

/** 判断消息是否来自真正的每日任务页面。 */
export function isMissionCheckInUrl(value: string | undefined): boolean {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)

    return V2EX_DOMAINS.includes(url.hostname)
      && (url.pathname === '/mission/daily' || url.pathname === '/mission/daily/')
  }
  catch {
    return false
  }
}
