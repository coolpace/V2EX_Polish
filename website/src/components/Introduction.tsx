interface IntroductionProps {
  title: string
  content: string
}

export function Introduction(props: IntroductionProps) {
  return (
    <div className="text-main/60 text-sm">
      <strong className="text-main font-semibold">{props.title}</strong>
      {props.content}
    </div>
  )
}
