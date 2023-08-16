import { type Metadata } from 'next'
import { allBlogs } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'

import { Article } from '~/components/Article'
import { PageContainer } from '~/components/PageContainer'

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
      // openGraph: {
      //   type: 'article',
      //   title: blog.title,
      //   description: '专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能为你带来出色的体验。',
      //   url: 'https://v2p.app',
      //   images: `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog?title=${blog.title}`,
      // },
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
      <Article>
        <div className="mb-8">
          <h1 className="text-xl font-bold lg:text-3xl">{blog.title}</h1>

          <div className="mt-2 flex items-center gap-x-3 text-sm">
            <span>{blog.author}</span>
            <time className="text-main-600" dateTime={blog.date}>
              {format(parseISO(blog.date), 'yyyy-MM-dd')}
            </time>
          </div>
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: blog.body.html }}
          className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3"
        />
      </Article>
    </PageContainer>
  )
}
