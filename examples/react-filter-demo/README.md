# React Filter Demo

A comprehensive example demonstrating how to use `unstorage-driver-query-string` to store filter configurations in URL query parameters and enable easy sharing of filtered views.

## Features

- 🔍 **Search Filter**: Text search across product names, descriptions, and tags
- 🏷️ **Category Filter**: Dropdown selection for product categories
- 📅 **Date Range Filter**: Filter products by date added
- 💰 **Price Range Filter**: Numeric range inputs for price filtering
- 📤 **URL Sharing**: Share filter configurations via URL
- 🔗 **Persistent State**: Filters are stored in URL and persist across browser sessions
- 📱 **Responsive Design**: Works on desktop and mobile devices

## How It Works

This example uses `unstorage-driver-query-string` to:

1. **Store filter state in the URL**: Each filter value is automatically synced to the URL query parameters
2. **Load state from URL**: When the page loads, filters are restored from the URL
3. **Enable sharing**: Users can share URLs that contain their filter configurations
4. **Persist across sessions**: Filters remain active when users refresh or return to the page

## Demo

Try the following:

1. **Apply some filters** - notice how the URL updates automatically
2. **Copy the URL** and open it in a new tab - filters are restored
3. **Share the URL** with others - they'll see the same filtered results
4. **Use the share button** to copy or share the current filter configuration

## Code Structure

- `App.tsx` - Main application with storage initialization
- `components/SearchFilter.tsx` - Text search input
- `components/CategoryFilter.tsx` - Category dropdown
- `components/DateRangeFilter.tsx` - Date range inputs
- `components/PriceRangeFilter.tsx` - Price range inputs
- `components/ProductList.tsx` - Filtered product grid
- `components/ShareUrlButton.tsx` - URL sharing functionality
- `components/FilterSummary.tsx` - Active filters display

## Key Implementation Details

### Storage Configuration

```typescript
const storage = createStorage({
  driver: createQueryStringDriver({
    base: 'filters',           // Prefix for URL parameters
    updateHistory: true,       // Update browser history
    historyMethod: 'replaceState' // Don't create new history entries
  })
})
```

### Filter Management

```typescript
const updateFilter = async <K extends keyof Filters>(key: K, value: Filters[K]) => {
  const newFilters = { ...filters, [key]: value }
  setFilters(newFilters)
  
  // Save to storage (updates URL automatically)
  if (value === DEFAULT_FILTERS[key] || value === '') {
    await storage.removeItem(key as string)  // Remove default values
  } else {
    await storage.setItem(key as string, value)  // Save non-default values
  }
}
```

### URL Structure

The filters create a nested URL structure like:
```
/?filters[search]=headphones&filters[category]=electronics&filters[minPrice]=100
```

## Running the Example

```bash
# From the example directory
npm install
npm run dev
```

Then open http://localhost:5173 and try applying different filters!

## Learning Points

1. **Automatic URL Sync**: Changes to filters immediately update the URL
2. **Clean URLs**: Default values are removed from the URL to keep it clean  
3. **Type Safety**: Full TypeScript support for filter types
4. **Error Handling**: Graceful handling of URL parsing errors
5. **User Experience**: Loading states and clear visual feedback
6. **Sharing**: Easy URL sharing with native browser APIs

This example demonstrates the power of storing application state in URLs for better user experience and shareability.
