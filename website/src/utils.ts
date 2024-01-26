import splitbee from '@splitbee/web'

const isDev: boolean = process.env.NODE_ENV === 'development'

export const HOST = 'https://www.v2p.app'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export function getPageTitle(title?: string): string {
  const mainTitle = 'V2EX Polish 浏览器插件'

  return title ? `${title} - ${mainTitle}` : mainTitle
}

export function isNumeric(str: string) {
  return /^\d+$/.test(str)
}

export function trackEvent(
  event: string,
  data?: Record<string, string | number | boolean | undefined | null>
): void {
  if (isDev) {
    return
  }

  void splitbee.track(event, data)
}
