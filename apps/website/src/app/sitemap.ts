import type { MetadataRoute } from 'next'

import { HOST } from '~/utils'

import { blogs } from '#velite'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/blog', '/changelog', '/screenshot', '/support'].map((path) => ({
    url: `${HOST}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const blogRoutes = blogs.map((blog) => ({
    url: `${HOST}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
