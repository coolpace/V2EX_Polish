'use client'

import { useState } from 'react'

import { MoonStarIcon, SunIcon } from 'lucide-react'

import { ScreenHome } from '~/components/screens/ScreenHome'
import { ScreenTopic } from '~/components/screens/ScreenTopic'

const screens = [
  { name: 'home', page: <ScreenHome /> },
  { name: 'topic', page: <ScreenTopic /> },
]

export function Screenshot() {
  const [mode, setMode] = useState<string>()
  const isDarkTheme = mode === 'theme-dark'

  const [page, setPage] = useState('home')

  return (
    <>
      <div className="overflow-hidden  md:rounded-md md:shadow-[0_0_0_20px] md:shadow-main-100 lg:rounded-lg lg:shadow-[0_0_0_40px] lg:shadow-main-100">
        <div
          className={`group relative bg-main-50 shadow-lg md:rounded-md lg:rounded-lg ${
            mode ?? ''
          }`}
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
            data-page={page}
          >
            {screens.map(({ name, page }, idx) => (
              <div
                key={`${idx}`}
                className={`absolute left-0 top-0 h-full w-full opacity-0 transition-opacity ${
                  name === 'home'
                    ? 'group-[[data-page="home"]]/page:opacity-100'
                    : 'group-[[data-page="topic"]]/page:opacity-100'
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
              page === name ? 'bg-main-800 shadow-lg' : 'bg-main-350'
            }`}
            onClick={() => setPage(name)}
          />
        ))}
      </div>
    </>
  )
}
