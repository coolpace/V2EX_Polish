/**
 * 文章内容主体。
 */
export function Article(props: React.PropsWithChildren) {
  return (
    <article className="prose-sm mx-auto max-w-xl py-8 lg:prose [&_a:hover]:border-solid [&_a]:border-b [&_a]:border-dashed [&_a]:border-main-500 [&_a]:no-underline">
      {props.children}
    </article>
  )
}
