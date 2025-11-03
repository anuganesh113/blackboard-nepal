import React from 'react';
import { cardVariants } from '../tokens';

/**
 * Design System Card Component
 * 
 * A consistent, reusable card component with variant support.
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} variant - Card variant (default, elevated, outlined)
 * @param {string} padding - Card padding (sm, md, lg, none)
 * @param {boolean} hover - Whether card has hover effect
 * @param {string} title - Card title
 * @param {React.ReactNode} header - Custom header content
 * @param {React.ReactNode} footer - Custom footer content
 * @param {string} className - Additional CSS classes
 * @param {object} ...props - Additional HTML div props
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  title,
  header,
  footer,
  className = '',
  ...props
}) => {
  const variantStyle = cardVariants[variant] || cardVariants.default;

  const baseClasses = [
    'rounded-3xl',
    'transition-all',
    'duration-300',
    hover ? 'hover:shadow-xl' : '',
  ].filter(Boolean).join(' ');

  const variantClasses = [
    variantStyle.bg,
    variantStyle.border,
    variantStyle.shadow,
  ].filter(Boolean).join(' ');

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {(title || header) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          {header || (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
        </div>
      )}
      
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

