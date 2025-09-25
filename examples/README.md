# Examples

This directory contains examples demonstrating how to use `unstorage-driver-query-string` in different scenarios.

## React Filter Demo

A comprehensive React application showcasing how to use the query string driver for storing and sharing filter configurations.

**Location**: `react-filter-demo/`

**Features**:
- Multiple filter types (search, category, date range, price range)
- URL-based state persistence
- Shareable URLs with filter configurations
- Responsive design
- TypeScript support

**Demo**: Navigate to the example and try:
1. Apply various filters
2. Copy the URL and open in a new tab - filters are restored
3. Share URLs with others to show the same filtered view
4. Use the "Clear All Filters" button to reset

**Key Concepts Demonstrated**:
- Setting up the query string driver with configuration options
- Loading state from URL on application startup
- Saving filter changes to URL automatically
- Handling different data types (strings, numbers, arrays, dates)
- Clean URL management (removing default values)
- Error handling and user feedback

## Running the Examples

Each example can be run independently:

```bash
# Navigate to an example directory
cd react-filter-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

## Adding New Examples

When adding new examples:

1. Create a new directory in `examples/`
2. Include a comprehensive README explaining the use case
3. Add proper TypeScript types and error handling
4. Demonstrate best practices for the library
5. Include comments explaining key implementation details

## Common Patterns

### Basic Setup

```typescript
import { createStorage } from 'unstorage'
import { createQueryStringDriver } from 'unstorage-driver-query-string'

const storage = createStorage({
  driver: createQueryStringDriver({
    base: 'app',           // Namespace for your parameters
    updateHistory: true,   // Update browser history
    historyMethod: 'replaceState' // Don't create new history entries
  })
})
```

### Loading State from URL

```typescript
// On application startup
useEffect(() => {
  const loadState = async () => {
    const savedValue = await storage.getItem('myKey')
    if (savedValue) {
      setMyState(savedValue)
    }
  }
  loadState()
}, [])
```

### Saving State to URL

```typescript
const updateState = async (newValue) => {
  setMyState(newValue)
  
  // Remove from URL if default value, otherwise save
  if (newValue === defaultValue) {
    await storage.removeItem('myKey')
  } else {
    await storage.setItem('myKey', newValue)
  }
}
```

### Sharing URLs

```typescript
const shareCurrentState = async () => {
  const url = window.location.href
  
  if (navigator.share) {
    await navigator.share({ url })
  } else {
    await navigator.clipboard.writeText(url)
  }
}
```