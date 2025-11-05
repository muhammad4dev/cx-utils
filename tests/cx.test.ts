import { describe, it, expect } from 'vitest';
import { cx } from '../src/cx';

describe('cx()', () => {
    describe('basic functionality', () => {
        it('should combine string arguments', () => {
            expect(cx('foo', 'bar')).toBe('foo bar');
        });

        it('should handle single string', () => {
            expect(cx('foo')).toBe('foo');
        });

        it('should handle empty input', () => {
            expect(cx()).toBe('');
        });

        it('should handle numbers', () => {
            expect(cx(1, 2, 3)).toBe('1 2 3');
        });

        it('should mix strings and numbers', () => {
            expect(cx('foo', 1, 'bar', 2)).toBe('foo 1 bar 2');
        });
    });

    describe('falsy value filtering', () => {
        it('should filter out false', () => {
            expect(cx('foo', false, 'bar')).toBe('foo bar');
        });

        it('should filter out null', () => {
            expect(cx('foo', null, 'bar')).toBe('foo bar');
        });

        it('should filter out undefined', () => {
            expect(cx('foo', undefined, 'bar')).toBe('foo bar');
        });

        it('should filter out 0', () => {
            expect(cx('foo', 0, 'bar')).toBe('foo bar');
        });

        it('should filter out empty strings', () => {
            expect(cx('foo', '', 'bar')).toBe('foo bar');
        });

        it('should handle all falsy values', () => {
            expect(cx(false, null, undefined, 0, '', 'foo')).toBe('foo');
        });
    });

    describe('array support', () => {
        it('should handle arrays', () => {
            expect(cx(['foo', 'bar'])).toBe('foo bar');
        });

        it('should handle nested arrays', () => {
            expect(cx(['foo', ['bar', 'baz']])).toBe('foo bar baz');
        });

        it('should handle deeply nested arrays', () => {
            expect(cx(['foo', ['bar', ['baz', 'qux']]])).toBe('foo bar baz qux');
        });

        it('should filter falsy values in arrays', () => {
            expect(cx(['foo', false, 'bar', null, 'baz'])).toBe('foo bar baz');
        });

        it('should handle empty arrays', () => {
            expect(cx([], 'foo', [])).toBe('foo');
        });

        it('should mix arrays and strings', () => {
            expect(cx('foo', ['bar', 'baz'], 'qux')).toBe('foo bar baz qux');
        });
    });

    describe('object support', () => {
        it('should handle objects with truthy values', () => {
            expect(cx({ foo: true, bar: true })).toBe('foo bar');
        });

        it('should filter out falsy object values', () => {
            expect(cx({ foo: true, bar: false, baz: true })).toBe('foo baz');
        });

        it('should handle objects with various truthy values', () => {
            expect(cx({ foo: 1, bar: 'yes', baz: true })).toBe('foo bar baz');
        });

        it('should filter out 0 in objects', () => {
            expect(cx({ foo: 1, bar: 0, baz: 2 })).toBe('foo baz');
        });

        it('should handle empty objects', () => {
            expect(cx({}, 'foo')).toBe('foo');
        });
    });

    describe('mixed inputs', () => {
        it('should handle strings, arrays, and objects', () => {
            expect(cx('foo', ['bar'], { baz: true, qux: false })).toBe('foo bar baz');
        });

        it('should handle complex nested structures', () => {
            expect(
                cx(
                    'base',
                    ['foo', { bar: true, baz: false }],
                    { qux: true },
                    [['nested', { deep: true }]]
                )
            ).toBe('base foo bar qux nested deep');
        });

        it('should handle conditional classes', () => {
            const isActive = true;
            const isDisabled = false;
            expect(cx('btn', { active: isActive, disabled: isDisabled })).toBe('btn active');
        });
    });

    describe('deterministic output', () => {
        it('should produce same output for same input', () => {
            const input = ['foo', { bar: true, baz: false }, 'qux'];
            const result1 = cx(...input);
            const result2 = cx(...input);
            expect(result1).toBe(result2);
        });

        it('should maintain order', () => {
            expect(cx('a', 'b', 'c')).toBe('a b c');
            expect(cx('c', 'b', 'a')).toBe('c b a');
        });
    });

    describe('edge cases', () => {
        it('should handle very long class lists', () => {
            const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);
            const result = cx(...classes);
            expect(result.split(' ')).toHaveLength(100);
        });

        it('should handle special characters', () => {
            expect(cx('foo-bar', 'baz_qux', 'test:hover')).toBe('foo-bar baz_qux test:hover');
        });

        it('should handle Unicode characters', () => {
            expect(cx('foo', '你好', 'مرحبا')).toBe('foo 你好 مرحبا');
        });

        it('should handle objects with numeric keys', () => {
            expect(cx({ '0': true, '1': false, '2': true })).toBe('0 2');
        });
    });

    describe('real-world scenarios', () => {
        it('should work with React className patterns', () => {
            const isActive = true;
            const size = 'large';
            expect(
                cx('button', 'button-primary', {
                    'button-active': isActive,
                    'button-large': size === 'large',
                    'button-small': size === 'small',
                })
            ).toBe('button button-primary button-active button-large');
        });

        it('should work with Tailwind CSS classes', () => {
            expect(
                cx(
                    'px-4 py-2',
                    'bg-blue-500 text-white',
                    'rounded-lg',
                    { 'hover:bg-blue-600': true, 'disabled:opacity-50': false }
                )
            ).toBe('px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600');
        });
    });
});
