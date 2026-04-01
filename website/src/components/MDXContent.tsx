import type { ComponentType } from 'react'
import * as runtime from 'react/jsx-runtime'

// MDX 编译产物通过 Function 构造函数加载，这是 velite/contentlayer MDX 运行时的标准方式
interface MDXProps { components?: Record<string, ComponentType> }
interface MDXModule { default: ComponentType<MDXProps> }
type MDXFactory = (jsxRuntime: typeof runtime) => MDXModule

const useMDXComponent = (code: string): ComponentType<MDXProps> => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code) as MDXFactory

  return fn({ ...runtime }).default
}

interface MDXContentProps {
  code: string
  components?: Record<string, ComponentType>
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return <Component components={components} />
}
