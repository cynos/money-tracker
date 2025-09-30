import { useLocalStorageBasic } from '@/composables/useStorageHelper'
import { LocalDataKeyStorage, type LocalData } from '@/types'

const {
  storageRef: localData,
  setItem: setLocalData,
  getItem: getLocalData,
} = useLocalStorageBasic<LocalData>(LocalDataKeyStorage, {})

export { localData, setLocalData, getLocalData }
