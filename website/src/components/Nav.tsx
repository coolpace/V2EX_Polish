import Link from 'next/link'

import { Logo } from './Logo'
import { NavLink } from './NavLink'

export function Nav() {
  return (
    <nav>
      <ul className="text-main-600 ring-main-100 shadow-main-200 flex items-center rounded-full bg-white px-3 text-sm font-medium shadow-lg ring-1">
        <li>
          <Link className="mx-4 flex h-[18px] w-[18px] items-center" href="/">
            <Logo />
          </Link>
        </li>

        <li>
          <NavLink href="/blog">Blog</NavLink>
        </li>

        <li>
          <NavLink href="/changelog">Changelog</NavLink>
        </li>

        <li>
          <NavLink href="/github" target="_blank">
            GitHub
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
