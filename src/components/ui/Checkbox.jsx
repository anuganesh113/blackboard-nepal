import React, { forwardRef } from 'react';

/**
 * Checkbox - Reusable checkbox component
 * @param {boolean} checked - Whether checkbox is checked
 * @param {Function} onChange - Change handler
 * @param {string} label - Checkbox label
 * @param {string} error - Error message
 * @param {boolean} disabled - Whether checkbox is disabled
 * @param {boolean} required - Whether checkbox is required
 * @param {string} size - Checkbox size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
const Checkbox = forwardRef(({
  checked = false,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${sizeClasses[size]} text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        />
      </div>
      
      {label && (
        <div className="flex-1">
          <label className={`${labelSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
