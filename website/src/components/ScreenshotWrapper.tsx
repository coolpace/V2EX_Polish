'use client'

import { useState } from 'react'

import { MoonStarIcon, SunIcon } from 'lucide-react'

export function ScreenshotWrapper(props: React.PropsWithChildren) {
  const [mode, setMode] = useState<string>()

  const isDarkTheme = mode === 'theme-dark'

  return (
    <div className={`group relative overflow-hidden md:rounded-md lg:rounded-lg ${mode ?? ''}`}>
      <div
        className="bg-main-800 text-main-100 border-main-100 absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-lg border-[3px] border-solid px-4 py-3 opacity-0 shadow-xl hover:shadow-[0_0_0_3px_var(--v2p-color-main-800)] group-hover:opacity-100"
        onClick={() => {
          setMode(isDarkTheme ? '' : 'theme-dark')
        }}
      >
        <span className="flex items-center gap-x-3">
          {isDarkTheme ? <SunIcon /> : <MoonStarIcon />}
          <span>切换至{isDarkTheme ? '浅色' : '深色'}主题</span>
        </span>
      </div>

      {props.children}
    </div>
  )
}
