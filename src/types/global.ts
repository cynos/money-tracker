import type { Transaction } from '@/stores/transactionStore'

export interface ItemGroup<TMeta = unknown> {
  id: string
  name: string
  subName?: string
  icon?: string
  items?: ItemGroup<TMeta>[]
  meta?: TMeta
  createdAt?: Date
  updatedAt?: Date
}

export interface LocalData {
  selectedDate?: string
  selectedTransactionItem?: Transaction
}

export const LocalDataKeyStorage = 'local-data'

export interface ResponseStatus {
  success: boolean
  error?: unknown
  data?: unknown
}
