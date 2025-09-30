import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ItemGroup } from '@/types'
import { useDBStore } from './dbStore'

export interface MetaType {
  categoryType: string
}

export const useCategoryStore = defineStore('categories', () => {
  const db = useDBStore()
  const categories = ref<ItemGroup<MetaType>[]>([])

  const getById = async (id: string): Promise<ItemGroup<MetaType> | null> => {
    const store = await db.getStore('categories', 'readonly')

    return new Promise<ItemGroup<MetaType> | null>((resolve, reject) => {
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result ?? null
        resolve(result)
      }

      request.onerror = () => reject(request.error)
    })
  }

  const fetchAll = async () => {
    const store = await db.getStore('categories', 'readonly')

    const request = store.getAll()
    return new Promise<ItemGroup<MetaType>[]>(async (resolve, reject) => {
      request.onsuccess = async () => {
        const data = request.result
        categories.value = data
        resolve(categories.value)
      }

      request.onerror = () => reject(request.error)
    })
  }

  const add = async (item: ItemGroup<MetaType>) => {
    try {
      const store = await db.getStore('categories', 'readwrite')

      await new Promise<void>((resolve, reject) => {
        const req = store.add(item)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      categories.value.push(item)
      return { success: true }
    } catch (err) {
      console.error('Add failed:', err)
      return { success: false, error: err }
    }
  }

  const update = async (id: string, updated: Partial<ItemGroup<MetaType>>) => {
    try {
      const store = await db.getStore('categories', 'readwrite')

      const existing = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(id)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      const data = { ...existing, ...updated }

      await new Promise<void>((resolve, reject) => {
        const req = store.put(data)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) categories.value[index] = data

      return { success: true }
    } catch (err) {
      console.error('Update failed:', err)
      return { success: false, error: err }
    }
  }

  const updateItem = async (
    parentId: string,
    itemId: string,
    updated: Partial<ItemGroup<MetaType>>,
  ) => {
    try {
      const store = await db.getStore('categories', 'readwrite')

      // Ambil parent dari DB
      const parent = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(parentId)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!parent) {
        throw new Error(`Parent with id ${parentId} not found`)
      }

      if (!parent.items) {
        throw new Error(`Parent ${parentId} has no items`)
      }

      // Cari index item yang mau diupdate
      const idx = parent.items.findIndex((it) => it.id === itemId)
      if (idx === -1) {
        throw new Error(
          `Item with id ${itemId} not found in parent ${parentId}`,
        )
      }

      // Gabungkan data lama dengan yang baru
      parent.items[idx] = { ...parent.items[idx], ...updated }

      // Simpan balik ke DB
      await new Promise<void>((resolve, reject) => {
        const req = store.put(parent)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      // Update juga di state categories
      const catIdx = categories.value.findIndex((c) => c.id === parentId)
      if (catIdx !== -1) {
        categories.value[catIdx] = parent
      }

      return { success: true, data: parent.items[idx] }
    } catch (err) {
      console.error('Update item failed:', err)
      return { success: false, error: err }
    }
  }

  const remove = async (id: string) => {
    try {
      const store = await db.getStore('categories', 'readwrite')

      await new Promise<void>((resolve, reject) => {
        const req = store.delete(id)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      categories.value = categories.value.filter((c) => c.id !== id)

      return { success: true }
    } catch (err) {
      console.error('Remove failed:', err)
      return { success: false, error: err }
    }
  }

  const removeItem = async (parentId: string, itemId: string) => {
    try {
      const store = await db.getStore('categories', 'readwrite')

      // Ambil parent dari DB
      const parent = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(parentId)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!parent) {
        throw new Error(`Parent with id ${parentId} not found`)
      }

      if (!parent.items) {
        throw new Error(`Parent ${parentId} has no items`)
      }

      // Filter item keluar
      const beforeLength = parent.items.length
      parent.items = parent.items.filter((it) => it.id !== itemId)

      if (parent.items.length === beforeLength) {
        throw new Error(
          `Item with id ${itemId} not found in parent ${parentId}`,
        )
      }

      // Simpan balik ke DB
      await new Promise<void>((resolve, reject) => {
        const req = store.put(parent)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      // Update juga di state categories
      const catIdx = categories.value.findIndex((c) => c.id === parentId)
      if (catIdx !== -1) {
        categories.value[catIdx] = parent
      }

      return { success: true }
    } catch (err) {
      console.error('Remove item failed:', err)
      return { success: false, error: err }
    }
  }

  return {
    categories,
    fetchAll,
    getById,
    add,
    update,
    updateItem,
    remove,
    removeItem,
  }
})
