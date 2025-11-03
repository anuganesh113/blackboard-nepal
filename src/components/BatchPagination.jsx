import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * BatchPagination - Reusable component for table pagination
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.startIndex - Start index of current page
 * @param {number} props.endIndex - End index of current page
 * @param {number} props.totalEntries - Total number of entries
 * @param {Function} props.onPageChange - Page change handler
 * @param {boolean} props.showPagination - Whether to show pagination controls
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Pagination component
 */
const BatchPagination = ({ 
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalEntries,
  onPageChange,
  showPagination = true,
  className = '' 
}) => {
  if (!showPagination) {
    return null;
  }

  // If only one page, show just the info without pagination controls
  if (totalPages <= 1) {
    return (
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of{' '}
            {totalEntries} entries
          </div>
        </div>
      </div>
    );
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of{' '}
          {totalEntries} entries
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageClick(i + 1)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === i + 1
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
              }`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchPagination;
