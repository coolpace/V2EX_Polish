import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">页面不存在</h1>
      <p className="text-main-600">
        你访问的页面可能已被移动或删除。
      </p>
      <Link className="rounded-lg bg-green-600 px-4 py-2 text-white" href="/">
        返回首页
      </Link>
    </main>
  )
}
