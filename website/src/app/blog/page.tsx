import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export default function BlogIndexPage() {
  const blogs = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="mx-auto max-w-xl py-8">
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
    </div>
  )
}
