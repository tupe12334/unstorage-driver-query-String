import { useEffect, useState } from 'react'
import { createStorage } from 'unstorage'
import { createQueryStringDriver } from 'unstorage-driver-query-string'
import { SearchFilter } from './components/SearchFilter'
import { CategoryFilter } from './components/CategoryFilter'
import { DateRangeFilter } from './components/DateRangeFilter'
import { PriceRangeFilter } from './components/PriceRangeFilter'
import { ProductList } from './components/ProductList'
import { ShareUrlButton } from './components/ShareUrlButton'
import { FilterSummary } from './components/FilterSummary'
import './App.css'

// Initialize storage with the query string driver
const storage = createStorage({
  driver: createQueryStringDriver({
    base: 'filters',
    updateHistory: true,
    historyMethod: 'replaceState'
  })
})

export interface Filters {
  search: string
  category: string
  dateFrom: string
  dateTo: string
  minPrice: number
  maxPrice: number
  tags: string[]
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  minPrice: 0,
  maxPrice: 1000,
  tags: []
}

function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)

  // Load filters from URL on component mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const savedFilters: Partial<Filters> = {}
        
        // Load each filter from storage
        const keys = ['search', 'category', 'dateFrom', 'dateTo', 'minPrice', 'maxPrice', 'tags'] as const
        for (const key of keys) {
          const value = await storage.getItem(key as string)
          if (value !== null && value !== undefined && value !== '') {
            (savedFilters as any)[key] = value
          }
        }

        // Merge with defaults
        setFilters({ ...DEFAULT_FILTERS, ...savedFilters })
      } catch (error) {
        console.error('Error loading filters from URL:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFilters()
  }, [])

  // Update URL when filters change
  const updateFilter = async <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    try {
      // Save to storage (which updates the URL)
      if (value === DEFAULT_FILTERS[key] || value === '' || (Array.isArray(value) && value.length === 0)) {
        // Remove filter if it's the default value
        await storage.removeItem(key as string)
      } else {
        await storage.setItem(key as string, value)
      }
    } catch (error) {
      console.error('Error saving filter to URL:', error)
    }
  }

  const clearAllFilters = async () => {
    setFilters(DEFAULT_FILTERS)
    try {
      await storage.clear()
    } catch (error) {
      console.error('Error clearing filters:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Loading filters from URL...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛍️ Product Filter Demo</h1>
        <p>
          This demo shows how to use <code>unstorage-driver-query-string</code> to store
          filter configurations in the URL. Try changing filters and sharing the URL!
        </p>
        <div className="header-actions">
          <ShareUrlButton />
          <button onClick={clearAllFilters} className="clear-button">
            Clear All Filters
          </button>
        </div>
      </header>

      <div className="app-content">
        <aside className="filters-panel">
          <h2>Filters</h2>
          
          <SearchFilter 
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
          />
          
          <CategoryFilter 
            value={filters.category}
            onChange={(value) => updateFilter('category', value)}
          />
          
          <DateRangeFilter 
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(value) => updateFilter('dateFrom', value)}
            onDateToChange={(value) => updateFilter('dateTo', value)}
          />
          
          <PriceRangeFilter 
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={(value) => updateFilter('minPrice', value)}
            onMaxPriceChange={(value) => updateFilter('maxPrice', value)}
          />

          <FilterSummary filters={filters} />
        </aside>

        <main className="products-panel">
          <ProductList filters={filters} />
        </main>
      </div>
    </div>
  )
}

export default App
