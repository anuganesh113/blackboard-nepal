import React from 'react';
import { cn } from '../utils';

/**
 * Design System Input Component
 * 
 * @param {string} variant - Input variant (default, outlined, filled)
 * @param {string} size - Input size (sm, md, lg)
 * @param {boolean} error - Whether input has error state
 * @param {string} className - Additional CSS classes
 * @param {object} ...props - Standard input props
 */
const Input = ({
  variant = 'default',
  size = 'md',
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  const variantClasses = {
    default: [
      'bg-white',
      'dark:bg-gray-800',
      'border',
      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
      'rounded-lg',
      'focus:border-blue-500',
      'focus:ring-blue-500',
    ],
    outlined: [
      'bg-transparent',
      'border-2',
      error ? 'border-red-500' : 'border-gray-400 dark:border-gray-500',
      'rounded-xl',
      'focus:border-blue-500',
      'focus:ring-blue-500',
    ],
    filled: [
      'bg-gray-100',
      'dark:bg-gray-700',
      'border',
      error ? 'border-red-500' : 'border-transparent',
      'rounded-lg',
      'focus:bg-white',
      'dark:focus:bg-gray-800',
      'focus:border-blue-500',
      'focus:ring-blue-500',
    ],
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <input
      className={cn(
        ...baseClasses,
        ...variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

export default Input;

