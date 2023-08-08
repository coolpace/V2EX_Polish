export function PageContainer(props: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`mx-auto max-w-7xl ${props.className ?? ''}`}>{props.children}</div>
}
