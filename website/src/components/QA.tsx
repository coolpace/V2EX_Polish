interface OAProps {
  q: string
  a: string
}

export function QA(props: OAProps) {
  return (
    <div className="text-sm">
      <div className="">{props.q}</div>
      <div className="text-main/50 mt-2">{props.a}</div>
    </div>
  )
}
