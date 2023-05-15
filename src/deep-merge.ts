/**
 * 判断是否为简单 JS 对象（不包括 Array）。
 */
function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 深度合并两个对象。
 */
export function deepMerge<
  T extends Record<string, any> = Record<string, any>,
  U extends Record<string, any> = Record<string, any>
>(target: T, source: U): T & U {
  const result = {} as Record<string, any>

  for (const key in target) {
    const targetProp = target[key]
    const sourceProp = source[key]

    if (isObject(targetProp) && isObject(sourceProp)) {
      // 如果是对象，递归调用函数进行合并
      result[key] = deepMerge(targetProp, sourceProp)
    } else if (Reflect.has(source, key)) {
      // 如果 obj2 中也有这个属性，则进行覆盖
      result[key] = sourceProp
    } else {
      // 否则直接拷贝 obj1 中的属性
      result[key] = targetProp
    }
  }

  // 将 obj2 中剩余的属性拷贝到结果对象中
  for (const key in source) {
    if (!Reflect.has(target, key)) {
      result[key] = source[key]
    }
  }

  return result as T & U
}
