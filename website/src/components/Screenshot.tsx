'use client'

import { useEffect, useRef, useState } from 'react'

import { MoonStarIcon, SunIcon } from 'lucide-react'

import { ScreenHome } from '~/components/screens/ScreenHome'
import { ScreenTopic } from '~/components/screens/ScreenTopic'
import { ScreenTopicWrite } from '~/components/screens/ScreenTopicWrite'

const screens = [
  { name: 'home', page: <ScreenHome /> },
  { name: 'topic', page: <ScreenTopic /> },
  { name: 'topic-write', page: <ScreenTopicWrite /> },
] as const

type ScreenName = (typeof screens)[number]['name']

export function Screenshot() {
  const [mode, setMode] = useState<string>()

  const isDarkTheme = mode === 'theme-dark'

  const [currentDisplay, setCurrentDisplay] = useState<ScreenName>('home')

  const timer = useRef<number>()
  const mouseOver = useRef(false)

  const setupInterval = () => {
    window.clearInterval(timer.current)

    timer.current = window.setInterval(() => {
      if (!mouseOver.current) {
        setCurrentDisplay((display) => {
          if (display === 'home') {
            return 'topic'
          } else if (display === 'topic') {
            return 'topic-write'
          } else {
            return 'home'
          }
        })
      }
    }, 2500)
  }

  useEffect(() => {
    setupInterval()

    return () => {
      window.clearInterval(timer.current)
    }
  }, [])

  return (
    <>
      <div
        className="overflow-hidden rounded-2xl p-5 lg:rounded-3xl lg:p-10"
        style={{
          background:
            'linear-gradient(to top,#fff 0,hsla(0,0%,100%,0) 100%),linear-gradient(to right,rgb(247 185 85/.1) 0,rgb(255 0 128/.1) 100%)',
        }}
      >
        <div
          className={`group relative overflow-hidden rounded-xl bg-main-50 shadow-xl lg:rounded-2xl ${
            mode ?? ''
          } ${isDarkTheme ? 'shadow-main-500' : 'shadow-main-200'}`}
          onMouseEnter={() => {
            mouseOver.current = true
          }}
          onMouseLeave={() => {
            mouseOver.current = false
          }}
        >
          <button
            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-lg border-[3px] border-solid border-main-100 bg-main-800 px-4 py-3 text-main-100 opacity-0 shadow-xl transition-opacity hover:shadow-[0_0_0_3px_var(--v2p-color-main-800)] group-hover:opacity-100 motion-reduce:transition-none"
            onClick={() => {
              setMode(isDarkTheme ? '' : 'theme-dark')
            }}
          >
            <span className="flex items-center gap-x-3">
              {isDarkTheme ? <SunIcon /> : <MoonStarIcon />}
              <span>切换至{isDarkTheme ? '浅色' : '深色'}主题</span>
            </span>
          </button>

          <div
            className="group/page relative h-[610px] cursor-default select-none overflow-hidden"
            data-page={currentDisplay}
          >
            {screens.map(({ name, page }, idx) => (
              <div
                key={`${idx}`}
                className={`absolute left-0 top-0 size-full opacity-0 transition-opacity ${
                  name === 'home'
                    ? 'group-[[data-page="home"]]/page:opacity-100'
                    : name === 'topic'
                      ? 'group-[[data-page="topic"]]/page:opacity-100'
                      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        name === 'topic-write'
                        ? 'group-[[data-page="topic-write"]]/page:opacity-100'
                        : ''
                }`}
              >
                {page}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-3 px-2 py-4">
        {screens.map(({ name }, idx) => (
          <button
            key={`${idx}`}
            className={`h-2 w-6 rounded transition-colors ${
              currentDisplay === name ? 'bg-main-800 shadow-lg' : 'bg-main-350'
            }`}
            onClick={() => {
              setCurrentDisplay(name)
              setupInterval()
            }}
          />
        ))}
      </div>
    </>
  )
}
