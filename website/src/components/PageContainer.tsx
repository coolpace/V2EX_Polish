export function PageContainer(props: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`mx-auto max-w-container ${props.className ?? ''}`}>{props.children}</div>
}
