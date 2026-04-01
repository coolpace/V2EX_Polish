export function HoverButton(props: React.PropsWithChildren) {
  return (
    <button className="relative z-10 after:absolute after:left-1/2 after:top-1/2 after:-z-10 after:size-2/3 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:bg-main-200 after:opacity-0 after:transition-all after:content-[''] hover:after:h-[125%] hover:after:w-[130%] hover:after:opacity-50">
      {props.children}
    </button>
  )
}
