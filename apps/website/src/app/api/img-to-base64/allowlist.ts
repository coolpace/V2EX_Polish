/**
 * 允许服务端代理的域名，匹配时包含其子域（如 cdn.v2ex.com）。
 *
 * 接口只接受命中此列表的图片地址，避免被用作任意 URL 的开放代理。
 * 新增域名前请确认用途，不要为了临时放通而放宽匹配规则。
 */
const ALLOWED_DOMAINS = [
  // V2EX 头像与官方图床
  'v2ex.com',
  'v2ex.co',
  // 头像服务
  'gravatar.com',
  // GitHub 头像，以及主题正文里常见的 issue 配图
  'githubusercontent.com',
  // 主题正文常见图床
  'imgur.com',
  'loli.net',
  'sinaimg.cn',
  'sda1.dev',
  'jsdelivr.net',
  'postimg.cc',
]

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
}

/**
 * 判断图片 URL 是否允许被服务端代理。
 *
 * 仅接受 HTTPS，且域名必须命中白名单。
 */
export function isAllowedImageUrl(value: string): boolean {
  let url: URL

  try {
    url = new URL(value)
  }
  catch {
    return false
  }

  if (url.protocol !== 'https:' || url.username || url.password) {
    return false
  }

  return isAllowedHost(url.hostname.toLowerCase())
}
