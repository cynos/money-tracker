// assetStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ItemGroup } from '@/types'
import { useDBStore } from './dbStore'

export interface MetaType {
  balance: number
  restBalance: number
}

export const useAssetStore = defineStore('assets', () => {
  const db = useDBStore()
  const assets = ref<ItemGroup<MetaType>[]>([])

  /** Get asset by id */
  const getById = async (id: string): Promise<ItemGroup<MetaType> | null> => {
    const store = await db.getStore('assets', 'readonly')

    return new Promise<ItemGroup<MetaType> | null>((resolve, reject) => {
      const req = store.get(id)
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
    })
  }

  /** Fetch all assets, inject default if empty */
  const fetchAll = async () => {
    const store = await db.getStore('assets', 'readonly')
    const req = store.getAll()

    return new Promise<ItemGroup<MetaType>[]>(async (resolve, reject) => {
      req.onsuccess = async () => {
        const data: ItemGroup<MetaType>[] = req.result ?? []
        assets.value = data
        resolve(assets.value)
      }

      req.onerror = () => reject(req.error)
    })
  }

  /** Add new asset */
  const add = async (item: ItemGroup<MetaType>) => {
    try {
      const store = await db.getStore('assets', 'readwrite')
      await new Promise<void>((resolve, reject) => {
        if (item?.meta?.balance) {
          item.meta.balance = parseInt(item.meta.balance.toString())
        }
        const req = store.add(item)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      assets.value.push(item)
      return { success: true }
    } catch (err) {
      console.error('Add asset failed:', err)
      return { success: false, error: err }
    }
  }

  /** Update asset */
  const update = async (id: string, updated: Partial<ItemGroup<MetaType>>) => {
    try {
      const store = await db.getStore('assets', 'readwrite')

      const existing = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(id)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!existing) {
        return { success: false, error: new Error('Asset not found') }
      }

      const data = { ...existing, ...updated }

      await new Promise<void>((resolve, reject) => {
        const req = store.put(data)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      const index = assets.value.findIndex((c) => c.id === id)
      if (index !== -1) assets.value[index] = data

      return { success: true }
    } catch (err) {
      console.error('Update asset failed:', err)
      return { success: false, error: err }
    }
  }

  /** Update sub-item in asset (if using items like category) */
  const updateItem = async (
    parentId: string,
    itemId: string,
    updated: Partial<ItemGroup<MetaType>>,
  ) => {
    try {
      const store = await db.getStore('assets', 'readwrite')
      const parent = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(parentId)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!parent || !parent.items) {
        throw new Error(`Asset ${parentId} has no items`)
      }

      const idx = parent.items.findIndex((it) => it.id === itemId)
      if (idx === -1) {
        throw new Error(`Item ${itemId} not found in asset ${parentId}`)
      }

      parent.items[idx] = { ...parent.items[idx], ...updated }

      await new Promise<void>((resolve, reject) => {
        const req = store.put(parent)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      const assetIdx = assets.value.findIndex((c) => c.id === parentId)
      if (assetIdx !== -1) assets.value[assetIdx] = parent

      return { success: true, data: parent.items[idx] }
    } catch (err) {
      console.error('Update asset item failed:', err)
      return { success: false, error: err }
    }
  }

  /** Remove asset */
  const remove = async (id: string) => {
    try {
      const store = await db.getStore('assets', 'readwrite')
      await new Promise<void>((resolve, reject) => {
        const req = store.delete(id)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      assets.value = assets.value.filter((c) => c.id !== id)
      return { success: true }
    } catch (err) {
      console.error('Remove asset failed:', err)
      return { success: false, error: err }
    }
  }

  /** Remove sub-item in asset */
  const removeItem = async (parentId: string, itemId: string) => {
    try {
      const store = await db.getStore('assets', 'readwrite')
      const parent = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(parentId)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!parent || !parent.items) {
        throw new Error(`Asset ${parentId} has no items`)
      }

      const beforeLength = parent.items.length
      parent.items = parent.items.filter((it) => it.id !== itemId)

      if (parent.items.length === beforeLength) {
        throw new Error(`Item ${itemId} not found in asset ${parentId}`)
      }

      await new Promise<void>((resolve, reject) => {
        const req = store.put(parent)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      const idx = assets.value.findIndex((c) => c.id === parentId)
      if (idx !== -1) assets.value[idx] = parent

      return { success: true }
    } catch (err) {
      console.error('Remove asset item failed:', err)
      return { success: false, error: err }
    }
  }

  return {
    assets,
    fetchAll,
    getById,
    add,
    update,
    updateItem,
    remove,
    removeItem,
  }
})
