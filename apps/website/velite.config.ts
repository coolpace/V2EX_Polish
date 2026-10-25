import { defineCollection, defineConfig, s, z } from 'velite'

const authorSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  link: z.string(),
})

const blogs = defineCollection({
  name: 'Blog',
  pattern: 'blog/**/*.md',
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      author: authorSchema,
      content: s.markdown(),
      metadata: s.metadata(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.md$/, '') ?? '',
    })),
})

const docs = defineCollection({
  name: 'Doc',
  pattern: 'docs/**/*.md',
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      author: authorSchema,
      content: s.markdown(),
      metadata: s.metadata(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.md$/, '') ?? '',
    })),
})

const changelogs = defineCollection({
  name: 'Changelog',
  pattern: 'changelog.md',
  schema: s.object({
    content: s.markdown(),
  }),
})

const supports = defineCollection({
  name: 'Support',
  pattern: 'support.mdx',
  schema: s.object({
    code: s.mdx(),
  }),
})

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: true,
  },
  collections: { blogs, docs, changelogs, supports },
})
