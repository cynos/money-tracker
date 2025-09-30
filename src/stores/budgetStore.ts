// budgetStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ItemGroup } from '@/types'
import { useDBStore } from './dbStore'

export interface MetaType {
  balance: number
  categories: string[]
  period: string
  cycle: string
  calculation?: {
    remaining: number
    percentage: number
    used: number
  }
}

export const useBudgetStore = defineStore('budgets', () => {
  const db = useDBStore()
  const budget = ref<ItemGroup<MetaType>[]>([])

  const getById = async (id: string): Promise<ItemGroup<MetaType> | null> => {
    const store = await db.getStore('budgets', 'readwrite')
    return new Promise<ItemGroup<MetaType> | null>((resolve, reject) => {
      const req = store.get(id)
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
    })
  }

  const fetchAll = async () => {
    const store = await db.getStore('budgets', 'readwrite')
    const req = store.getAll()
    return new Promise<ItemGroup<MetaType>[]>(async (resolve, reject) => {
      req.onsuccess = async () => {
        const data: ItemGroup<MetaType>[] = req.result ?? []
        budget.value = data
        resolve(budget.value)
      }
      req.onerror = () => reject(req.error)
    })
  }

  const add = async (item: ItemGroup<MetaType>) => {
    try {
      if (!item.meta?.categories?.length) {
        throw new Error('Category is empty')
      }
      if (item.meta?.balance <= 0) {
        throw new Error('Budget should have positive value')
      }
      const store = await db.getStore('budgets', 'readwrite')
      await new Promise<void>((resolve, reject) => {
        const req = store.add(item)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      budget.value.push(item)
      return { success: true }
    } catch (err) {
      console.error('Add budget failed:', err)
      return { success: false, error: err }
    }
  }

  const update = async (id: string, updated: Partial<ItemGroup<MetaType>>) => {
    try {
      if (!updated.meta?.categories?.length) {
        throw new Error('Category is empty')
      }
      if (updated.meta?.balance <= 0) {
        throw new Error('Budget should have positive value')
      }
      const store = await db.getStore('budgets', 'readwrite')
      const existing = await new Promise<ItemGroup<MetaType>>(
        (resolve, reject) => {
          const req = store.get(id)
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      if (!existing) {
        return { success: false, error: new Error('Budget not found') }
      }

      const data = { ...existing, ...updated }

      await new Promise<void>((resolve, reject) => {
        const req = store.put(data)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      const index = budget.value.findIndex((c) => c.id === id)
      if (index !== -1) budget.value[index] = data

      return { success: true }
    } catch (err) {
      console.error('Update budget failed:', err)
      return { success: false, error: err }
    }
  }

  const remove = async (id: string) => {
    const store = await db.getStore('budgets', 'readwrite')
    try {
      await new Promise<void>((resolve, reject) => {
        const req = store.delete(id)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      budget.value = budget.value.filter((c) => c.id !== id)
      return { success: true }
    } catch (err) {
      console.error('Remove budget failed:', err)
      return { success: false, error: err }
    }
  }

  function calculateBudgetUsage(
    budget: number,
    used: number,
  ): {
    remaining: number
    percentUsed: number
    used: number
  } {
    if (budget <= 0) {
      throw new Error('Budget should have positive value')
    }

    const remaining = budget - used
    const percentUsed = (used / budget) * 100

    return {
      remaining,
      percentUsed: parseFloat(percentUsed.toFixed(2)), // dibulatkan 2 angka desimal
      used,
    }
  }

  return {
    budget,
    fetchAll,
    getById,
    add,
    update,
    remove,
    calculateBudgetUsage,
  }
})
