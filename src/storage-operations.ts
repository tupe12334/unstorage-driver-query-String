import type { DataManager } from './data-manager-interface.js'
import { QueryStringDriverError } from './errors.js'
import { get, set, has, omit, keys } from 'lodash'

export function createStorageOperations(
  dataManager: DataManager,
  updateUrl: (data: Record<string, unknown>) => void,
  base: string
) {
  return {
    hasItem: (key: string): boolean => {
      try {
        return has(dataManager.getCurrentData(base), key)
      } catch {
        return false
      }
    },

    getItem: (key: string): unknown => {
      try {
        const data = dataManager.getCurrentData(base)
        return has(data, key) ? get(data, key, null) : null
      } catch {
        return null
      }
    },

    async getItemRaw(key: string): Promise<string | null> {
      const value = this.getItem(key)
      return value === null ? null : String(value)
    },

    async setItem(key: string, value: unknown): Promise<void> {
      try {
        const data = dataManager.getCurrentData(base)
        const newData = value === null || value === undefined
          ? omit(data, key)
          : set({ ...data }, key, value)
        updateUrl(newData)
      } catch (error) {
        throw new QueryStringDriverError(`Failed to set item: ${String(error)}`, error)
      }
    },

    async setItemRaw(key: string, value: string): Promise<void> {
      return this.setItem(key, value)
    },

    async removeItem(key: string): Promise<void> {
      try {
        const data = dataManager.getCurrentData(base)
        updateUrl(omit(data, key))
      } catch (error) {
        throw new QueryStringDriverError(`Failed to remove item: ${String(error)}`, error)
      }
    },

    async getKeys(): Promise<string[]> {
      try {
        return keys(dataManager.getCurrentData(base))
      } catch {
        return []
      }
    },

    async clear(): Promise<void> {
      try {
        updateUrl({})
      } catch (error) {
        throw new QueryStringDriverError(`Failed to clear storage: ${String(error)}`, error)
      }
    }
  }
}