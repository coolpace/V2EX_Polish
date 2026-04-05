/**
 * 文章内容主体。
 */
export function Article(props: React.PropsWithChildren<{ header?: React.ReactNode }>) {
  return (
    <article className="mx-auto md:max-w-[750px]">
      {props.header ? <div className="mb-8 md:mb-12">{props.header}</div> : null}

      <div className="prose-sm !max-w-max lg:prose [&_a:hover]:border-solid [&_a]:border-b [&_a]:border-dashed [&_a]:border-main-500 [&_a]:no-underline">
        {props.children}
      </div>
    </article>
  )
}
