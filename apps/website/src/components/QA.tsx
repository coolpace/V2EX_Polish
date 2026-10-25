interface OAProps {
  q: string
  a: string
}

export function QA(props: OAProps) {
  return (
    <div className="text-sm">
      <div className="text-base font-semibold">{props.q}</div>
      <div className="mt-2 text-main-500">{props.a}</div>
    </div>
  )
}
