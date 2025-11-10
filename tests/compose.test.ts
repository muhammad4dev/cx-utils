import { describe, it, expect } from 'vitest';
import { composeClasses } from '../src/compose';

describe('composeClasses()', () => {
    describe('basic functionality', () => {
        it('should return base classes only', () => {
            const compose = composeClasses({
                base: 'base-class',
            });
            expect(compose()).toBe('base-class');
        });

        it('should handle no base classes', () => {
            const compose = composeClasses({});
            expect(compose()).toBe('');
        });
    });

    describe('variants', () => {
        it('should apply single variant', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                },
            });
            expect(compose({ color: 'primary' })).toBe('btn bg-blue-500');
        });

        it('should apply multiple variants', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                    size: {
                        sm: 'text-sm px-2 py-1',
                        md: 'text-base px-4 py-2',
                        lg: 'text-lg px-6 py-3',
                    },
                },
            });
            expect(compose({ color: 'primary', size: 'lg' })).toBe(
                'btn bg-blue-500 text-lg px-6 py-3'
            );
        });

        it('should ignore undefined variants', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                    },
                },
            });
            expect(compose()).toBe('btn');
        });
    });

    describe('default variants', () => {
        it('should apply default variants', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                    size: {
                        sm: 'text-sm',
                        md: 'text-base',
                    },
                },
                defaultVariants: {
                    color: 'primary',
                    size: 'md',
                },
            });
            expect(compose()).toBe('btn bg-blue-500 text-base');
        });

        it('should override default variants with props', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                },
                defaultVariants: {
                    color: 'primary',
                },
            });
            expect(compose({ color: 'secondary' })).toBe('btn bg-gray-500');
        });
    });

    describe('compound variants', () => {
        it('should apply compound variants when conditions match', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                    size: {
                        sm: 'text-sm',
                        lg: 'text-lg',
                    },
                },
                compoundVariants: [
                    {
                        color: 'primary',
                        size: 'lg',
                        class: 'shadow-lg font-bold',
                    },
                ],
            });
            expect(compose({ color: 'primary', size: 'lg' })).toBe(
                'btn bg-blue-500 text-lg shadow-lg font-bold'
            );
        });

        it('should not apply compound variants when conditions do not match', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                        secondary: 'bg-gray-500',
                    },
                    size: {
                        sm: 'text-sm',
                        lg: 'text-lg',
                    },
                },
                compoundVariants: [
                    {
                        color: 'primary',
                        size: 'lg',
                        class: 'shadow-lg',
                    },
                ],
            });
            expect(compose({ color: 'secondary', size: 'lg' })).toBe('btn bg-gray-500 text-lg');
        });

        it('should apply multiple compound variants', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                    },
                    size: {
                        lg: 'text-lg',
                    },
                    rounded: {
                        true: 'rounded-lg',
                    },
                },
                compoundVariants: [
                    {
                        color: 'primary',
                        size: 'lg',
                        class: 'shadow-lg',
                    },
                    {
                        color: 'primary',
                        rounded: 'true',
                        class: 'border-2',
                    },
                ],
            });
            expect(compose({ color: 'primary', size: 'lg', rounded: 'true' })).toBe(
                'btn bg-blue-500 text-lg rounded-lg shadow-lg border-2'
            );
        });
    });

    describe('custom class/className', () => {
        it('should append custom class prop', () => {
            const compose = composeClasses({
                base: 'btn',
            });
            expect(compose({ class: 'custom-class' })).toBe('btn custom-class');
        });

        it('should append custom className prop', () => {
            const compose = composeClasses({
                base: 'btn',
            });
            expect(compose({ className: 'custom-class' })).toBe('btn custom-class');
        });

        it('should handle both class and className', () => {
            const compose = composeClasses({
                base: 'btn',
            });
            expect(compose({ class: 'class-1', className: 'class-2' })).toBe('btn class-1 class-2');
        });

        it('should work with variants and custom classes', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: 'bg-blue-500',
                    },
                },
            });
            expect(compose({ color: 'primary', class: 'extra' })).toBe('btn bg-blue-500 extra');
        });
    });

    describe('complex scenarios', () => {
        it('should handle button component example', () => {
            const button = composeClasses({
                base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                variants: {
                    variant: {
                        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                        outline: 'border border-input bg-background hover:bg-accent',
                        ghost: 'hover:bg-accent hover:text-accent-foreground',
                    },
                    size: {
                        default: 'h-10 px-4 py-2',
                        sm: 'h-9 rounded-md px-3',
                        lg: 'h-11 rounded-md px-8',
                        icon: 'h-10 w-10',
                    },
                },
                defaultVariants: {
                    variant: 'default',
                    size: 'default',
                },
                compoundVariants: [
                    {
                        variant: 'destructive',
                        size: 'lg',
                        class: 'font-bold',
                    },
                ],
            });

            expect(button()).toBe(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            );

            expect(button({ variant: 'destructive', size: 'lg' })).toBe(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 rounded-md px-8 font-bold'
            );
        });

        it('should handle badge component example', () => {
            const badge = composeClasses({
                base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                variants: {
                    variant: {
                        default: 'bg-primary text-primary-foreground',
                        secondary: 'bg-secondary text-secondary-foreground',
                        destructive: 'bg-destructive text-destructive-foreground',
                        outline: 'border border-input',
                    },
                },
                defaultVariants: {
                    variant: 'default',
                },
            });

            expect(badge({ variant: 'outline', class: 'ml-2' })).toBe(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-input ml-2'
            );
        });
    });

    describe('type safety', () => {
        it('should work with string literal types', () => {
            const compose = composeClasses({
                variants: {
                    color: {
                        red: 'text-red-500',
                        blue: 'text-blue-500',
                    },
                },
            });

            // These should work
            expect(compose({ color: 'red' })).toBe('text-red-500');
            expect(compose({ color: 'blue' })).toBe('text-blue-500');
        });
    });

    describe('edge cases', () => {
        it('should handle empty variant values', () => {
            const compose = composeClasses({
                base: 'btn',
                variants: {
                    color: {
                        primary: '',
                    },
                },
            });
            expect(compose({ color: 'primary' })).toBe('btn');
        });

        it('should handle array and object class values', () => {
            const compose = composeClasses({
                base: ['btn', 'btn-base'],
                variants: {
                    color: {
                        primary: ['bg-blue-500', { 'text-white': true }],
                    },
                },
            });
            expect(compose({ color: 'primary' })).toBe('btn btn-base bg-blue-500 text-white');
        });
    });
});
