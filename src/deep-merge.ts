function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null
}

export function deepMerge<
  T extends Record<string, any> = Record<string, any>,
  U extends Record<string, any> = Record<string, any>
>(obj1: T, obj2: U): T & U {
  const result = {} as Record<string, any>

  for (const key in obj1) {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      // 如果是对象，递归调用函数进行合并
      result[key] = deepMerge(obj1[key], obj2[key])
    } else if (Reflect.has(obj2, key)) {
      // 如果 obj2 中也有这个属性，则进行覆盖
      result[key] = obj2[key]
    } else {
      // 否则直接拷贝 obj1 中的属性
      result[key] = obj1[key]
    }
  }

  // 将 obj2 中剩余的属性拷贝到结果对象中
  for (const key in obj2) {
    if (!Reflect.has(obj1, key)) {
      result[key] = obj2[key]
    }
  }

  return result as T & U
}
