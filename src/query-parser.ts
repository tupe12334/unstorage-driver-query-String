import qs from 'qs'

export function parseQueryString(queryString: string): Record<string, unknown> {
  return qs.parse(queryString, {
    depth: 10,
    parseArrays: true
  })
}