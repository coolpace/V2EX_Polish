export function FeaturesBg(props: React.PropsWithChildren<{ className?: string }>) {
  const { children, className } = props

  return (
    <div
      className={`aspect-[1280_/_800] w-full overflow-hidden ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(to top,#fff 0,hsla(0,0%,100%,0) 100%),linear-gradient(to right,rgb(247 185 85/.1) 0,rgb(255 0 128/.1) 100%)',
      }}
    >
      {children}
    </div>
  )
}
