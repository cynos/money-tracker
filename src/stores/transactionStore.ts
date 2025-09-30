import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type ItemGroup } from '@/types'
import { useDBStore } from './dbStore'

export const transactionType = ['Income', 'Outcome'] as const
export type TransactionType = (typeof transactionType)[number]

export interface Transaction {
  id?: string
  total: string
  type: TransactionType
  category: ItemGroup
  asset: ItemGroup
  notes: string
  detail?: string
  time: Date
}

export const useTransactionStore = defineStore('transaksi', () => {
  const db = useDBStore()
  const transactions = ref<Transaction[]>([])

  const fetchAll = async () => {
    const store = await db.getStore('transactions', 'readonly')
    const request = store.getAll()
    return new Promise<Transaction[]>((resolve, reject) => {
      request.onsuccess = () => {
        transactions.value = request.result
        resolve(request.result)
      }
      request.onerror = () => reject(request.error)
    })
  }

  const add = async (form: Transaction) => {
    const store = await db.getStore('transactions', 'readwrite')
    const data = { ...form, id: crypto.randomUUID() }
    store.add(data)
    transactions.value.push(data)
  }

  const update = async (id: string, updated: Partial<Transaction>) => {
    const store = await db.getStore('transactions', 'readwrite')
    const existing = await new Promise<Transaction>((resolve, reject) => {
      const req = store.get(id)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    const data = { ...existing, ...updated }
    store.put(data)
    const index = transactions.value.findIndex((t) => t.id === id)
    if (index !== -1) transactions.value[index] = data
  }

  const remove = async (id: string) => {
    const store = await db.getStore('transactions', 'readwrite')
    store.delete(id)
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  return { transactions, fetchAll, add, update, remove }
})
