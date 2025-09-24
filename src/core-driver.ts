import type { Driver } from 'unstorage'
import type { QueryStringDriverOptions } from './types.js'
import { createUrlManager } from './url-manager.js'
import { createDataManager } from './data-manager.js'
import { createStorageHandler } from './storage-handler.js'

export function createQueryStringDriver(options: QueryStringDriverOptions = {}): Driver {
  const urlManager = createUrlManager(options)
  const dataManager = createDataManager(urlManager)
  const storageHandler = createStorageHandler(dataManager, urlManager, options)

  return {
    name: 'query-string',
    options,
    ...storageHandler
  }
}