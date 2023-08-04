interface IntroductionProps {
  title: string
  content: string
}

export function Introduction(props: IntroductionProps) {
  return (
    <div className="text-main-600 text-sm md:text-center">
      <strong className="text-main-800 font-semibold">{props.title}</strong>
      {props.content}
    </div>
  )
}
