import { type Metadata } from 'next'

import { getPageTitle } from '~/utils'

import { HomePage } from './home-page'

export const metadata: Metadata = {
  title: getPageTitle(),
}

export default function Page() {
  return <HomePage />
}
