import { defineStore } from 'pinia'
import { ref } from 'vue'
import { openDB } from '@/db/indexDB'

export const useDBStore = defineStore('db', () => {
  const isReady = ref(false)
  const dbInstance = ref<IDBDatabase | null>(null)

  async function initDB() {
    if (isReady.value) return
    try {
      const db = await openDB()
      dbInstance.value = db
      isReady.value = true
    } catch (err) {
      console.error('Failed to open DB', err)
    }
  }

  async function getStore(storeName: string, mode: IDBTransactionMode) {
    const tx = dbInstance.value?.transaction(storeName, mode) as IDBTransaction
    return tx.objectStore(storeName)
  }

  return {
    dbInstance,
    isReady,
    initDB,
    getStore,
  }
})
