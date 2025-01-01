/**
 * @file Utility functions for the application
 * @description Contains common utility functions for date formatting, string manipulation, and validation
 */

import { type ClassValue, clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

/**
 * Combines Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Date formatting utilities
 */
export const dateUtils = {
  /**
   * Format date to readable string
   * @param date - Date string or Date object
   * @param formatStr - Format string (default: 'PPP')
   */
  format: (date: Date | string, formatStr = 'PPP'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  },

  /**
   * Format date to relative time
   * @param date - Date to format
   */
  formatRelative: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return format(dateObj, 'PP')
  },
}

/**
 * String manipulation utilities
 */
export const stringUtils = {
  /**
   * Truncate string with ellipsis
   * @param str - String to truncate
   * @param length - Maximum length
   */
  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str
    return `${str.slice(0, length)}...`
  },

  /**
   * Generate URL-friendly slug
   * @param str - String to slugify
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  /**
   * Capitalize first letter of string
   * @param str - String to capitalize
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },
}

/**
 * Validation schemas and utilities
 */
export const validationSchemas = {
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and dashes'),
}

/**
 * Type guard utilities
 */
export const typeGuards = {
  /**
   * Check if value is not null or undefined
   * @param value - Value to check
   */
  isNotNullOrUndefined: <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined
  },

  /**
   * Check if value is a valid date
   * @param value - Value to check
   */
  isValidDate: (value: unknown): value is Date => {
    return value instanceof Date && !isNaN(value.getTime())
  },
}

/**
 * Error handling utilities
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Safe JSON parse with type safety
 * @param value - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}