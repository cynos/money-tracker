export const DB_NAME = 'money_tracker'
export const DB_VERSION = 1

const storeList = ['categories', 'transactions', 'budgets', 'assets']

let db: IDBDatabase | null = null

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db)

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      for (const storeName of storeList) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
      }
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
  })
}
