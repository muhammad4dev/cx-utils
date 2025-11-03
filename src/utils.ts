/**
 * Checks if a value is truthy for class name purposes.
 * Filters out: false, null, undefined, 0, and empty strings
 */
export function isTruthyClass(value: unknown): value is string | number {
    return Boolean(value) && value !== 0;
}

/**
 * Splits a class string into an array of individual class names
 */
export function splitClasses(classString: string): string[] {
    return classString.split(/\s+/).filter(Boolean);
}

/**
 * Normalizes a class name by trimming whitespace
 */
export function normalizeClass(className: string): string {
    return className.trim();
}
