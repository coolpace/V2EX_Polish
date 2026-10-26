import type { Icons } from 'lucide'
import {
  ArrowUpRightSquare,
  BookOpenCheck,
  ChevronDown,
  ChevronsUp,
  createIcons,
  EyeOff,
  Heart,
  House,
  MessageSquare,
  MessageSquarePlus,
  Moon,
  PackagePlus,
  Share2,
  Smile,
  Star,
  Sun,
} from 'lucide'

const iconAttribute = 'data-v2p-icon'

export type IconRoot = Element | Document | DocumentFragment

/** 将指定容器中的扩展图标占位符替换为 Lucide SVG。 */
export function renderIcons(icons: Icons, root: IconRoot = document) {
  createIcons({
    attrs: {
      width: '100%',
      height: '100%',
    },
    nameAttr: iconAttribute,
    icons,
    root,
  })

  // Lucide 会在生成的 SVG 上保留占位属性，移除后才不会在下次加载时重复替换。
  root.querySelectorAll(`svg[${iconAttribute}]`).forEach((icon) => {
    icon.removeAttribute(iconAttribute)
  })
}

export function loadIcons(root?: IconRoot) {
  renderIcons(
    {
      MessageSquarePlus,
      MessageSquare,
      BookOpenCheck,
      ChevronsUp,
      Heart,
      EyeOff,
      Sun,
      Moon,
      Smile,
      PackagePlus,
      Star,
      Share2,
      ChevronDown,
      ArrowUpRightSquare,
      House,
    },
    root,
  )
}
