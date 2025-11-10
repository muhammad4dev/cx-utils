import type { ClassValue, VariantConfig, VariantProps } from './types.js';
import { cx } from './cx.js';

/**
 * Creates a type-safe variant composer (mini Class Variance Authority).
 * Supports base classes, variants, default variants, and compound variants.
 * 
 * @example
 * const button = composeClasses({
 *   base: 'px-4 py-2 rounded font-medium',
 *   variants: {
 *     color: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white',
 *     },
 *     size: {
 *       sm: 'text-sm',
 *       md: 'text-base',
 *       lg: 'text-lg',
 *     },
 *   },
 *   defaultVariants: {
 *     color: 'primary',
 *     size: 'md',
 *   },
 *   compoundVariants: [
 *     {
 *       color: 'primary',
 *       size: 'lg',
 *       class: 'shadow-lg',
 *     },
 *   ],
 * });
 * 
 * button({ color: 'secondary', size: 'lg' })
 * // 'px-4 py-2 rounded font-medium bg-gray-500 text-white text-lg'
 */
export function composeClasses<V extends Record<string, Record<string, ClassValue>>>(
    config: VariantConfig<V>
) {
    return (props?: VariantProps<V>): string => {
        const classes: ClassValue[] = [];

        // Add base classes
        if (config.base) {
            classes.push(config.base);
        }

        // Merge default variants with provided props
        const variantProps = {
            ...config.defaultVariants,
            ...props,
        } as Record<string, string | undefined>;

        // Add variant classes
        if (config.variants) {
            for (const variantKey in config.variants) {
                const variantValue = variantProps[variantKey];
                if (variantValue && config.variants[variantKey]?.[variantValue]) {
                    classes.push(config.variants[variantKey][variantValue]);
                }
            }
        }

        // Add compound variant classes
        if (config.compoundVariants) {
            for (const compound of config.compoundVariants) {
                let matches = true;

                for (const key in compound) {
                    if (key === 'class') continue;

                    if (variantProps[key] !== compound[key]) {
                        matches = false;
                        break;
                    }
                }

                if (matches && compound.class) {
                    classes.push(compound.class);
                }
            }
        }

        // Add custom class/className
        if (props?.class) {
            classes.push(props.class);
        }
        if (props?.className) {
            classes.push(props.className);
        }

        return cx(...classes);
    };
}
