'use client'

import { useEffect } from 'react'

import Link from 'next/link'

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { error, reset } = props

  useEffect(() => {
    // 错误边界是页面层的最后兜底，统一在这里上报，便于排查线上问题
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex flex-col items-center gap-4" role="alert">
        <h1 className="text-2xl font-bold">页面出错了</h1>
        <p className="text-main-600">
          请稍后重试。如果问题持续出现，欢迎反馈给我们。
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-white"
          type="button"
          onClick={() => reset()}
        >
          重试
        </button>
        <Link className="rounded-lg border border-main-200 px-4 py-2" href="/">
          返回首页
        </Link>
      </div>
    </main>
  )
}
