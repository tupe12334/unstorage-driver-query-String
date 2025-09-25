import { Search } from 'lucide-react'

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
}

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <div className="filter-group">
      <label htmlFor="search-input" className="filter-label">
        <Search size={16} />
        Search Products
      </label>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for products..."
        className="filter-input"
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="clear-filter-btn"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}