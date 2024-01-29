import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import Link from 'next/link'
import { Theme } from '@radix-ui/themes'

import { HoverButton } from '~/components/HoverButton'
import { Initial } from '~/components/Initial'
import { Logo } from '~/components/Logo'
import { Nav } from '~/components/Nav'
import { getPageTitle } from '~/utils'

import '~/styles/globals.css'

export const metadata: Metadata = {
  colorScheme: 'light',
  icons: [
    {
      url: '/favicon.svg',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: light)',
      sizes: 'any',
      rel: 'icon',
    },
    {
      url: '/favicon-dark.svg',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: dark)',
      sizes: 'any',
      rel: 'icon',
    },
  ],
  title: getPageTitle(),
  description: '专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
  openGraph: {
    type: 'website',
    title: 'V2EX Polish - 浏览器插件',
    description: '专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
    url: 'https://www.v2p.app',
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
    <html className="h-full overflow-hidden bg-white text-main-800" lang="zh-Hans-CN">
      <Initial />

      <body className="relative m-0 h-full overflow-y-auto">
        <Theme accentColor="gray" appearance="light" className={`h-full ${notoSans.className}`}>
          <header className="relative z-50 flex justify-center py-4 md:px-4 md:py-6">
            <Nav />
          </header>

          <main className="px-4 py-6 md:p-12">{props.children}</main>

          <footer className="sticky top-full border-t border-solid border-main-200">
            <div className="px-4 pt-5 md:px-12">
              <div className="mx-auto max-w-container md:px-36">
                <div className="flex justify-between py-3 md:py-8">
                  <div className="inline-flex items-center">
                    <div className="size-3 md:size-4">
                      <Logo />
                    </div>
                    <span className="ml-2 text-sm/none font-semibold md:text-base/none">
                      V2EX Polish
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-x-3 text-xs text-main-600 md:text-sm">
                    <HoverButton>
                      <Link
                        href="https://chromewebstore.google.com/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm"
                        target="_blank"
                      >
                        应用商店
                      </Link>
                    </HoverButton>

                    <span className="text-xl font-bold text-main-400">·</span>

                    <HoverButton>
                      <Link
                        href="https://github.com/coolpace/V2EX_Polish/discussions/1"
                        target="_blank"
                      >
                        使用反馈
                      </Link>
                    </HoverButton>

                    <span className="text-xl font-bold text-main-400">·</span>

                    <HoverButton>
                      <Link href="/support" target="_blank">
                        赞赏支持
                      </Link>
                    </HoverButton>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </Theme>
      </body>
    </html>
  )
}
