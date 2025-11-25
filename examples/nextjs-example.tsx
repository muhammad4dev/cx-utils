import { cx, mergeCx, composeClasses } from '@cx-utils/core';

// Next.js App Router Example (app/components/Button.tsx)
'use client';

import { ButtonHTMLAttributes } from 'react';

const buttonVariants = composeClasses({
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50',
    variants: {
        variant: {
            default: 'bg-blue-600 text-white hover:bg-blue-700',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
            ghost: 'hover:bg-gray-100',
        },
        size: {
            sm: 'h-9 px-3 text-sm',
            md: 'h-10 px-4',
            lg: 'h-12 px-6 text-lg',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
        >
            {children}
        </button>
    );
}

// Next.js Pages Router Example (pages/index.tsx)
import { useState } from 'react';

export default function HomePage() {
    const [isActive, setIsActive] = useState(false);

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-8">Next.js with @cx-utils/core</h1>

            {/* Example 1: Basic cx usage */}
            <div
                className={cx(
                    'p-6 rounded-lg border-2',
                    {
                        'border-blue-500 bg-blue-50': isActive,
                        'border-gray-300 bg-white': !isActive,
                    }
                )}
            >
                <p>Click the button to toggle state</p>
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={cx(
                        'mt-4 px-4 py-2 rounded',
                        isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    )}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </button>
            </div>

            {/* Example 2: mergeCx with Tailwind */}
            <Card className="mt-8 p-8 bg-gradient-to-r from-purple-500 to-pink-500">
                <h2 className="text-2xl font-bold text-white">Custom Styled Card</h2>
                <p className="text-white/90">
                    The default padding is overridden by the custom p-8 class
                </p>
            </Card>

            {/* Example 3: Variant buttons */}
            <div className="mt-8 flex gap-4">
                <Button variant="default" size="sm">
                    Small Default
                </Button>
                <Button variant="outline" size="md">
                    Medium Outline
                </Button>
                <Button variant="ghost" size="lg">
                    Large Ghost
                </Button>
            </div>
        </main>
    );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={mergeCx(
                'p-4 bg-white rounded-lg shadow-md border border-gray-200',
                className
            )}
        >
            {children}
        </div>
    );
}

// Next.js Server Component Example (app/page.tsx)
import { cx } from '@cx-utils/core';

export default function ServerPage() {
    const items = [
        { id: 1, title: 'Item 1', featured: true },
        { id: 2, title: 'Item 2', featured: false },
        { id: 3, title: 'Item 3', featured: true },
    ];

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Server Component Example</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cx(
                            'p-6 rounded-lg border-2 transition-all',
                            {
                                'border-yellow-400 bg-yellow-50 shadow-lg': item.featured,
                                'border-gray-200 bg-white': !item.featured,
                            }
                        )}
                    >
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        {item.featured && (
                            <span className="inline-block mt-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                                FEATURED
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// API Route Example (app/api/utils/route.ts)
import { cx } from '@cx-utils/core';
import { NextResponse } from 'next/server';

export async function GET() {
    // You can even use cx in API routes for generating HTML emails, etc.
    const emailClasses = cx(
        'email-container',
        'max-w-2xl',
        'mx-auto',
        { 'dark-mode': false }
    );

    return NextResponse.json({
        classes: emailClasses,
        message: '@cx-utils/core works everywhere!',
    });
}
