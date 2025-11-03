/**
 * Design System Tokens
 * 
 * Centralized design tokens for consistent styling across the application.
 * These tokens define colors, typography, spacing, shadows, and other design properties.
 */

export const colors = {
  // Primary Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Success (Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning (Yellow/Orange)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Danger (Red)
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Info (Blue)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Purple
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Gray Scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic Colors for Dark Mode
  dark: {
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      muted: '#cbd5e1',
    },
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 999999,
};

// Button Variants Configuration
export const buttonVariants = {
  primary: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    hover: 'hover:from-blue-600 hover:to-blue-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  secondary: {
    bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
    hover: 'hover:from-gray-600 hover:to-gray-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  success: {
    bg: 'bg-gradient-to-r from-green-500 to-green-600',
    hover: 'hover:from-green-600 hover:to-green-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  danger: {
    bg: 'bg-gradient-to-r from-red-500 to-red-600',
    hover: 'hover:from-red-600 hover:to-red-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  warning: {
    bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    hover: 'hover:from-yellow-600 hover:to-yellow-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  purple: {
    bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
    hover: 'hover:from-purple-600 hover:to-purple-700',
    text: 'text-white',
    shadow: 'shadow-xl hover:shadow-2xl',
  },
  ghost: {
    bg: 'bg-transparent',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    shadow: '',
    border: 'border border-gray-300 dark:border-gray-600',
  },
};

export const buttonSizes = {
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  md: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
  lg: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    icon: 'w-6 h-6',
  },
};

// Card Variants
export const cardVariants = {
  default: {
    bg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-lg',
  },
  elevated: {
    bg: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl',
    border: 'border border-white/20 dark:border-slate-700/50',
    shadow: 'shadow-lg',
  },
  outlined: {
    bg: 'bg-transparent',
    border: 'border-2 border-gray-300 dark:border-gray-600',
    shadow: '',
  },
};

// Default export with all tokens
export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  buttonVariants,
  buttonSizes,
  cardVariants,
};

