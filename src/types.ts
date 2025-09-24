export interface QueryStringDriverOptions {
  url?: string
  base?: string
  updateHistory?: boolean
  historyMethod?: 'pushState' | 'replaceState'
  maxUrlLength?: number
}