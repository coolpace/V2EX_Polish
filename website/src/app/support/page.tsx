import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { allSupports } from 'contentlayer/generated'
import type { MDXComponents } from 'mdx/types'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { SupportOptions } from '~/components/support/SupportOptions'
import { SupportTable } from '~/components/support/SupportTable'
import { SupportText } from '~/components/support/SupportText'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('赞赏支持'),
}

const mdxComponents: MDXComponents = {
  SupportOptions: () => <SupportOptions />,
  SupportText: () => <SupportText />,
  SupportTable: () => <SupportTable />,
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
