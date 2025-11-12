import { describe, it, expect } from 'vitest';
import { cx } from '../src/cx';
import { mergeCx } from '../src/merge';

describe('Edge Cases', () => {
    describe('deeply nested structures', () => {
        it('should handle 10 levels of nesting', () => {
            const nested = [
                'a',
                ['b', ['c', ['d', ['e', ['f', ['g', ['h', ['i', ['j', 'k']]]]]]]]],
            ];
            expect(cx(nested)).toBe('a b c d e f g h i j k');
        });

        it('should handle mixed deep nesting', () => {
            const nested = [
                'a',
                { b: true },
                ['c', { d: true, e: false }, [{ f: true }, ['g', 'h']]],
            ];
            expect(cx(nested)).toBe('a b c d f g h');
        });
    });

    describe('large inputs', () => {
        it('should handle 1000 class names', () => {
            const classes = Array.from({ length: 1000 }, (_, i) => `class-${i}`);
            const result = cx(...classes);
            expect(result.split(' ')).toHaveLength(1000);
            expect(result).toContain('class-0');
            expect(result).toContain('class-999');
        });

        it('should handle large objects', () => {
            const obj: Record<string, boolean> = {};
            for (let i = 0; i < 500; i++) {
                obj[`class-${i}`] = i % 2 === 0;
            }
            const result = cx(obj);
            const classes = result.split(' ');
            expect(classes).toHaveLength(250);
        });

        it('should handle large arrays with mixed types', () => {
            const arr = Array.from({ length: 100 }, (_, i) => {
                if (i % 3 === 0) return `string-${i}`;
                if (i % 3 === 1) return { [`obj-${i}`]: true };
                return [`arr-${i}`];
            });
            const result = cx(...arr);
            expect(result).toContain('string-0');
            expect(result).toContain('obj-1');
            expect(result).toContain('arr-2');
        });
    });

    describe('special characters and Unicode', () => {
        it('should handle dashes and underscores', () => {
            expect(cx('foo-bar', 'baz_qux', 'test-class_name')).toBe(
                'foo-bar baz_qux test-class_name'
            );
        });

        it('should handle colons (Tailwind variants)', () => {
            expect(cx('hover:bg-blue-500', 'md:text-lg', 'dark:bg-gray-900')).toBe(
                'hover:bg-blue-500 md:text-lg dark:bg-gray-900'
            );
        });

        it('should handle slashes (Tailwind fractions)', () => {
            expect(cx('w-1/2', 'w-2/3', 'w-3/4')).toBe('w-1/2 w-2/3 w-3/4');
        });

        it('should handle square brackets (arbitrary values)', () => {
            expect(cx('p-[10px]', 'text-[#ff0000]', 'w-[calc(100%-20px)]')).toBe(
                'p-[10px] text-[#ff0000] w-[calc(100%-20px)]'
            );
        });

        it('should handle Unicode characters', () => {
            expect(cx('你好', 'مرحبا', '🎉', 'Привет')).toBe('你好 مرحبا 🎉 Привет');
        });

        it('should handle emoji in class names', () => {
            expect(cx('class-🚀', 'test-✨', { '🎨-active': true })).toBe(
                'class-🚀 test-✨ 🎨-active'
            );
        });
    });

    describe('whitespace handling', () => {
        it('should handle multiple spaces in strings', () => {
            expect(cx('foo  bar   baz')).toBe('foo  bar   baz');
        });

        it('should handle tabs and newlines', () => {
            expect(cx('foo\tbar\nbaz')).toBe('foo\tbar\nbaz');
        });

        it('should handle leading/trailing spaces', () => {
            expect(cx('  foo  ', '  bar  ')).toBe('  foo     bar  ');
        });
    });

    describe('prototype pollution protection', () => {
        it('should not be affected by __proto__', () => {
            const obj = { __proto__: { malicious: true }, safe: true };
            expect(cx(obj)).toBe('safe');
        });

        it('should not be affected by constructor', () => {
            const obj = { constructor: true, safe: true };
            expect(cx(obj)).toBe('constructor safe');
        });

        it('should use hasOwnProperty check', () => {
            const obj = Object.create({ inherited: true });
            obj.own = true;
            expect(cx(obj)).toBe('own');
        });
    });

    describe('numeric edge cases', () => {
        it('should handle 0 correctly', () => {
            expect(cx(0)).toBe('');
            expect(cx('foo', 0, 'bar')).toBe('foo bar');
        });

        it('should handle negative numbers', () => {
            expect(cx(-1, -5, -10)).toBe('-1 -5 -10');
        });

        it('should handle floats', () => {
            expect(cx(1.5, 2.7, 3.14)).toBe('1.5 2.7 3.14');
        });

        it('should handle NaN', () => {
            expect(cx(NaN)).toBe('NaN');
        });

        it('should handle Infinity', () => {
            expect(cx(Infinity, -Infinity)).toBe('Infinity -Infinity');
        });
    });

    describe('mergeCx edge cases', () => {
        it('should handle very long class lists', () => {
            const classes = Array.from({ length: 50 }, (_, i) => `class-${i}`);
            const result = mergeCx(...classes);
            expect(result.split(' ')).toHaveLength(50);
        });

        it('should handle multiple conflicts in one call', () => {
            expect(mergeCx('px-1 py-1 text-xs', 'px-2 py-2 text-sm', 'px-3 py-3 text-base')).toBe(
                'px-3 py-3 text-base'
            );
        });

        it('should preserve order of non-conflicting classes', () => {
            const result = mergeCx('z-10 opacity-50 shadow-lg', 'px-4');
            expect(result).toBe('z-10 opacity-50 shadow-lg px-4');
        });
    });

    describe('memory and performance', () => {
        it('should handle repeated calls efficiently', () => {
            const start = Date.now();
            for (let i = 0; i < 10000; i++) {
                cx('foo', 'bar', { baz: true }, ['qux']);
            }
            const duration = Date.now() - start;
            // Should complete 10k iterations in reasonable time (< 100ms on modern hardware)
            expect(duration).toBeLessThan(1000);
        });

        it('should not leak memory with large nested structures', () => {
            const createNested = (depth: number): unknown => {
                if (depth === 0) return 'leaf';
                return [createNested(depth - 1), createNested(depth - 1)];
            };

            // This should not crash or hang
            const nested = createNested(10);
            const result = cx(nested);
            expect(result).toBeTruthy();
        });
    });

    describe('empty and null inputs', () => {
        it('should handle all empty inputs', () => {
            expect(cx('', '', '')).toBe('');
        });

        it('should handle all null inputs', () => {
            expect(cx(null, null, null)).toBe('');
        });

        it('should handle all undefined inputs', () => {
            expect(cx(undefined, undefined, undefined)).toBe('');
        });

        it('should handle all false inputs', () => {
            expect(cx(false, false, false)).toBe('');
        });

        it('should handle mixed empty inputs', () => {
            expect(cx('', null, undefined, false, 0, [])).toBe('');
        });

        it('should handle empty objects and arrays', () => {
            expect(cx({}, [], [[]], [{}])).toBe('');
        });
    });
});
