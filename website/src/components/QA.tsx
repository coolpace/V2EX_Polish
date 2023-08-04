interface OAProps {
  q: string
  a: string
}

export function QA(props: OAProps) {
  return (
    <div className="text-sm">
      <div className="font-semibold">{props.q}</div>
      <div className="text-main-500 mt-2">{props.a}</div>
    </div>
  )
}
