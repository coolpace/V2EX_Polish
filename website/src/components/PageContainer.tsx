export function PageContainer(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto max-w-container ${props.className ?? ''}`} data-role="page-container">
      {props.children}
    </div>
  )
}
