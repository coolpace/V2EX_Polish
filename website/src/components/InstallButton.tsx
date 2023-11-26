import { ChromeIcon } from '~/components/icons/ChromeIcon'

export function InstallButton() {
  return (
    <a
      className="gap-x group flex cursor-pointer gap-y-3 overflow-hidden rounded-[8px] border-2 border-solid border-current px-4 py-2 text-sm font-semibold text-current shadow-[0_5px_0_-2px_var(--v2p-color-main-300)] md:px-8 md:py-3 md:text-base md:font-bold"
      href="https://chromewebstore.google.com/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm"
      rel="noreferrer"
      target="_blank"
    >
      <span className="mr-2 flex w-5 items-center justify-center opacity-100 transition-all md:w-6 md:group-hover:mr-0 md:group-hover:w-0 md:group-hover:opacity-0">
        <ChromeIcon />
      </span>
      安装至 Chrome
      <svg
        className="ml-0 w-0 rotate-[-0.25turn] opacity-0 transition-all md:group-hover:ml-2 md:group-hover:w-6 md:group-hover:opacity-100"
        viewBox="0 0 24 24"
      >
        <path
          d="M6.293 8.793a1 1 0 0 1 1.32-.083l.094.083L12 13.085l4.293-4.292a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.32.083l-.094-.083-5-5a1 1 0 0 1 0-1.414z"
          fill="#1D354F"
        ></path>
      </svg>
    </a>
  )
}
