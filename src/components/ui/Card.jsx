import React from 'react';

/**
 * Card - Reusable card component
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {React.ReactNode} header - Custom header content
 * @param {React.ReactNode} footer - Custom footer content
 * @param {boolean} hover - Whether card has hover effect
 * @param {string} padding - Card padding (sm, md, lg, none)
 * @param {string} className - Additional CSS classes
 */
const Card = ({
  children,
  title,
  header,
  footer,
  hover = false,
  padding = 'md',
  className = ''
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-all duration-300';
  
  const hoverClasses = hover ? 'hover:shadow-lg' : '';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  };

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
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
