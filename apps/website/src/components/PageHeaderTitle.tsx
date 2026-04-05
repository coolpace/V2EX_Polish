export function PageHeaderTitle(props: React.PropsWithChildren) {
  return (
    <h1 className="text-with-shadow mb-10 text-center text-4xl font-black md:mb-14 md:text-left lg:mb-16 lg:text-6xl">
      {props.children}
    </h1>
  )
}
