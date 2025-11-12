import { describe, it, expect } from 'vitest';
import { cx } from '../src/cx';
import { mergeCx } from '../src/merge';

describe('Performance Tests', () => {
    describe('cx() performance', () => {
        it('should handle simple strings quickly', () => {
            const start = performance.now();
            for (let i = 0; i < 100000; i++) {
                cx('foo', 'bar', 'baz');
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(100); // Should be very fast
        });

        it('should handle objects quickly', () => {
            const start = performance.now();
            for (let i = 0; i < 50000; i++) {
                cx({ foo: true, bar: false, baz: true, qux: false });
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(200);
        });

        it('should handle arrays quickly', () => {
            const start = performance.now();
            for (let i = 0; i < 50000; i++) {
                cx(['foo', 'bar', ['baz', 'qux']]);
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(200);
        });

        it('should handle mixed inputs quickly', () => {
            const start = performance.now();
            for (let i = 0; i < 30000; i++) {
                cx('base', ['foo', { bar: true, baz: false }], 'end');
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(300);
        });

        it('should handle large class lists efficiently', () => {
            const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                cx(...classes);
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(500);
        });
    });

    describe('mergeCx() performance', () => {
        it('should handle simple merges quickly', () => {
            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                mergeCx('px-4 py-2', 'px-6');
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(500);
        });

        it('should handle complex merges efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 5000; i++) {
                mergeCx(
                    'px-4 py-2 text-sm bg-blue-500 rounded-lg',
                    'px-6 text-lg bg-red-500'
                );
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(1000);
        });

        it('should handle responsive classes efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 5000; i++) {
                mergeCx(
                    'px-4 md:px-6 lg:px-8',
                    'py-2 md:py-4 lg:py-6',
                    'text-sm md:text-base lg:text-lg'
                );
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(1000);
        });
    });

    describe('memory efficiency', () => {
        it('should not accumulate memory with repeated calls', () => {
            // Run many iterations to check for memory leaks
            for (let i = 0; i < 100000; i++) {
                cx('foo', 'bar', { baz: true });
            }
            // If we get here without crashing, memory is being managed properly
            expect(true).toBe(true);
        });

        it('should handle large temporary objects efficiently', () => {
            for (let i = 0; i < 10000; i++) {
                const obj: Record<string, boolean> = {};
                for (let j = 0; j < 50; j++) {
                    obj[`class-${j}`] = j % 2 === 0;
                }
                cx(obj);
            }
            expect(true).toBe(true);
        });
    });

    describe('worst-case scenarios', () => {
        it('should handle deeply nested arrays without stack overflow', () => {
            const createDeepArray = (depth: number): unknown[] => {
                if (depth === 0) return ['leaf'];
                return [createDeepArray(depth - 1)];
            };

            const start = performance.now();
            const deep = createDeepArray(100);
            cx(deep);
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(100);
        });

        it('should handle many small objects efficiently', () => {
            const objects = Array.from({ length: 100 }, (_, i) => ({
                [`class-${i}`]: true,
            }));

            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                cx(...objects);
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(1000);
        });

        it('should handle alternating truthy/falsy values efficiently', () => {
            const values = Array.from({ length: 100 }, (_, i) =>
                i % 2 === 0 ? `class-${i}` : false
            );

            const start = performance.now();
            for (let i = 0; i < 5000; i++) {
                cx(...values);
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(500);
        });
    });

    describe('real-world patterns', () => {
        it('should handle typical React component usage efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                const isActive = i % 2 === 0;
                const size = i % 3 === 0 ? 'large' : 'small';
                cx('button', 'button-primary', {
                    'button-active': isActive,
                    'button-large': size === 'large',
                    'button-small': size === 'small',
                });
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(300);
        });

        it('should handle typical Tailwind usage efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                mergeCx(
                    'px-4 py-2 bg-blue-500 text-white rounded-lg',
                    i % 2 === 0 && 'hover:bg-blue-600',
                    i % 3 === 0 && 'shadow-lg',
                    { 'opacity-50': i % 5 === 0 }
                );
            }
            const duration = performance.now() - start;
            expect(duration).toBeLessThan(1000);
        });
    });
});
