import React from 'react';
import { buttonVariants, buttonSizes } from '../tokens';

/**
 * Design System Button Component
 * 
 * A consistent, reusable button component with variant and size support.
 * Maintains backward compatibility with existing button usage.
 * 
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Button variant (primary, secondary, success, danger, warning, purple, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} loading - Whether button is in loading state
 * @param {React.ReactNode} icon - Icon component to display
 * @param {string} iconPosition - Icon position (left, right)
 * @param {Function} onClick - Click handler
 * @param {string} type - Button type (button, submit, reset)
 * @param {string} className - Additional CSS classes
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {boolean} withSparkles - Whether to show sparkles icon (deprecated, will be ignored)
 * @param {object} ...props - Additional HTML button props
 * 
 * @example
 * <Button variant="primary" size="md" icon={<Plus />}>
 *   Add Item
 * </Button>
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  withSparkles = false, // Deprecated, maintained for backward compatibility
  ...props
}) => {
  // Get variant styles from tokens
  const variantStyle = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyle = buttonSizes[size] || buttonSizes.md;

  // Base classes - consistent across all buttons
  const baseClasses = [
    'group',
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-semibold',
    'rounded-2xl',
    'transition-all',
    'duration-300',
    'overflow-hidden',
    'transform',
    'hover:scale-105',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  // Variant-specific classes
  const variantClasses = [
    variantStyle.bg,
    variantStyle.hover,
    variantStyle.text,
    variantStyle.shadow,
    variantStyle.border || '',
  ].filter(Boolean).join(' ');

  // Size-specific classes
  const sizeClasses = [
    sizeStyle.padding,
    sizeStyle.text,
  ].join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className={`animate-spin ${sizeStyle.icon}`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Hover gradient overlay (for gradient buttons)
  const hoverOverlay = variant !== 'ghost' ? (
    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  ) : null;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {hoverOverlay}
      
      {loading && (
        <span className="relative z-10">
          <LoadingSpinner />
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={`relative z-10 ${sizeStyle.icon}`}>
          {icon}
        </span>
      )}
      
      {children && (
        <span className="relative z-10">
          {children}
        </span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={`relative z-10 ${sizeStyle.icon}`}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;

