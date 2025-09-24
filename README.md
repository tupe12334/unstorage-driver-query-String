# unstorage-driver-query-string

A query string driver for [unstorage](https://github.com/unjs/unstorage) that stores data directly in URL query parameters using the robust [qs](https://github.com/ljharb/qs) library for parsing and stringifying.

## Features

- 🔗 Store application state in URL query parameters
- 📤 Make state shareable via URLs
- 🏗️ Support for server-side rendering
- 📚 Browser history integration with [history](https://github.com/ReactTraining/history) library
- 🎯 Robust query string parsing using [qs](https://github.com/ljharb/qs) library
- 🏷️ Configurable URL parameter prefix with nested object support
- 📏 URL length limits with warnings
- ✅ Full TypeScript support with strict typing

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

// Set values - URL becomes: https://example.com/?app[filter]=active
await storage.setItem('filter', 'active')

// Get values
const filter = await storage.getItem('filter') // 'active'

// Works with different data types and nested objects
await storage.setItem('count', 42)
await storage.setItem('enabled', true)
await storage.setItem('config', { theme: 'dark', lang: 'en' })

// Complex nested data structures are supported
await storage.setItem('user.profile', { name: 'John', settings: { notifications: true } })
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
- **`base`**: Prefix for all query parameters to avoid conflicts. Creates nested structure (e.g., `"app"` → `"app[key]"`).
- **`updateHistory`**: Whether to update browser history when values change using the history library.
- **`historyMethod`**: Use `"pushState"` (creates history entries) or `"replaceState"` (replaces current entry).
- **`maxUrlLength`**: Maximum allowed URL length. Logs warning if exceeded.

## Data Types

The driver uses the [qs](https://github.com/ljharb/qs) library for robust serialization and supports:

- **Strings**: Stored as-is
- **Numbers**: Auto-detected and parsed
- **Booleans**: `true`/`false` values
- **Objects/Arrays**: Nested query string structure (e.g., `config[theme]=dark&config[lang]=en`)
- **Nested Objects**: Deep nesting support (e.g., `user[profile][name]=John`)
- **null/undefined**: Proper handling of empty values

## Limitations

- URL length restrictions (typically 2000-8000 characters depending on browser)
- Complex nested objects increase URL length significantly
- Not suitable for sensitive data (visible in URL)
- Requires browser APIs (`URL`, `History API` via history library)

## Browser Support

Modern browsers with support for:
- `URL` constructor
- `History API` (for browser history updates)

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

# Lint code
pnpm lint

# Release (using release-it)
pnpm release
```

## CI/CD

This project uses GitHub Actions for continuous integration and automated releases:

- **CI**: Runs tests, linting, and builds on Node.js 18, 20, 22
- **CD**: Automated releases to npm using [release-it](https://github.com/release-it/release-it)
- **Publish**: Automatically publishes to npm on main branch pushes

## Architecture

Built with modern development practices:

- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Strict linting with [eslint-config-agent](https://github.com/vercel/style-guide/tree/canary/eslint)
- **Modular Design**: Clean separation of concerns with single-export modules
- **Library Integration**: Uses established libraries (lodash, qs, history, validator, tiny-invariant)
- **Driver Interface**: Fully compatible with unstorage's native Driver interface

## License

MIT
