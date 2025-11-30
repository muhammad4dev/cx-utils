# @cx-utils/core

> **The class name utility that does what `clsx` can't.**  
> Production-ready, TypeScript-first, with built-in Tailwind merge and variant composition.

[![npm version](https://img.shields.io/npm/v/@cx-utils/core.svg)](https://www.npmjs.com/package/@cx-utils/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

---

## 🤔 Why Another Class Name Library?

You've been using `clsx`, `classnames`, or `classcat` for years. They're great! But here's what they **can't** do:

```tsx
// ❌ With clsx - you need TWO libraries
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const className = twMerge(clsx("px-4 py-2", "px-6")); // 'py-2 px-6'

// ✅ With @cx-utils/core - ONE library, built-in
import { mergeCx } from "@cx-utils/core";

const className = mergeCx("px-4 py-2", "px-6"); // 'py-2 px-6'
```

**Plus**, you get type-safe variant composition (like CVA) **included**:

```tsx
// ❌ With clsx - need class-variance-authority too
import clsx from "clsx";
import { cva } from "class-variance-authority";

// ✅ With @cx-utils/core - built-in!
import { composeClasses } from "@cx-utils/core";

const button = composeClasses({
  base: "px-4 py-2 rounded",
  variants: {
    color: { primary: "bg-blue-500", secondary: "bg-gray-500" },
    size: { sm: "text-sm", lg: "text-lg" },
  },
});
```

---

## ✨ Features That Set Us Apart

### 🎯 **Three Tools in One**

- **`cx()`** - Drop-in replacement for `clsx`/`classnames`/`classcat`
- **`mergeCx()`** - Built-in Tailwind CSS conflict resolution (no `tailwind-merge` needed!)
- **`composeClasses()`** - Type-safe variants (no `class-variance-authority` needed!)

### 💪 **Superior TypeScript Support**

- **Zero `any` types** - Strong generics throughout
- **Better autocomplete** - Your IDE will thank you
- **Stricter type safety** - Catch errors at compile time

### 🚀 **Modern & Future-Proof**

- **Tailwind v3 & v4 ready** - Supports both versions out of the box
- **Tree-shakable** - Only bundle what you use
- **ESM + CJS + Browser** - Works everywhere

### ⚡ **Performance**

- **As fast as clsx** - Optimized iterative implementation
- **Smaller bundle** - One library instead of three
- **Zero dependencies** - No bloat

---

## 📊 The Comparison

| Feature                 | @cx-utils/core  | clsx                     | classnames | classcat |
| ----------------------- | --------------- | ------------------------ | ---------- | -------- |
| **Basic class merging** | ✅              | ✅                       | ✅         | ✅       |
| **TypeScript generics** | ✅ **Strong**   | ⚠️ Basic                 | ❌         | ⚠️ Basic |
| **Tailwind merge**      | ✅ **Built-in** | ❌ Need `tailwind-merge` | ❌         | ❌       |
| **Variant composition** | ✅ **Built-in** | ❌ Need CVA              | ❌         | ❌       |
| **Tree-shakable**       | ✅              | ✅                       | ⚠️         | ✅       |
| **Bundle size**         | 🟢 **~3KB**     | 🟢 ~1KB                  | 🟡 ~2KB    | 🟢 ~1KB  |
| **Dependencies**        | ✅ **Zero**     | ✅ Zero                  | ✅ Zero    | ✅ Zero  |
| **Tailwind v4 ready**   | ✅              | ❌                       | ❌         | ❌       |
| **Active maintenance**  | ✅ **2025**     | ✅ 2024                  | ⚠️ 2021    | ⚠️ 2020  |

### 💡 **The Real Comparison**

**Using clsx + tailwind-merge + CVA:**

```json
{
  "dependencies": {
    "clsx": "^2.0.0", // 1KB
    "tailwind-merge": "^2.0.0", // 15KB
    "class-variance-authority": "^0.7.0" // 5KB
  }
}
// Total: ~21KB + 3 dependencies
```

**Using @cx-utils/core:**

```json
{
  "dependencies": {
    "@cx-utils/core": "^1.0.0" // 3KB
  }
}
// Total: ~3KB + 0 dependencies ✨
```

---

## 🎯 When Should You Switch?

### ✅ **Switch if you:**

- Use Tailwind CSS (especially v4)
- Need `tailwind-merge` functionality
- Want type-safe variant composition
- Care about bundle size
- Use TypeScript
- Want modern, actively maintained code

### 🤷 **Stick with clsx if you:**

- Only need basic class merging
- Don't use Tailwind CSS
- Already have a working setup and don't want to change
- Need the absolute smallest bundle (1KB vs 3KB)

---

## 🚀 Quick Start

## 📦 Installation

```bash
npm install @cx-utils/core
```

```bash
yarn add @cx-utils/core
```

```bash
pnpm add @cx-utils/core
```

## 🚀 Quick Start

```typescript
import { cx, mergeCx, composeClasses } from "@cx-utils/core";

// Basic usage
cx("foo", "bar"); // 'foo bar'
cx("foo", false, "bar"); // 'foo bar'
cx({ foo: true, bar: false }); // 'foo'
cx(["foo", "bar"], "baz"); // 'foo bar baz'

// Tailwind merge
mergeCx("px-4 py-2", "px-6"); // 'py-2 px-6'

// Variant composition
const button = composeClasses({
  base: "px-4 py-2 rounded",
  variants: {
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-500 text-white",
    },
  },
});

button({ color: "primary" }); // 'px-4 py-2 rounded bg-blue-500 text-white'
```

## 📖 API Reference

### `cx(...inputs: ClassValue[]): string`

Combines class names into a single string. Accepts strings, numbers, arrays, objects, and nested structures.

**Filters out falsy values:** `false`, `null`, `undefined`, `0`, `""`

```typescript
// Strings
cx("foo", "bar", "baz");
// → 'foo bar baz'

// Objects (conditional classes)
cx({ foo: true, bar: false, baz: true });
// → 'foo baz'

// Arrays
cx(["foo", "bar"], "baz");
// → 'foo bar baz'

// Nested arrays
cx("base", ["foo", { bar: true }], [["nested"]]);
// → 'base foo bar nested'

// Mixed inputs
cx("btn", { active: isActive, disabled: isDisabled }, ["rounded", "shadow"]);
// → 'btn active rounded shadow' (if isActive=true, isDisabled=false)
```

### `mergeCx(...inputs: ClassValue[]): string`

Combines class names with Tailwind CSS conflict resolution. Later classes override earlier conflicting classes.

```typescript
// Padding conflicts
mergeCx("px-4 py-2", "px-6");
// → 'py-2 px-6'

// Text size conflicts
mergeCx("text-sm text-blue-500", "text-lg");
// → 'text-blue-500 text-lg'

// Background conflicts
mergeCx("bg-red-500", "bg-blue-500");
// → 'bg-blue-500'

// Responsive variants
mergeCx("px-4 md:px-6", "lg:px-8");
// → 'px-4 md:px-6 lg:px-8'

// State variants
mergeCx("hover:bg-red-500", "hover:bg-blue-500");
// → 'hover:bg-blue-500'
```

### `composeClasses(config: VariantConfig): (props?: VariantProps) => string`

Creates a type-safe variant composer for building component APIs with variants.

```typescript
const button = composeClasses({
  base: "inline-flex items-center justify-center rounded-md font-medium",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background hover:bg-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
  compoundVariants: [
    {
      variant: "destructive",
      size: "lg",
      class: "font-bold",
    },
  ],
});

// Usage
button(); // Uses default variants
button({ variant: "outline", size: "sm" });
button({ variant: "destructive", size: "lg" }); // Includes compound variant
button({ variant: "ghost", className: "mt-4" }); // Add custom classes
```

### Utility Functions

#### `splitClasses(classString: string): string[]`

Splits a class string into an array of individual class names.

```typescript
splitClasses("foo bar baz");
// → ['foo', 'bar', 'baz']
```

#### `isTruthyClass(value: unknown): boolean`

Type guard that checks if a value should be included as a class name.

```typescript
isTruthyClass("foo"); // true
isTruthyClass(false); // false
isTruthyClass(0); // false
isTruthyClass(null); // false
```

## 🎯 Usage Examples

### React

```tsx
import { cx, mergeCx } from "@cx-utils/core";

function Button({ isActive, isDisabled, children }) {
  return (
    <button
      className={cx("px-4 py-2 rounded font-medium", {
        "bg-blue-500 text-white": isActive,
        "bg-gray-300 text-gray-700": !isActive,
        "opacity-50 cursor-not-allowed": isDisabled,
      })}
    >
      {children}
    </button>
  );
}

function Card({ className, children }) {
  return (
    <div
      className={mergeCx(
        "p-4 bg-white rounded-lg shadow",
        className // User overrides
      )}
    >
      {children}
    </div>
  );
}

// Usage: <Card className="p-6 bg-gray-100">...</Card>
// Result: "rounded-lg shadow p-6 bg-gray-100"
```

### Next.js (App Router)

```tsx
"use client";

import { composeClasses } from "@cx-utils/core";

const buttonVariants = composeClasses({
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  variants: {
    variant: {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export function Button({ variant, size, className, children, ...props }) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
```

### Vite / Vanilla JavaScript

```html
<script type="module">
  import { cx, mergeCx } from "@cx-utils/core";

  const button = document.createElement("button");
  button.className = cx("px-4 py-2 rounded", { active: true, disabled: false });
</script>
```

### Browser (CDN)

```html
<script type="module">
  import { cx } from "https://unpkg.com/@cx-utils/core/dist/index.mjs";

  console.log(cx("foo", "bar")); // 'foo bar'
</script>
```

## 🏆 Why Choose @cx-utils/core?

### vs. `clsx` / `classnames`

| Feature             | @cx-utils/core | clsx    | classnames |
| ------------------- | -------------- | ------- | ---------- |
| Zero dependencies   | ✅             | ✅      | ✅         |
| TypeScript generics | ✅             | ⚠️      | ❌         |
| Tailwind merge      | ✅             | ❌      | ❌         |
| Variant composition | ✅             | ❌      | ❌         |
| Tree-shakable       | ✅             | ✅      | ⚠️         |
| Performance         | ⚡ Fast        | ⚡ Fast | 🐢 Slower  |

### Performance

Based on our benchmarks (see `npm run bench`):

- **Simple strings:** ~50M ops/sec (comparable to clsx)
- **Objects:** ~20M ops/sec (comparable to clsx)
- **Mixed inputs:** ~10M ops/sec (comparable to clsx)
- **Tailwind merge:** ~2M ops/sec (unique feature)

## 🔧 Advanced Usage

### Custom Variant System

```typescript
const alert = composeClasses({
  base: "p-4 rounded-lg border",
  variants: {
    type: {
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
      success: "bg-green-50 border-green-200 text-green-800",
    },
    size: {
      sm: "text-sm p-2",
      md: "text-base p-4",
      lg: "text-lg p-6",
    },
  },
  defaultVariants: {
    type: "info",
    size: "md",
  },
  compoundVariants: [
    {
      type: "error",
      size: "lg",
      class: "font-bold shadow-lg",
    },
  ],
});
```

### Complex Conditional Styling

```typescript
function ComplexComponent({ isPrimary, isLarge, isActive, hasError }) {
  return (
    <div
      className={cx(
        "component-base",
        [
          "rounded shadow",
          {
            "bg-blue-500": isPrimary,
            "bg-gray-500": !isPrimary,
          },
        ],
        [
          isLarge ? ["text-lg", "p-6"] : ["text-sm", "p-4"],
          {
            "ring-2 ring-blue-400": isActive,
            "border-2 border-red-500": hasError,
          },
        ]
      )}
    />
  );
}
```

## 📚 Migration Guide

### From `clsx`

```typescript
// Before (clsx)
import clsx from "clsx";
const className = clsx("foo", { bar: true });

// After (@cx-utils/core)
import { cx } from "@cx-utils/core";
const className = cx("foo", { bar: true });
```

### From `classnames`

```typescript
// Before (classnames)
import classNames from "classnames";
const className = classNames("foo", { bar: true });

// After (@cx-utils/core)
import { cx } from "@cx-utils/core";
const className = cx("foo", { bar: true });
```

### From `tailwind-merge`

```typescript
// Before (tailwind-merge + clsx)
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
const className = twMerge(clsx("px-4", "px-6"));

// After (@cx-utils/core)
import { mergeCx } from "@cx-utils/core";
const className = mergeCx("px-4", "px-6");
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run performance tests
npm run test:perf
```

## 📊 Benchmarks

```bash
npm run bench
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Run all checks before publishing
npm run prepublishOnly
```

## 📄 License

**cx-utils** is [MIT licensed](https://github.com/muhammad4dev/cx-utils/blob/main/LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [GitHub Repository](https://github.com/muhammad4dev/cx-utils)
- [npm Package](https://www.npmjs.com/package/@cx-utils/core)
- [Issue Tracker](https://github.com/muhammad4dev/cx-utils/issues)

---

Made with ❤️ for the React and Tailwind CSS community
