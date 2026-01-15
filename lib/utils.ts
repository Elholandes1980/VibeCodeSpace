/**
 * lib/utils.ts
 *
 * Utility functions for the application.
 * Contains the cn() helper for merging Tailwind classes.
 *
 * Related:
 * - components/ui/*
 * - tailwind.config.ts
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
