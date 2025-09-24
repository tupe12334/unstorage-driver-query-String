export interface DataManager {
  getCurrentData: (base?: string) => Record<string, unknown>
}