/**
 * 判断是否为简单 JS 对象（不包括 Array）。
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 深度合并需兼容任意对象类型；unknown 会因接口缺少索引签名而拒绝合法调用
type AnyRecord = Record<string, any>

/**
 * 深度合并两个对象。
 */
export function deepMerge<
  T extends AnyRecord = AnyRecord,
  U extends AnyRecord = AnyRecord,
>(target: T, source: U): T & U {
  const result: AnyRecord = {}

  for (const key in target) {
    const targetProp = target[key]
    const sourceProp = source[key]

    if (isPlainObject(targetProp) && isPlainObject(sourceProp)) {
      // 如果是对象，递归调用函数进行合并
      result[key] = deepMerge(targetProp, sourceProp)
    }
    else if (Reflect.has(source, key)) {
      // 如果 obj2 中也有这个属性，则进行覆盖
      result[key] = sourceProp
    }
    else {
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
