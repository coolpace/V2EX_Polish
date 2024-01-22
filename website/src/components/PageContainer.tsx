export function PageContainer(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`mx-auto max-w-container py-5 md:py-8 ${props.className ?? ''}`}
      data-role="page-container"
    >
      {props.children}
    </div>
  )
}
