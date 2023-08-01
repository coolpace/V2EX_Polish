import { type Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

import { getPageTitle } from '../utils'

import '~/styles/globals.css'

export const metadata: Metadata = {
  colorScheme: 'light',
  icons: [
    { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
    { url: '/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
  ],
  title: getPageTitle(),
  description:
    'V2EX Polish 是一款专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
  openGraph: {
    type: 'website',
    description:
      'V2EX Polish 是一款专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
    url: 'https://v2p.app',
    images: 'https://i.imgur.com/q2minty.png',
  },
  authors: [{ name: '陈梓聪 LeoKu', url: 'https://github.com/Codennnn' }],
  manifest: '/manifest.webmanifest',
}

const notoSans = Noto_Sans({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html className={notoSans.className} lang="zh-Hans-CN">
      <body className="text-main m-0 h-full">
        <main className="h-full p-12">{props.children}</main>
      </body>
    </html>
  )
}
