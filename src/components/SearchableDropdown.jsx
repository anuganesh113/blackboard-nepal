import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import Tooltip from './Tooltip';

const SearchableDropdown = ({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  error,
  required = false,
  multiple = false,
  searchable = true,
  disabled = false,
  className = "",
  optionKey = "value",
  optionLabel = "label",
  maxHeight = "max-h-64",
  showSelectedCount = true,
  clearable = false,
  onClear,
  onOverflowChange,
  searchPlaceholder = "Search options...",
  headerText = null,
  theme = "green",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const portalRef = useRef(null);

  // Get theme-based classes
  const getThemeClasses = () => {
    if (theme === "blue") {
      return {
        chip: "bg-blue-100 dark:bg-blue-500/40 text-blue-700 dark:text-blue-100 border-blue-200 dark:border-blue-400/50",
        chipButton: "text-blue-500 hover:bg-blue-200 dark:text-blue-200 dark:hover:bg-blue-600/60",
        selected: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
        check: "text-blue-500"
      };
    } else {
      return {
        chip: "bg-green-100 dark:bg-green-500/40 text-green-700 dark:text-green-100 border-green-200 dark:border-green-400/50",
        chipButton: "text-green-500 hover:bg-green-200 dark:text-green-200 dark:hover:bg-green-600/60",
        selected: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
        check: "text-green-500"
      };
    }
  };

  const themeClasses = getThemeClasses();

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const label = typeof option === 'string' ? option : option[optionLabel];
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get display value for single select
  const getDisplayValue = () => {
    if (multiple) {
      if (Array.isArray(value) && value.length > 0) {
        // Ensure unique values for display
        const uniqueValues = [...new Set(value)];
        if (showSelectedCount) {
          return `${uniqueValues.length} selected`;
        }
        return uniqueValues.map(v => {
          const option = options.find(opt => 
            (typeof opt === 'string' ? opt : opt[optionKey]) === v
          );
          return typeof option === 'string' ? option : (option ? option[optionLabel] : v);
        }).join(', ');
      }
      return placeholder;
    } else {
      if (value) {
        const option = options.find(opt => 
          (typeof opt === 'string' ? opt : opt[optionKey]) === value
        );
        return typeof option === 'string' ? option : (option ? option[optionLabel] : value);
      }
      return placeholder;
    }
  };


  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      
      // Ensure we have unique values (prevent duplicates)
      const uniqueValues = [...new Set(currentValues)];
      
      if (uniqueValues.includes(optionValue)) {
        // Remove from selection
        const newValues = uniqueValues.filter(v => v !== optionValue);
        onChange(newValues);
      } else {
        // Add to selection (only if not already present)
        const newValues = [...uniqueValues, optionValue];
        onChange(newValues);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle clear action
  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else {
      onChange(multiple ? [] : '');
    }
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const isClickInsidePortal = portalRef.current && portalRef.current.contains(event.target);
      
      if (!isClickInsideDropdown && !isClickInsidePortal) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Check if option is selected
  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between min-h-[48px] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        {...props}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 items-center">
          {multiple && Array.isArray(value) && value.length > 0 ? (
            // Show selected items as chips for multiple select (ensure unique values)
            [...new Set(value)].map((val, index) => {
              const option = options.find(opt => 
                (typeof opt === 'string' ? opt : opt[optionKey]) === val
              );
              const label = typeof option === 'string' ? option : (option ? option[optionLabel] : val);
              return (
                <span
                  key={`${val}-${index}`}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border ${themeClasses.chip}`}
                >
                  {label}
                  <Tooltip content={`Remove ${label}`} position="top">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(val);
                    }}
                    className={`ml-1 p-0.5 ${themeClasses.chipButton} rounded transition-colors duration-200`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  </Tooltip>
                </span>
              );
            })
          ) : (
            <span className={getDisplayValue() === placeholder ? 'text-gray-500 dark:text-gray-400' : ''}>
              {getDisplayValue()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={portalRef}
          className="absolute z-[9999] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg"
          style={{
            top: '100%',
            left: 0,
            width: '100%',
            height: 'auto',
            overflow: 'auto',
            maxHeight: '300px'
          }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <span>{headerText || (multiple ? 'Choose Options' : 'Choose Option')}</span>
            {multiple && Array.isArray(value) && value.length > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                {[...new Set(value)].length} selected
              </span>
            )}
          </div>

          {/* Options List */}
          <div className={`overflow-y-auto searchable-dropdown-scroll`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const optionValue = typeof option === 'string' ? option : option[optionKey];
                const optionLabelText = typeof option === 'string' ? option : option[optionLabel];
                const selected = isSelected(optionValue);
                
                return (
                  <Tooltip content={selected ? `Click to remove ${optionLabelText}` : `Select ${optionLabelText}`} position="top">
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => handleOptionSelect(optionValue)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center justify-between ${
                      selected 
                        ? `${themeClasses.selected} cursor-pointer`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                    } ${selected ? 'ring-2 ring-opacity-50' : ''} ${
                      theme === 'blue' && selected ? 'ring-blue-300 dark:ring-blue-600' : 
                      theme === 'green' && selected ? 'ring-green-300 dark:ring-green-600' : ''
                    }`}
                  >
                    <span>{optionLabelText}</span>
                    {selected && (
                      <Check className={`w-4 h-4 ${themeClasses.check}`} />
                    )}
                  </button>
                  </Tooltip>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchableDropdown;
