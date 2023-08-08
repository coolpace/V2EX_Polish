export function PageHeaderTitle(props: React.PropsWithChildren) {
  return (
    <h1 className="mb-10 text-center text-4xl font-bold md:text-left md:font-black lg:mb-14 lg:text-6xl">
      {props.children}
    </h1>
  )
}
