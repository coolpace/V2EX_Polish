import { type Metadata } from 'next'

import { getPageTitle } from '../utils'

import '~/styles/globals.css'

export const metadata: Metadata = {
  colorScheme: 'light',
  icons: [
    { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
    { url: '/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
  ],
  title: getPageTitle(),
  description: 'V2EX Polish - 浏览器插件。',
  authors: [{ name: '陈梓聪 LeoKu', url: 'https://github.com/Codennnn' }],
  manifest: '/manifest.webmanifest',
}

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html className="h-full" lang="zh-Hans-CN">
      <body className="m-0 h-full">
        <main className="h-full">{props.children}</main>
      </body>
    </html>
  )
}
