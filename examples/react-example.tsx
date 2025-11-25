import React from 'react';
import { cx, mergeCx, composeClasses } from '@cx-utils/core';

// Example 1: Basic usage with conditional classes
export function Button({ isActive, isDisabled, children }) {
    return (
        <button
            className={cx(
                'px-4 py-2 rounded font-medium',
                {
                    'bg-blue-500 text-white': isActive,
                    'bg-gray-300 text-gray-700': !isActive,
                    'opacity-50 cursor-not-allowed': isDisabled,
                }
            )}
        >
            {children}
        </button>
    );
}

// Example 2: Using mergeCx for Tailwind class conflicts
export function Card({ className, children }) {
    return (
        <div
            className={mergeCx(
                'p-4 bg-white rounded-lg shadow', // Default styles
                className // User can override with their own classes
            )}
        >
            {children}
        </div>
    );
}

// Usage: <Card className="p-6 bg-gray-100">...</Card>
// Result: "rounded-lg shadow p-6 bg-gray-100" (p-4 and bg-white are overridden)

// Example 3: Variant composition with composeClasses
const buttonVariants = composeClasses({
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
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

export function VariantButton({ variant, size, className, children, ...props }) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
        >
            {children}
        </button>
    );
}

// Usage examples:
// <VariantButton variant="default" size="default">Click me</VariantButton>
// <VariantButton variant="destructive" size="lg">Delete</VariantButton>
// <VariantButton variant="outline" size="sm" className="mt-4">Cancel</VariantButton>

// Example 4: Complex conditional styling
export function Alert({ type, title, message }) {
    const alertClasses = cx(
        'p-4 rounded-lg border',
        {
            'bg-red-50 border-red-200 text-red-800': type === 'error',
            'bg-yellow-50 border-yellow-200 text-yellow-800': type === 'warning',
            'bg-blue-50 border-blue-200 text-blue-800': type === 'info',
            'bg-green-50 border-green-200 text-green-800': type === 'success',
        }
    );

    return (
        <div className={alertClasses}>
            <h3 className="font-bold mb-1">{title}</h3>
            <p>{message}</p>
        </div>
    );
}

// Example 5: Dynamic grid with responsive classes
export function Grid({ columns = 3, gap = 4, children }) {
    return (
        <div
            className={cx(
                'grid',
                {
                    'grid-cols-1': columns === 1,
                    'grid-cols-2': columns === 2,
                    'grid-cols-3': columns === 3,
                    'grid-cols-4': columns === 4,
                },
                {
                    'gap-2': gap === 2,
                    'gap-4': gap === 4,
                    'gap-6': gap === 6,
                    'gap-8': gap === 8,
                }
            )}
        >
            {children}
        </div>
    );
}

// Example 6: Nested arrays and complex conditions
export function ComplexComponent({ isPrimary, isLarge, isActive, hasError }) {
    return (
        <div
            className={cx(
                'component-base',
                [
                    'rounded',
                    'shadow',
                    {
                        'bg-blue-500': isPrimary,
                        'bg-gray-500': !isPrimary,
                    },
                ],
                [
                    isLarge ? ['text-lg', 'p-6'] : ['text-sm', 'p-4'],
                    {
                        'ring-2 ring-blue-400': isActive,
                        'border-2 border-red-500': hasError,
                    },
                ]
            )}
        >
            Complex Component
        </div>
    );
}
