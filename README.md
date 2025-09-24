# unstorage-driver-query-string

A query string driver for [unstorage](https://github.com/unjs/unstorage) that stores data directly in URL query parameters.

## Features

- 🔗 Store application state in URL query parameters
- 📤 Make state shareable via URLs
- 🏗️ Support for server-side rendering
- 📚 Browser history integration
- 🎯 Automatic serialization of different data types
- 🏷️ Configurable URL parameter prefix
- 📏 URL length limits with warnings

## Installation

```bash
npm install unstorage-driver-query-string
# or
pnpm add unstorage-driver-query-string
# or
yarn add unstorage-driver-query-string
```

## Usage

```javascript
import { createStorage } from 'unstorage'
import { createQueryStringDriver } from 'unstorage-driver-query-string'

const storage = createStorage({
  driver: createQueryStringDriver({
    base: 'app',
    updateHistory: true
  })
})

// Set values - URL becomes: https://example.com/?app_filter=active
await storage.setItem('filter', 'active')

// Get values
const filter = await storage.getItem('filter') // 'active'

// Works with different data types
await storage.setItem('count', 42)
await storage.setItem('enabled', true)
await storage.setItem('config', { theme: 'dark', lang: 'en' })
```

## Configuration

```typescript
interface QueryStringDriverOptions {
  url?: string                    // Custom URL (defaults to window.location)
  base?: string                   // Prefix for query parameters
  updateHistory?: boolean         // Update browser history (default: true)
  historyMethod?: 'pushState' | 'replaceState' // History method (default: 'pushState')
  maxUrlLength?: number           // Maximum URL length (default: 2000)
}
```

### Options

- **`url`**: Specify a custom URL for reading/writing parameters. Defaults to `window.location.href` in browser environments.
- **`base`**: Prefix for all query parameters to avoid conflicts (e.g., `"app"` → `"app_key"`).
- **`updateHistory`**: Whether to update browser history when values change.
- **`historyMethod`**: Use `"pushState"` (creates history entries) or `"replaceState"` (replaces current entry).
- **`maxUrlLength`**: Maximum allowed URL length. Logs warning if exceeded.

## Data Types

The driver automatically handles serialization for:

- **Strings**: Stored as-is
- **Numbers**: Auto-detected and parsed
- **Booleans**: `true`/`false` strings
- **Objects/Arrays**: JSON serialized
- **null/undefined**: Stored as empty string

## Limitations

- URL length restrictions (typically 2000-8000 characters depending on browser)
- Complex objects increase URL length significantly
- Not suitable for sensitive data (visible in URL)
- Requires browser APIs (`URLSearchParams`, `History API`)

## Browser Support

Modern browsers with support for:
- `URLSearchParams`
- `History API` (for history updates)

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm typecheck
```

## License

MIT