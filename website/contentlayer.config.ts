import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'

const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
    link: { type: 'string', required: true },
  },
}))

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.md',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'nested', of: Author, required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}))

export const Docs = defineDocumentType(() => ({
  name: 'Docs',
  filePathPattern: 'docs/**/*.md',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'nested', of: Author, required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}))

export const Changelog = defineDocumentType(() => ({
  name: 'Changelog',
  filePathPattern: 'changelog.md',
}))

export const Support = defineDocumentType(() => ({
  name: 'Support',
  filePathPattern: 'support.mdx',
  contentType: 'mdx',
}))

export default makeSource({
  contentDirPath: 'src/content',
  documentTypes: [Blog, Changelog, Support],
})
