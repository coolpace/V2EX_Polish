import type { MetadataRoute } from 'next'

import { HOST } from '~/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 分享页由用户输入驱动，图片代理与二维码接口仅响应 POST，均无需占用抓取预算
        disallow: ['/share/', '/api/share', '/api/img-to-base64', '/api/qrcode'],
      },
    ],
    sitemap: `${HOST}/sitemap.xml`,
    host: HOST,
  }
}
