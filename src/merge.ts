import type { ClassValue } from "./types.js";
import { cx } from "./cx.js";
import { splitClasses } from "./utils.js";

/**
 * Tailwind CSS class groups for conflict resolution
 */
const TAILWIND_GROUPS: Record<string, RegExp> = {
  // Spacing - each direction is a separate group
  p: /^p-(?!\[)/,
  px: /^px-/,
  py: /^py-/,
  pt: /^pt-/,
  pr: /^pr-/,
  pb: /^pb-/,
  pl: /^pl-/,
  m: /^m-(?!\[)/,
  mx: /^mx-/,
  my: /^my-/,
  mt: /^mt-/,
  mr: /^mr-/,
  mb: /^mb-/,
  ml: /^ml-/,
  "-m": /^-m-(?!\[)/,
  "-mx": /^-mx-/,
  "-my": /^-my-/,
  "-mt": /^-mt-/,
  "-mr": /^-mr-/,
  "-mb": /^-mb-/,
  "-ml": /^-ml-/,
  space: /^space-[xy]-/,
  gap: /^gap-/,

  // Sizing
  width: /^w-/,
  height: /^h-/,
  size: /^size-/,
  minWidth: /^min-w-/,
  maxWidth: /^max-w-/,
  minHeight: /^min-h-/,
  maxHeight: /^max-h-/,

  // Positioning
  inset: /^inset-/,
  top: /^top-/,
  right: /^right-/,
  bottom: /^bottom-/,
  left: /^left-/,

  // Typography
  fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
  fontWeight:
    /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
  textAlign: /^text-(left|center|right|justify|start|end)/,
  textColor: /^text-/,

  // Layout
  display:
    /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)/,
  position: /^(static|fixed|absolute|relative|sticky)/,
  overflow: /^overflow-/,

  // Flexbox & Grid
  flexDirection: /^flex-(row|col)/,
  flexWrap: /^flex-(wrap|nowrap)/,
  justifyContent: /^justify-/,
  alignItems: /^items-/,
  alignContent: /^content-/,

  // Background
  backgroundColor: /^bg-/,
  backgroundSize: /^bg-(auto|cover|contain)/,

  // Border
  borderWidth: /^border(-\d+)?$/,
  borderT: /^border-t(-\d+)?$/,
  borderR: /^border-r(-\d+)?$/,
  borderB: /^border-b(-\d+)?$/,
  borderL: /^border-l(-\d+)?$/,
  borderX: /^border-x(-\d+)?$/,
  borderY: /^border-y(-\d+)?$/,
  borderColor: /^border-/,
  borderRadius: /^rounded/,

  // Effects
  opacity: /^opacity-/,
  shadow: /^shadow/,

  // Ring (focus rings)
  ringWidth: /^ring(-\d+)?$/,
  ringColor: /^ring-/,
  ringOffsetWidth: /^ring-offset-\d+$/,
  ringOffsetColor: /^ring-offset-/,

  // Transforms
  scale: /^scale-/,
  rotate: /^rotate-/,
  translate: /^translate-/,

  // Z-index
  zIndex: /^z-/,
};

/**
 * Extracts the group key for a Tailwind class
 */
function getClassGroup(className: string): string | null {
  // Handle responsive/state variants (e.g., 'hover:bg-blue-500', 'md:text-lg')
  const baseClass = className.split(":").pop() || className;

  for (const [group, pattern] of Object.entries(TAILWIND_GROUPS)) {
    if (pattern.test(baseClass)) {
      return group;
    }
  }

  return null;
}

/**
 * Merges Tailwind CSS classes, resolving conflicts by keeping the last occurrence
 */
function mergeTailwindClasses(classes: string[]): string[] {
  const classMap = new Map<string, string>();
  const nonTailwindClasses: string[] = [];

  for (const className of classes) {
    const group = getClassGroup(className);

    if (group) {
      // Extract variant prefix (e.g., 'hover:', 'md:')
      const variantPrefix = className.includes(":")
        ? className.substring(0, className.lastIndexOf(":") + 1)
        : "";

      const key = `${variantPrefix}${group}`;
      classMap.set(key, className);
    } else {
      nonTailwindClasses.push(className);
    }
  }

  return [...classMap.values(), ...nonTailwindClasses];
}

/**
 * Combines class names with Tailwind CSS conflict resolution.
 * Later classes override earlier conflicting classes.
 *
 * @example
 * mergeCx('px-4 py-2', 'px-6') // 'py-2 px-6'
 * mergeCx('text-red-500', 'text-blue-500') // 'text-blue-500'
 * mergeCx('hover:bg-red-500', 'hover:bg-blue-500') // 'hover:bg-blue-500'
 */
export function mergeCx(...inputs: ClassValue[]): string {
  const combined = cx(...inputs);
  const classes = splitClasses(combined);
  const merged = mergeTailwindClasses(classes);
  return merged.join(" ");
}
