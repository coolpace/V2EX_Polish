import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Article } from '~/components/Article'
import { MDXContent } from '~/components/MDXContent'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { SupportOptions } from '~/components/support/SupportOptions'
import { SupportTable } from '~/components/support/SupportTable'
import { getPageTitle } from '~/utils'

import { supports } from '#velite'

export const metadata: Metadata = {
  title: getPageTitle('赞赏支持'),
  alternates: {
    canonical: '/support',
  },
}

const mdxComponents: Record<string, React.ComponentType> = {
  SupportOptions: () => <SupportOptions />,
  SupportTable: () => <SupportTable />,
}

export default function DonationPage() {
  const support = supports.at(0)

  if (!support) {
    notFound()
  }

  return (
    <PageContainer>
      <Article>
        <PageHeaderTitle>赞赏支持</PageHeaderTitle>

        <MDXContent code={support.code} components={mdxComponents} />
      </Article>
    </PageContainer>
  )
}
