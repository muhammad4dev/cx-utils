import type { ClassValue } from "./types.js";

/**
 * Combines class names into a single string.
 * Accepts strings, numbers, arrays, objects, and nested structures.
 * Filters out falsy values (false, null, undefined, 0, empty strings).
 *
 * @example
 * cx('foo', 'bar') // 'foo bar'
 * cx('foo', false, 'bar') // 'foo bar'
 * cx({ foo: true, bar: false }) // 'foo'
 * cx(['foo', 'bar'], 'baz') // 'foo bar baz'
 * cx('foo', ['bar', { baz: true }]) // 'foo bar baz'
 */
export function cx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    // Handle null and undefined first
    if (input == null) {
      continue;
    }

    const inputType = typeof input;

    // Handle numbers (including NaN and Infinity)
    if (inputType === "number") {
      // Skip 0, but include NaN and Infinity
      if (input === 0) continue;
      classes.push(String(input));
    } else if (inputType === "string") {
      // Skip empty strings
      if (input === "") continue;
      classes.push(input as string);
    } else if (inputType === "boolean") {
      // Skip all booleans
      continue;
    } else if (Array.isArray(input)) {
      // Recursively process arrays
      if (input.length > 0) {
        const nested = cx(...input);
        if (nested) {
          classes.push(nested);
        }
      }
    } else if (inputType === "object") {
      // Process object with conditional keys
      const obj = input as Record<string, unknown>;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
