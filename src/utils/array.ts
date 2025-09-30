import type { ItemGroup } from '@/types'

export function flattenItemGroup<TMeta>(
  list: ItemGroup<TMeta>[],
): ItemGroup<TMeta>[] {
  return list.flatMap((g) => [g, ...(g.items ? flattenItemGroup(g.items) : [])])
}

/**
 * Remove duplicate items from array of objects (generic)
 * @param array - Array of items
 * @param comparator - Function to extract unique key or do comparison
 */
export function uniqueBy<T>(
  array: T[],
  comparator: (item: T) => string | number,
): T[] {
  const seen = new Set<string | number>()
  return array.filter((item) => {
    const key = comparator(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
