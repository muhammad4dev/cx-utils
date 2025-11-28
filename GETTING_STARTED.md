# Getting Started with @cx-utils/core

## Prerequisites

- Node.js 16 or higher
- npm, yarn, or pnpm

## Installation

```bash
# Install dependencies
npm install

# or
yarn install

# or
pnpm install
```

## Development Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run performance tests
npm run test:perf

# Run benchmarks (compare vs clsx/classnames)
npm run bench

# Build the library
npm run build

# Type check
npm run typecheck

# Run all pre-publish checks
npm run prepublishOnly
```

## Build Output

After running `npm run build`, you'll find:

- `dist/index.mjs` - ESM build
- `dist/index.cjs` - CommonJS build
- `dist/index.d.ts` - TypeScript declarations
- `dist/index.d.mts` - ESM TypeScript declarations
- `dist/index.d.cts` - CJS TypeScript declarations

## Testing Locally in Another Project

```bash
# In this project directory
npm link

# In your test project
npm link @cx-utils/core
```

## Publishing to npm

```bash
# Login to npm (first time only)
npm login

# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish

# Or publish with a tag
npm publish --tag beta
```

## Quick Test

After installing dependencies, run:

```bash
npm test
```

You should see all tests passing with >95% coverage.

## Next Steps

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Run benchmarks: `npm run bench`
4. Build: `npm run build`
5. Test in a real project using `npm link`
6. Publish to npm when ready!

## Troubleshooting

### TypeScript Errors

Make sure you're using TypeScript 5.3 or higher:
```bash
npm install -D typescript@latest
```

### Test Failures

Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues

Clear the dist folder and rebuild:
```bash
rm -rf dist
npm run build
```
