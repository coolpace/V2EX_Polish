import type { Metadata } from 'next'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { getPageTitle } from '~/utils'

import { changelogs as allChangelogs } from '#velite'

export const metadata: Metadata = {
  title: getPageTitle('Changelog'),
  alternates: {
    canonical: '/changelog',
  },
}

export default function ChangelogPage() {
  const changelog = allChangelogs.at(0)

  if (!changelog) {
    return
  }

  return (
    <PageContainer>
      <Article>
        <PageHeaderTitle>Changelog</PageHeaderTitle>

        <div
          className="text-sm *:mb-3 [&>*:last-child]:mb-0 [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-medium"
          dangerouslySetInnerHTML={{ __html: changelog.content }}
        />
      </Article>
    </PageContainer>
  )
}
