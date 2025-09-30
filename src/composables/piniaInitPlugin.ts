import type { PiniaPluginContext } from 'pinia'

interface InitializableStore {
  $init?: () => void
}

export function piniaInitPlugin({ store }: PiniaPluginContext) {
  const s = store as unknown as InitializableStore
  if (typeof s.$init === 'function') {
    s.$init()
  }
}
