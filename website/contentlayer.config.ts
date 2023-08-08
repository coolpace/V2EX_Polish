import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blog/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (blog) => `${blog._raw.sourceFileName.replace(/\.md$/, '')}`,
    },
  },
}))

export const Changelog = defineDocumentType(() => ({
  name: 'Changelog',
  filePathPattern: `changelog.md`,
  computedFields: {
    slug: {
      type: 'string',
      resolve: (blog) => `${blog._raw.sourceFileName.replace(/\.md$/, '')}`,
    },
  },
}))

export default makeSource({ contentDirPath: 'src/content', documentTypes: [Blog, Changelog] })
