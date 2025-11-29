import { describe, it, expect } from 'vitest';
import { isTruthyClass, splitClasses, normalizeClass } from '../src/utils';

describe('utils', () => {
    describe('isTruthyClass', () => {
        it('should return true for non-empty strings', () => {
            expect(isTruthyClass('foo')).toBe(true);
        });

        it('should return true for numbers (except 0)', () => {
            expect(isTruthyClass(1)).toBe(true);
            expect(isTruthyClass(-1)).toBe(true);
        });

        it('should return false for empty strings', () => {
            expect(isTruthyClass('')).toBe(false);
        });

        it('should return false for 0', () => {
            expect(isTruthyClass(0)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isTruthyClass(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isTruthyClass(undefined)).toBe(false);
        });

        it('should return false for false', () => {
            expect(isTruthyClass(false)).toBe(false);
        });
    });

    describe('splitClasses', () => {
        it('should split string by whitespace', () => {
            expect(splitClasses('foo bar')).toEqual(['foo', 'bar']);
        });

        it('should handle multiple spaces', () => {
            expect(splitClasses('foo   bar')).toEqual(['foo', 'bar']);
        });

        it('should handle tabs and newlines', () => {
            expect(splitClasses('foo\tbar\n\rbaz')).toEqual(['foo', 'bar', 'baz']);
        });

        it('should filter empty strings', () => {
            expect(splitClasses('  foo  ')).toEqual(['foo']);
        });

        it('should return empty array for empty string', () => {
            expect(splitClasses('')).toEqual([]);
        });
    });

    describe('normalizeClass', () => {
        it('should trim whitespace', () => {
            expect(normalizeClass('  foo  ')).toBe('foo');
        });

        it('should return empty string for empty string', () => {
            expect(normalizeClass('')).toBe('');
        });

        it('should return same string if no whitespace', () => {
            expect(normalizeClass('foo')).toBe('foo');
        });
    });
});
