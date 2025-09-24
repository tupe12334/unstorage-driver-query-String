# Contributing

Thank you for your interest in contributing to unstorage-driver-query-string!

## Development Setup

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

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Run `pnpm lint` before committing
- Ensure all tests pass with `pnpm test`
- Add tests for new features

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the full test suite
6. Submit a pull request

## Questions?

Feel free to open an issue for questions or discussions.