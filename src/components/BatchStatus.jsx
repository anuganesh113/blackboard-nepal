import React from 'react';

/**
 * BatchStatus - Reusable component for displaying batch active status
 * @param {boolean} isActive - Whether the batch is active
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Status badge component
 */
const BatchStatus = ({ isActive, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className} ${
        isActive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      }`}
    >
      {isActive ? 'Yes' : 'No'}
    </span>
  );
};

export default BatchStatus;
