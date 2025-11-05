// Core function
export { cx } from './cx.js';

// Merge function with Tailwind support
export { mergeCx } from './merge.js';

// Variant composition
export { composeClasses } from './compose.js';

// Utility functions
export { isTruthyClass, splitClasses, normalizeClass } from './utils.js';

// Types
export type {
    ClassValue,
    ClassArray,
    ClassDictionary,
    VariantConfig,
    VariantProps,
} from './types.js';
