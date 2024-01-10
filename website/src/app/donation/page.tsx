import type { Metadata } from 'next'
import { allDonations } from 'contentlayer/generated'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('赞赏支持'),
}

export default function DonationPage() {
  const donation = allDonations.at(0)

  if (!donation) {
    return
  }

  return (
    <PageContainer className="py-5 md:py-8">
      <Article>
        <PageHeaderTitle>赞赏支持</PageHeaderTitle>

        <div
          dangerouslySetInnerHTML={{ __html: donation.body.html }}
          className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3 [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-medium"
        />
      </Article>
    </PageContainer>
  )
}
