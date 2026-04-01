interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function Feature(props: FeatureProps) {
  return (
    <div>
      <div className="flex justify-center">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-main-100">
          {props.icon}
        </span>
      </div>

      <h2 className="mt-4 text-center text-lg font-semibold">{props.title}</h2>

      <p className="mt-4 text-center text-sm text-main-600">{props.description}</p>
    </div>
  )
}
