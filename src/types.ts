/**
 * A class value can be a string, number, boolean, null, undefined,
 * an object with string keys and boolean-like values,
 * an array of class values, or nested arrays.
 */
export type ClassValue =
    | ClassArray
    | ClassDictionary
    | string
    | number
    | null
    | boolean
    | undefined;

export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];

/**
 * Variant configuration for composeClasses
 */
export interface VariantConfig<V extends Record<string, Record<string, ClassValue>>> {
    base?: ClassValue;
    variants?: V;
    defaultVariants?: {
        [K in keyof V]?: keyof V[K];
    };
    compoundVariants?: Array<{
        [K in keyof V]?: keyof V[K];
    } & {
        class: ClassValue;
    }>;
}

/**
 * Props type for variant composition
 */
export type VariantProps<V extends Record<string, Record<string, ClassValue>>> = {
    [K in keyof V]?: keyof V[K];
} & {
    class?: ClassValue;
    className?: ClassValue;
};
