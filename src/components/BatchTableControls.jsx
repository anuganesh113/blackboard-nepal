import React from 'react';
import { Search } from 'lucide-react';

/**
 * BatchTableControls - Reusable component for table controls (search and entries per page)
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Search change handler
 * @param {number} props.entriesPerPage - Current entries per page
 * @param {Function} props.onEntriesChange - Entries per page change handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Table controls component
 */
const BatchTableControls = ({ 
  searchTerm, 
  onSearchChange, 
  entriesPerPage, 
  onEntriesChange,
  className = '' 
}) => {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleEntriesChange = (e) => {
    onEntriesChange(Number(e.target.value));
  };

  return (
    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Show Entries */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 dark:text-gray-300 font-medium">
            Show
          </label>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Entries per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={-1}>All</option>
          </select>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            entries
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
            Search:
          </label>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search batches..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Search batches"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchTableControls;
