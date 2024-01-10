import Link from 'next/link'

import { Logo } from './Logo'
import { NavLink } from './NavLink'

export function Nav() {
  return (
    <nav>
      <ul className="flex items-center rounded-full bg-white px-3 text-sm font-medium text-main-600 shadow-lg shadow-main-200 ring-1 ring-main-100">
        <li>
          <Link aria-label="Go to home" className="mx-4 flex size-[18px] items-center" href="/">
            <Logo />
          </Link>
        </li>

        <li>
          <NavLink href="/blog">Blog</NavLink>
        </li>

        {/* <li>
          <NavLink href="/features">Features</NavLink>
        </li> */}

        <li>
          <NavLink href="/changelog">Changelog</NavLink>
        </li>

        <li>
          <NavLink href="https://github.com/coolpace/V2EX_Polish" prefetch={false} target="_blank">
            GitHub
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
