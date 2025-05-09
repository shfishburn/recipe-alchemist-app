
// Add cn utility function if it doesn't already exist
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and Tailwind CSS classes together,
 * properly handling conflicts using tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Add other utility functions here as needed...
