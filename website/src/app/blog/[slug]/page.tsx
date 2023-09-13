import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'
import { HOST } from '~/utils'

export const generateStaticParams = () => {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export const generateMetadata = ({ params }: { params: { slug: string } }): Metadata => {
  const blog = allBlogs.find((blog) => blog.slug === params.slug)

  if (blog) {
    return {
      title: blog.title,
      openGraph: {
        type: 'article',
        title: blog.title,
        description: '专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
        url: `${HOST}/blog/${blog.slug}`,
        images: `${HOST}/api/og/blog?title=${blog.title}`,
      },
    }
  }

  return {}
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = allBlogs.find((blog) => blog.slug === params.slug)

  if (!blog) {
    return
  }

  return (
    <PageContainer>
      <div
        className="absolute right-0 top-0 hidden h-40 w-full max-w-[75%] blur-[140px] supports-[filter:blur(140px)]:block"
        style={{
          background: `linear-gradient(97.62deg, rgba(0 71 225 / 0.22) 2.27%, rgba(26 214 255 / 0.22) 50.88%, rgba(0 220 130 / 0.22) 98.48%)`,
        }}
      />

      <Article
        header={
          <>
            <h1 className="text-xl font-bold lg:text-3xl">{blog.title}</h1>

            <div className="mt-4 flex items-center gap-x-3 text-sm md:mt-6">
              <Link
                className="inline-flex items-center gap-x-2 !border-none"
                href={blog.author.link}
              >
                <Image
                  alt="作者头像"
                  className="!m-0 overflow-hidden rounded-full bg-main-200"
                  height={24}
                  src={blog.author.avatar}
                  width={24}
                />
                <span>{blog.author.name}</span>
              </Link>
              <time className="text-main-400" dateTime={blog.date}>
                {format(parseISO(blog.date), 'yyyy-MM-dd')}
              </time>
            </div>
          </>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: blog.body.html }} />
      </Article>
    </PageContainer>
  )
}
