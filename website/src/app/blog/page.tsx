import { type Metadata } from 'next'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

import { PageContainer } from '~/components/PageContainer'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('博客'),
}

export default function BlogIndexPage() {
  const blogs = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <PageContainer className="py-8">
      <h1 className="mb-8 text-center text-2xl font-black">Blog</h1>

      <div>
        {blogs.map((blog) => {
          return (
            <Link key={blog.title} href={`/blog/${blog.slug}`}>
              <h2>{blog.title}</h2>
            </Link>
          )
        })}
      </div>
    </PageContainer>
  )
}
