import React, { forwardRef } from 'react';

/**
 * Input - Reusable input component
 * @param {string} type - Input type
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {Function} onChange - Change handler
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {boolean} disabled - Whether input is disabled
 * @param {boolean} required - Whether input is required
 * @param {React.ReactNode} icon - Icon to display
 * @param {string} iconPosition - Icon position (left, right)
 * @param {string} size - Input size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500';
  
  const iconPaddingClasses = {
    left: icon ? 'pl-10' : '',
    right: icon ? 'pr-10' : ''
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {React.cloneElement(icon, { className: iconSizeClasses[size] })}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${iconPaddingClasses[iconPosition]} ${className}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {React.cloneElement(icon, { className: iconSizeClasses[size] })}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
