export function PageContainer(props: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`max-w-container mx-auto ${props.className ?? ''}`}>{props.children}</div>
}
