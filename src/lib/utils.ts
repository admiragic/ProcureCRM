/**
 * @file Contains utility functions used throughout the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It uses `clsx` to handle conditional classes and `tailwind-merge` to
 * resolve conflicting Tailwind CSS classes intelligently.
 * 
 * @param {...ClassValue[]} inputs - A list of class names or conditions.
 * @returns {string} The merged and final class name string.
 * 
 * @example
 * cn("p-4", "font-bold", true && "text-red-500");
 * // => "p-4 font-bold text-red-500"
 * 
 * @example
 * cn("p-4", "p-2");
 * // => "p-2" (tailwind-merge resolves the conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
