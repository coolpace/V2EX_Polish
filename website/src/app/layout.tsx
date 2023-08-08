import { type Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

import { Logo } from '~/components/Logo'
import { Nav } from '~/components/Nav'
import { getPageTitle } from '~/utils'

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
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'fallback',
})

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html
      className={`text-main-800 h-full overflow-hidden bg-white ${notoSans.className}`}
      lang="zh-Hans-CN"
    >
      <body className="m-0 h-full overflow-y-auto">
        <header className="flex justify-center py-4 md:px-4 md:py-6">
          <Nav />
        </header>

        <main className="px-4 py-6 md:p-12">{props.children}</main>

        <footer className="px-4 md:px-12">
          <div className="max-w-container mx-auto md:px-5">
            <div className="my-8 h-px bg-gradient-to-r from-slate-600/0 via-slate-600/40 to-slate-600/0 md:my-14" />

            <div className="flex justify-between">
              <div className="inline-flex items-center">
                <div className="h-5 w-5">
                  <Logo />
                </div>
                <span className="ml-2 font-semibold">V2EX Polish</span>
              </div>

              <div></div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
