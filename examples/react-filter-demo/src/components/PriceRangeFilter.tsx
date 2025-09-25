import { DollarSign } from 'lucide-react'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  onMinPriceChange: (value: number) => void
  onMaxPriceChange: (value: number) => void
}

export function PriceRangeFilter({ 
  minPrice, 
  maxPrice, 
  onMinPriceChange, 
  onMaxPriceChange 
}: PriceRangeFilterProps) {
  return (
    <div className="filter-group">
      <label className="filter-label">
        <DollarSign size={16} />
        Price Range
      </label>
      <div className="price-range-inputs">
        <div className="price-input-group">
          <label htmlFor="min-price" className="price-label">Min</label>
          <input
            id="min-price"
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(Number(e.target.value))}
            className="filter-input price-input"
            min="0"
            max={maxPrice}
          />
        </div>
        <div className="price-input-group">
          <label htmlFor="max-price" className="price-label">Max</label>
          <input
            id="max-price"
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="filter-input price-input"
            min={minPrice}
          />
        </div>
      </div>
      <div className="price-range-display">
        ${minPrice} - ${maxPrice}
      </div>
      {(minPrice !== 0 || maxPrice !== 1000) && (
        <button 
          onClick={() => {
            onMinPriceChange(0)
            onMaxPriceChange(1000)
          }}
          className="clear-filter-btn"
        >
          Reset price range
        </button>
      )}
    </div>
  )
}