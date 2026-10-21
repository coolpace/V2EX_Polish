import { describe, expect, it } from 'vitest'

import { isAllowedImageUrl } from '../apps/website/src/app/api/img-to-base64/allowlist'

describe('isAllowedImageUrl', () => {
  it('允许 V2EX、Gravatar 与配置的图床域名', () => {
    expect(isAllowedImageUrl('https://cdn.v2ex.com/avatar/1.png')).toBe(true)
    expect(isAllowedImageUrl('https://secure.gravatar.com/avatar/hash')).toBe(true)
    expect(isAllowedImageUrl('https://i.imgur.com/abc.png')).toBe(true)
    expect(isAllowedImageUrl('https://avatars.githubusercontent.com/u/1')).toBe(true)
  })

  it('允许主题正文中常见图床的子域', () => {
    expect(isAllowedImageUrl('https://user-images.githubusercontent.com/1/2.png')).toBe(true)
    expect(isAllowedImageUrl('https://i.loli.net/2024/01/01/abc.png')).toBe(true)
    expect(isAllowedImageUrl('https://p.sda1.dev/1/abc.png')).toBe(true)
    expect(isAllowedImageUrl('https://imgur.com/abc.png')).toBe(true)
  })

  it('拒绝非 HTTPS 地址', () => {
    expect(isAllowedImageUrl('http://cdn.v2ex.com/avatar/1.png')).toBe(false)
  })

  it('拒绝白名单之外的域名', () => {
    expect(isAllowedImageUrl('https://example.com/image.png')).toBe(false)
    expect(isAllowedImageUrl('https://cdn.v2ex.com.evil.example/image.png')).toBe(false)
    expect(isAllowedImageUrl('https://notv2ex.com/image.png')).toBe(false)
  })

  it('拒绝包含用户名或密码的地址', () => {
    expect(isAllowedImageUrl('https://user:pass@i.imgur.com/abc.png')).toBe(false)
  })

  it('拒绝非法 URL', () => {
    expect(isAllowedImageUrl('not-a-url')).toBe(false)
  })
})
