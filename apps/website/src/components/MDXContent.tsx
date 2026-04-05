import { type ComponentType, useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'

// MDX 编译产物通过 Function 构造函数加载，这是 velite/contentlayer MDX 运行时的标准方式
interface MDXProps { components?: Record<string, ComponentType> }
interface MDXModule { default: ComponentType<MDXProps> }
type MDXFactory = (jsxRuntime: typeof runtime) => MDXModule

interface MDXContentProps {
  code: string
  components?: Record<string, ComponentType>
}

export function MDXContent({ code, components }: MDXContentProps) {
  // 用 useMemo 缓存组件实例，避免每次渲染都通过 new Function(code) 创建新组件类型
  // 仅当 code 变化时才重新生成，防止 React 因组件类型变化而卸载/重挂载子树
  const Component = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(code) as MDXFactory

    return fn({ ...runtime }).default
  }, [code])

  return <Component components={components} />
}
