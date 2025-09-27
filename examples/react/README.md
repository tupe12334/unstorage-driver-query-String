# React Example for unstorage-driver-query-string

This example demonstrates how to use `unstorage-driver-query-string` with React to persist application state in URL query parameters.

## Features Demonstrated

- ✅ Simple data types (strings, numbers, booleans)
- ✅ Complex nested objects and arrays
- ✅ Real-time URL updates
- ✅ State persistence across page reloads
- ✅ Browser history integration
- ✅ TypeScript support

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## What You'll See

The example includes several interactive demos:

### Simple Values
- Text input (filter)
- Number input (count)
- Checkbox (enabled)
- Select dropdown (theme)

### Nested Objects
- User profile with nested preferences
- Demonstrates deep object storage in query parameters

### URL Structure
All values are stored under the `demo` prefix in the URL:
```
?demo[filter]=active&demo[count]=5&demo[enabled]=true&demo[user.profile][name]=John
```

## Try It Out

1. **Fill in some values** - Watch the URL update in real-time
2. **Copy the URL** and open it in a new tab - State is restored automatically
3. **Reload the page** - All values persist
4. **Use browser back/forward** - History integration works seamlessly

## Key Code Snippets

### Setup Storage
```typescript
const storage = createStorage({
  driver: createQueryStringDriver({
    base: 'demo',              // URL prefix
    updateHistory: true,       // Update browser history
    historyMethod: 'replaceState' // Don't create new history entries
  })
})
```

### Store Simple Values
```typescript
await storage.setItem('filter', 'active')
await storage.setItem('count', 42)
await storage.setItem('enabled', true)
```

### Store Complex Objects
```typescript
await storage.setItem('user.profile', {
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
})
```

### Read Values
```typescript
const filter = await storage.getItem('filter') // 'active'
const count = await storage.getItem('count')   // 42
const profile = await storage.getItem('user.profile') // { name: 'John', ... }
```

## Configuration Options

The driver supports various configuration options:

```typescript
createQueryStringDriver({
  base: 'app',                    // Prefix for query parameters
  updateHistory: true,            // Update browser history
  historyMethod: 'pushState',     // 'pushState' or 'replaceState'
  maxUrlLength: 2000,            // Maximum URL length warning
  url: 'https://example.com'     // Custom URL (optional)
})
```

## Notes

- The example uses TypeScript for better development experience
- All state changes trigger URL updates automatically
- Complex objects are serialized using the robust `qs` library
- URL length is monitored to prevent browser limitations
- Works with React's development and production builds