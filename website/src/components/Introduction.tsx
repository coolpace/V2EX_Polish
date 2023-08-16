interface IntroductionProps {
  title: string
  content: string
}

export function Introduction(props: IntroductionProps) {
  return (
    <div className="text-sm text-main-600 md:text-center">
      <strong className="font-semibold text-main-800">{props.title}</strong>
      {props.content}
    </div>
  )
}
