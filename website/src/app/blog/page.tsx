import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'

import { PageContainer } from '~/components/PageContainer'
import { PageHeaderTitle } from '~/components/PageHeaderTitle'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('Blog'),
  description: 'V2P 博客文章，在这里发现更多 V2P 的相关信息。',
}

export default function BlogIndexPage() {
  const blogs = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <PageContainer>
      <div className="px-2 lg:px-60">
        <PageHeaderTitle>Blog</PageHeaderTitle>

        <div>
          {blogs.map((blog) => {
            return (
              <Link
                key={blog.title}
                className="mt-6 block rounded p-2 first-of-type:mt-0 hover:bg-main-50 md:mt-14"
                href={`/blog/${blog.slug}`}
              >
                <h2 className="text-lg font-semibold md:text-xl">{blog.title}</h2>

                <span className="mt-2 flex items-center gap-x-2 pl-px text-sm">
                  <Image
                    alt="作者头像"
                    className="overflow-hidden rounded-full bg-main-200"
                    height={24}
                    src={blog.author.avatar}
                    width={24}
                  />
                  <span>{blog.author.name}</span>
                  <time className="text-main-400" dateTime={blog.date}>
                    {format(parseISO(blog.date), 'yyyy-MM-dd')}
                  </time>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
