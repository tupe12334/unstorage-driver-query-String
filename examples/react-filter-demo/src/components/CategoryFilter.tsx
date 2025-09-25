import { Tag } from 'lucide-react'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Games' }
]

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="filter-group">
      <label htmlFor="category-select" className="filter-label">
        <Tag size={16} />
        Category
      </label>
      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        {CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}