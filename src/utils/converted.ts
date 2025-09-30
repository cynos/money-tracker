/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProxy, toRaw } from 'vue'

export function deepToRaw<T>(value: T, asPlain: boolean = false): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepToRaw(item, asPlain)) as any
  } else if (value instanceof Date) {
    return (asPlain ? value.toISOString() : new Date(value.getTime())) as any
  } else if (value instanceof Map) {
    if (asPlain) {
      const obj: any = {}
      for (const [k, v] of value.entries()) {
        obj[k as any] = deepToRaw(v, asPlain)
      }
      return obj
    } else {
      const cloned = new Map()
      for (const [k, v] of value.entries()) {
        cloned.set(deepToRaw(k, asPlain), deepToRaw(v, asPlain))
      }
      return cloned as any
    }
  } else if (value instanceof Set) {
    if (asPlain) {
      return Array.from(value).map((v) => deepToRaw(v, asPlain)) as any
    } else {
      const cloned = new Set()
      for (const v of value.values()) {
        cloned.add(deepToRaw(v, asPlain))
      }
      return cloned as any
    }
  } else if (value !== null && typeof value === 'object') {
    const raw = isProxy(value) ? toRaw(value) : value
    const result: any = {}
    for (const key in raw) {
      result[key] = deepToRaw((raw as any)[key], asPlain)
    }
    return result
  }

  return value
}

export function toRecord<T extends object>(
  obj: T,
): Record<keyof T, T[keyof T]> {
  return obj as Record<keyof T, T[keyof T]>
}
