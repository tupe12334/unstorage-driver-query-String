import { Filter } from 'lucide-react'
import type { Filters } from '../App'

interface FilterSummaryProps {
  filters: Filters
}

export function FilterSummary({ filters }: FilterSummaryProps) {
  const activeFilters = []

  if (filters.search) {
    activeFilters.push(`Search: "${filters.search}"`)
  }
  
  if (filters.category) {
    const categoryNames: Record<string, string> = {
      electronics: 'Electronics',
      clothing: 'Clothing',
      books: 'Books',
      home: 'Home & Garden',
      sports: 'Sports & Outdoors',
      toys: 'Toys & Games'
    }
    activeFilters.push(`Category: ${categoryNames[filters.category] || filters.category}`)
  }
  
  if (filters.dateFrom || filters.dateTo) {
    const dateRange = []
    if (filters.dateFrom) dateRange.push(`from ${filters.dateFrom}`)
    if (filters.dateTo) dateRange.push(`to ${filters.dateTo}`)
    activeFilters.push(`Date: ${dateRange.join(' ')}`)
  }
  
  if (filters.minPrice !== 0 || filters.maxPrice !== 1000) {
    activeFilters.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`)
  }

  if (filters.tags && filters.tags.length > 0) {
    activeFilters.push(`Tags: ${filters.tags.join(', ')}`)
  }

  if (activeFilters.length === 0) {
    return (
      <div className="filter-summary">
        <div className="filter-summary-header">
          <Filter size={16} />
          <span>Active Filters</span>
        </div>
        <div className="no-filters">No filters applied</div>
      </div>
    )
  }

  return (
    <div className="filter-summary">
      <div className="filter-summary-header">
        <Filter size={16} />
        <span>Active Filters ({activeFilters.length})</span>
      </div>
      <div className="active-filters">
        {activeFilters.map((filter, index) => (
          <div key={index} className="active-filter">
            {filter}
          </div>
        ))}
      </div>
    </div>
  )
}