import { useState, useMemo } from 'react';

/**
 * useTable - Custom hook for table functionality (search, sort, pagination)
 * @param {Array} data - Array of data objects
 * @param {Array} searchFields - Fields to search in
 * @param {Object} options - Additional options
 * @returns {Object} Table state and handlers
 */
export const useTable = (data = [], searchFields = [], options = {}) => {
  const {
    initialPageSize = 10,
    initialSortKey = null,
    initialSortDirection = 'asc'
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ 
    key: initialSortKey, 
    direction: initialSortDirection 
  });

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (Array.isArray(value)) {
            return value.some(v => 
              String(v).toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (Array.isArray(aValue)) {
          aValue = aValue.join(', ');
          bValue = bValue.join(', ');
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, searchFields]);

  // Pagination logic
  const totalPages = entriesPerPage === -1 ? 1 : Math.ceil(filteredAndSortedData.length / entriesPerPage);
  const startIndex = entriesPerPage === -1 ? 0 : (currentPage - 1) * entriesPerPage;
  const endIndex = entriesPerPage === -1 ? filteredAndSortedData.length : startIndex + entriesPerPage;
  const currentData = entriesPerPage === -1 ? filteredAndSortedData : filteredAndSortedData.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  const resetTable = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setSortConfig({ key: null, direction: 'asc' });
  };

  return {
    // State
    searchTerm,
    entriesPerPage,
    currentPage,
    sortConfig,
    filteredAndSortedData,
    currentData,
    totalPages,
    startIndex,
    endIndex,
    
    // Handlers
    setSearchTerm,
    handleSort,
    handlePageChange,
    handleEntriesChange,
    resetTable
  };
};

export default useTable;
