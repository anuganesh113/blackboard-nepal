import React from 'react';
import { cn } from '../utils';

/**
 * Design System Badge Component
 * 
 * @param {string} variant - Badge variant (primary, success, danger, warning, info, gray)
 * @param {string} size - Badge size (sm, md, lg)
 * @param {boolean} outlined - Whether badge is outlined
 * @param {React.ReactNode} children - Badge content
 * @param {string} className - Additional CSS classes
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  outlined = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-full',
    'transition-colors',
    'duration-200',
  ];

  const variantStyles = {
    primary: {
      solid: 'bg-blue-500 text-white',
      outlined: 'bg-transparent border border-blue-500 text-blue-500',
    },
    success: {
      solid: 'bg-green-500 text-white',
      outlined: 'bg-transparent border border-green-500 text-green-500',
    },
    danger: {
      solid: 'bg-red-500 text-white',
      outlined: 'bg-transparent border border-red-500 text-red-500',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      outlined: 'bg-transparent border border-yellow-500 text-yellow-500',
    },
    info: {
      solid: 'bg-blue-400 text-white',
      outlined: 'bg-transparent border border-blue-400 text-blue-400',
    },
    gray: {
      solid: 'bg-gray-500 text-white',
      outlined: 'bg-transparent border border-gray-500 text-gray-500',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const styleKey = outlined ? 'outlined' : 'solid';
  const variantStyle = variantStyles[variant]?.[styleKey] || variantStyles.primary[styleKey];

  return (
    <span
      className={cn(
        ...baseClasses,
        variantStyle,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

