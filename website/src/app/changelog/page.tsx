import type { Metadata } from 'next'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { getPageTitle } from '~/utils'

import { changelogs as allChangelogs } from '#velite'

export const metadata: Metadata = {
  title: getPageTitle('Changelog'),
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
          dangerouslySetInnerHTML={{ __html: changelog.content }}
          className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3 [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-medium"
        />
      </Article>
    </PageContainer>
  )
}
