import type { QueryStringDriverOptions } from './types.js'
import type { UrlManager } from './url-manager-interface.js'
import { QueryStringDriverError } from './errors.js'
import validator from 'validator'
import invariant from 'tiny-invariant'

export function createUrlManager(options: QueryStringDriverOptions): UrlManager {
  const { url } = options
  let internalUrl: URL | null = null

  const getUrl = (): URL => {
    if (url) {
      if (internalUrl) return internalUrl

      const origin = typeof window !== 'undefined' && window.location
        ? window.location.origin
        : 'http://localhost'

      try {
        if (validator.isURL(url)) {
          internalUrl = new URL(url)
        } else {
          internalUrl = new URL(url, origin)
        }
        invariant(internalUrl, 'Failed to create URL')
        return internalUrl
      } catch {
        throw new QueryStringDriverError(`Invalid URL: ${url}`)
      }
    }

    if (typeof window !== 'undefined') {
      return new URL(window.location.href)
    }

    throw new QueryStringDriverError('URL is required in non-browser environment')
  }

  const updateInternalUrl = (newUrl: URL): void => {
    if (url) {
      internalUrl = newUrl
    }
  }

  return { getUrl, updateInternalUrl }
}