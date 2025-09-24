import type { QueryStringDriverOptions } from './types.js'
import type { UrlManager } from './url-manager-interface.js'
import type { DataManager } from './data-manager-interface.js'
import { createUrlUpdater } from './url-updater.js'
import { createStorageOperations } from './storage-operations.js'

export function createStorageHandler(
  dataManager: DataManager,
  urlManager: UrlManager,
  options: QueryStringDriverOptions
) {
  const { base = '' } = options
  const updateUrl = createUrlUpdater(urlManager, options)
  const operations = createStorageOperations(dataManager, updateUrl, base)

  return {
    hasItem: operations.hasItem,
    getItem: operations.getItem,
    getItemRaw: operations.getItemRaw,
    setItem: operations.setItem,
    removeItem: operations.removeItem,
    getKeys: operations.getKeys,
    clear: operations.clear,
    dispose: (): Promise<void> => Promise.resolve()
  }
}