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

/**
 * 将页面中带有 data-lucide 属性的元素替换为 lucide SVG 图标。
 *
 * 此方法是为了方便统一设置页面中的所有图标，一般在元素有图标更新需要时，都需要及时调用此方法以及时设置图标。
 */
export function loadIcons() {
  setTimeout(() => {
    createIcons({
      attrs: {
        width: '100%',
        height: '100%',
      },
      icons: {
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
    })
  }, 0)
}
