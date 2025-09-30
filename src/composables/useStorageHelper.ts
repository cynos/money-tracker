import { useLocalStorage } from '@vueuse/core'
import { computed, type Ref } from 'vue'

export function useLocalStorageBasic<T>(key: string, initialValue?: T) {
  const storageRef = useLocalStorage<T>(key, initialValue!, {
    deep: true,
    listenToStorageChanges: true,
  })

  const setItem = (value: T) => {
    storageRef.value = value
  }

  const getItem = () => storageRef.value

  return {
    storageRef,
    setItem,
    getItem,
  }
}

/**
 * Helper generic untuk localStorage yang mendukung custom parser & serializer
 * @param key string key penyimpanan
 * @param defaultValue nilai default
 * @param options parser & serializer
 */
export function useLocalStorageWithTransform<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer: (value: T) => string
    parser: (value: string) => T
  },
): Ref<T> {
  const stored = useLocalStorage<string>(key, options.serializer(defaultValue))

  const transformed = computed<T>({
    get: () => options.parser(stored.value),
    set: (val) => {
      stored.value = options.serializer(val)
    },
  })

  return transformed
}
