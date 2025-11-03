import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * BatchTableHeader - Reusable component for table header with sorting
 * @param {Object} props - Component props
 * @param {string} props.columnKey - Column key for sorting
 * @param {string} props.label - Column label
 * @param {Object} props.sortConfig - Current sort configuration
 * @param {Function} props.onSort - Sort handler function
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Table header cell component
 */
const BatchTableHeader = ({ columnKey, label, sortConfig, onSort, className = '' }) => {
  const getSortIcon = () => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const handleSort = () => {
    onSort(columnKey);
  };

  return (
    <th className={`px-3 py-2 text-left whitespace-nowrap ${className}`}>
      <button
        onClick={handleSort}
        className="flex items-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {getSortIcon()}
      </button>
    </th>
  );
};

export default BatchTableHeader;
