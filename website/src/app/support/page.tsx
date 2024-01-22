import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { allSupports } from 'contentlayer/generated'
import type { MDXComponents } from 'mdx/types'

import { Article } from '~/components/Article'
import { DonationOptions } from '~/components/donation/DonationOptions'
import { DonationTable } from '~/components/donation/DonationTable'
import { DontaionText } from '~/components/donation/DontaionText'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('赞赏支持'),
}

const mdxComponents: MDXComponents = {
  DonationOptions: () => <DonationOptions />,
  DonationText: () => <DontaionText />,
  DonationTable: () => <DonationTable />,
}

export default function DonationPage() {
  const support = allSupports.at(0)

  if (!support) {
    notFound()
  }

  const MDXContent = useMDXComponent(support.body.code)

  return (
    <PageContainer>
      <Article>
        <PageHeaderTitle>赞赏支持</PageHeaderTitle>

        <MDXContent components={mdxComponents} />
      </Article>
    </PageContainer>
  )
}
