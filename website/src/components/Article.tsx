export function Article(props: React.PropsWithChildren) {
  return <article className="prose mx-auto max-w-xl py-8 lg:prose-xl">{props.children}</article>
}
