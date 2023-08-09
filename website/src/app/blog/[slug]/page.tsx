import { allBlogs } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'

import { PageContainer } from '~/components/PageContainer'

export const generateStaticParams = () => {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find((blog) => blog.slug === params.slug)
  return { title: blog?.title }
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = allBlogs.find((blog) => blog.slug === params.slug)

  if (!blog) {
    return
  }

  return (
    <PageContainer>
      <article className="prose lg:prose-xl mx-auto max-w-xl py-8">
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
      </article>
    </PageContainer>
  )
}
