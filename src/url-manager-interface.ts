export interface UrlManager {
  getUrl: () => URL
  updateInternalUrl: (newUrl: URL) => void
}