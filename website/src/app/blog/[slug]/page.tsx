import { allBlogs } from 'contentlayer/generated'

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

  // const Content = getMDXComponent(blog.body?.raw)

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time className="mb-1 text-xs text-gray-600" dateTime={blog.date}>
          {/* {format(parseISO(post.date), 'LLLL d, yyyy')} */}
        </time>
        <h1>{blog.title}</h1>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: blog.body.html }}
        className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3"
      />
      {/* <Content /> */}
    </article>
  )
}
