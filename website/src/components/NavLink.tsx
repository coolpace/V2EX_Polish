'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink(props: React.PropsWithChildren<React.ComponentProps<typeof Link>>) {
  const { ...restLinkProps } = props

  const pathname = usePathname()

  const isActive = pathname === restLinkProps.href

  return (
    <Link
      className={`relative inline-block px-3 py-2 ${isActive ? 'font-bold' : ''}`}
      {...restLinkProps}
    >
      {props.children}
      <span
        className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-slate-800/0 via-slate-800/40 to-slate-800/0"
        style={{ display: isActive ? undefined : 'none' }}
      />
    </Link>
  )
}
