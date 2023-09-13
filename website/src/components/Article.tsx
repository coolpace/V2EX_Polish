/**
 * 文章内容主体。
 */
export function Article(props: React.PropsWithChildren<{ header?: React.ReactNode }>) {
  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 md:mb-12">{props.header}</div>

      <div className="prose-sm lg:prose [&_a:hover]:border-solid [&_a]:border-b [&_a]:border-dashed [&_a]:border-main-500 [&_a]:no-underline">
        {props.children}
      </div>
    </article>
  )
}
