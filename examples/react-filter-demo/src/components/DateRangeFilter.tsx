import { Calendar } from 'lucide-react'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}

export function DateRangeFilter({ 
  dateFrom, 
  dateTo, 
  onDateFromChange, 
  onDateToChange 
}: DateRangeFilterProps) {
  return (
    <div className="filter-group">
      <label className="filter-label">
        <Calendar size={16} />
        Date Range
      </label>
      <div className="date-range-inputs">
        <div className="date-input-group">
          <label htmlFor="date-from" className="date-label">From</label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="filter-input date-input"
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="date-to" className="date-label">To</label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="filter-input date-input"
            min={dateFrom}
          />
        </div>
      </div>
      {(dateFrom || dateTo) && (
        <button 
          onClick={() => {
            onDateFromChange('')
            onDateToChange('')
          }}
          className="clear-filter-btn"
        >
          Clear dates
        </button>
      )}
    </div>
  )
}