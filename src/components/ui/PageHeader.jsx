import React from 'react';

/**
 * PageHeader - Reusable page header component
 * @param {string} title - Main page title
 * @param {string} description - Page description
 * @param {React.ReactNode} children - Optional additional content (buttons, etc.)
 * @param {string} className - Additional CSS classes
 */
const PageHeader = ({ title, description, children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
