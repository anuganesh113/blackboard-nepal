import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  BookOpen
} from 'lucide-react';
import Tooltip from '../Tooltip';

/**
 * DataTable - Highly reusable data table component
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects
 * @param {Array} props.columns - Column configuration array
 * @param {Object} props.searchConfig - Search configuration
 * @param {Object} props.paginationConfig - Pagination configuration
 * @param {Object} props.filterConfig - Filter configuration
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {Function} props.onView - View handler function
 * @param {Object} props.customActions - Custom action buttons
 * @param {string} props.emptyMessage - Message when no data
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.tableProps - Additional table props
 * @param {Object} props.theadProps - Additional thead props
 * @param {Object} props.tbodyProps - Additional tbody props
 * @param {Function} props.onFilteredDataChange - Callback to receive filtered data for export
 * @returns {JSX.Element} DataTable component
 */
const DataTable = ({
  data = [],
  columns = [],
  searchConfig = {},
  paginationConfig = {},
  filterConfig = {},
  onEdit,
  onDelete,
  onView,
  customActions = {},
  emptyMessage = 'No data found',
  className = '',
  tableProps = {},
  theadProps = {},
  tbodyProps = {},
  checkboxConfig = {},
  onFilteredDataChange,
  ...rest
}) => {
  // Default configurations - memoized to prevent infinite loops
  const defaultSearchConfig = useMemo(() => ({
    placeholder: 'Search...',
    searchFields: [],
    onSearch: () => { },
    ...searchConfig
  }), [searchConfig]);

  const defaultPaginationConfig = useMemo(() => ({
    entriesPerPage: 10,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [5, 10, 25, 50, 100, -1],
    ...paginationConfig
  }), [paginationConfig]);

  const defaultFilterConfig = useMemo(() => ({
    showFilters: false,
    filters: [],
    ...filterConfig
  }), [filterConfig]);

  // Internal state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState(defaultPaginationConfig.entriesPerPage);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [activeFilters, setActiveFilters] = React.useState({});
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply custom filters
    if (defaultFilterConfig.showFilters && defaultFilterConfig.filters.length > 0) {
      defaultFilterConfig.filters.forEach(filter => {
        if (activeFilters[filter.key] && activeFilters[filter.key] !== 'all') {
          filtered = filtered.filter(item => {
            if (filter.filterFn) {
              return filter.filterFn(item, activeFilters[filter.key]);
            }
            // Default filter logic
            const value = item[filter.key];
            if (filter.type === 'boolean') {
              return value === (activeFilters[filter.key] === 'true');
            }
            if (filter.type === 'select') {
              return value === activeFilters[filter.key];
            }
            return true;
          });
        }
      });
    }

    // Search filter
    if (searchTerm && defaultSearchConfig.searchFields.length > 0) {
      filtered = filtered.filter(item =>
        defaultSearchConfig.searchFields.some(field => {
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

        // Handle numeric values (including ID) - proper numerical sorting
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Handle string values with proper alphabetical sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const result = aValue.localeCompare(bValue, undefined, { 
            numeric: true, 
            sensitivity: 'base',
            ignorePunctuation: true 
          });
          return sortConfig.direction === 'asc' ? result : -result;
        }

        // Handle arrays
        if (Array.isArray(aValue)) {
          aValue = aValue.join(', ');
        }
        if (Array.isArray(bValue)) {
          bValue = bValue.join(', ');
        }

        // Convert to strings for comparison
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();

        if (aStr < bStr) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, activeFilters, defaultSearchConfig.searchFields, defaultFilterConfig]);

  // Expose filtered data to parent component for export
  // Use ref to track previous data and prevent infinite loops
  const prevFilteredDataRef = useRef();
  const onFilteredDataChangeRef = useRef(onFilteredDataChange);
  
  // Keep ref updated with latest callback
  useEffect(() => {
    onFilteredDataChangeRef.current = onFilteredDataChange;
  }, [onFilteredDataChange]);

  useEffect(() => {
    // Only call if data reference actually changed (useMemo handles content comparison)
    const prevData = prevFilteredDataRef.current;
    if (prevData !== filteredAndSortedData) {
      if (onFilteredDataChangeRef.current && typeof onFilteredDataChangeRef.current === 'function') {
        onFilteredDataChangeRef.current(filteredAndSortedData);
      }
      prevFilteredDataRef.current = filteredAndSortedData;
    }
  }, [filteredAndSortedData]);

  // Pagination logic
  const totalPages = entriesPerPage === -1 ? 1 : Math.ceil(filteredAndSortedData.length / entriesPerPage);
  const startIndex = entriesPerPage === -1 ? 0 : (currentPage - 1) * entriesPerPage;
  const endIndex = entriesPerPage === -1 ? filteredAndSortedData.length : startIndex + entriesPerPage;
  const currentData = entriesPerPage === -1 ? filteredAndSortedData : filteredAndSortedData.slice(startIndex, endIndex);

  // Handlers
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleEntriesChange = useCallback((newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    defaultSearchConfig.onSearch(value);
  }, [defaultSearchConfig]);

  const handleFilterChange = useCallback((filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  }, [sortConfig]);

  const renderCellContent = useCallback((item, column) => {
    if (column.render) {
      const content = column.render(item, column, currentData.indexOf(item), filteredAndSortedData);
      // Wrap content in a center-aligned container
      return (
        <div className="flex justify-center items-center">
          {content}
        </div>
      );
    }
    return (
      <div className="text-center">
        {item[column.key] || ''}
      </div>
    );
  }, [currentData, filteredAndSortedData]);

  // Check if there are any action buttons
  const hasActions = onEdit || onDelete || onView || Object.keys(customActions).length > 0;

  return (
    <div className={`bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 ${className}`}>
      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300">
        {/* Controls Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            {/* Top Row: Entries, Filter Button, and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               {/* Show Entries */}
               {defaultPaginationConfig.showEntriesSelector && (
                 <div className="flex items-center gap-3">
                   <label className="text-gray-700 dark:text-gray-300 font-medium">
                     Show
                   </label>
                   <Tooltip content="Select number of entries to display per page" position="top">
                     <select
                       value={entriesPerPage}
                       onChange={(e) => handleEntriesChange(Number(e.target.value))}
                       className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                       aria-label="Entries per page"
                     >
                       {defaultPaginationConfig.entriesOptions.map(option => (
                         <option key={option} value={option}>
                           {option === -1 ? 'All' : option}
                         </option>
                       ))}
                     </select>
                   </Tooltip>
                   <span className="text-gray-700 dark:text-gray-300 font-medium">
                     entries
                   </span>
                 </div>
               )}

              {/* Filter Button and Search */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Enhanced Filter Button */}
                {defaultFilterConfig.showFilters && defaultFilterConfig.filters.length > 0 && (
                  <Tooltip content="Toggle filters" position="top">
                    <button
                      onClick={toggleFilters}
                      className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                        showFilters
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border-2 border-blue-400'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-lg'
                      }`}
                      aria-label="Toggle filters"
                    >
                      {/* Animated background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        showFilters ? 'opacity-100' : ''
                      }`} />
                      
                      {/* Filter icon with animation */}
                      <div className="relative z-10 flex items-center justify-center">
                        <Filter className={`w-4 h-4 transition-all duration-300 ${
                          showFilters ? 'rotate-180 scale-110' : 'group-hover:rotate-12 group-hover:scale-110'
                        }`} />
                      </div>
                      
                      {/* Button text */}
                      <span className="relative z-10 font-medium tracking-wide">
                        Filters
                      </span>
                      
                      {/* Active filter indicator */}
                      {Object.values(activeFilters).some(filter => filter && filter !== 'all') && (
                        <div className="relative z-10 flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse shadow-lg" />
                          <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75" />
                        </div>
                      )}
                      
                      {/* Sparkle effect when active */}
                      {showFilters && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75" />
                      )}
                      
                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        showFilters 
                          ? 'bg-gradient-to-r from-blue-400/20 to-indigo-500/20' 
                          : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
                      }`} />
                    </button>
                  </Tooltip>
                )}

          {/* Search */}
                <div className="flex items-center gap-3 flex-1 md:flex-none">
                  <Tooltip content="Search across table data" position="top">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
                        placeholder={defaultSearchConfig.placeholder}
              value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        aria-label="Search"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
          </div>

            {/* Collapsible Filters Row */}
            {defaultFilterConfig.showFilters && defaultFilterConfig.filters.length > 0 && showFilters && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Options:</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {defaultFilterConfig.filters.map((filter) => (
                    <div key={filter.key} className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {filter.label}:
                      </label>
                      <Tooltip content={filter.tooltip || `Filter by ${filter.label}`} position="top">
              <select
                          value={activeFilters[filter.key] || 'all'}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          aria-label={`Filter by ${filter.label}`}
                        >
                          <option value="all">{filter.allLabel || `All ${filter.label}`}</option>
                          {filter.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
              </select>
                      </Tooltip>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
        <div className="relative max-h-96 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
          <table className="w-full" {...tableProps}>
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-20 shadow-sm border-b border-gray-200 dark:border-gray-700" {...theadProps}>
            <tr>
              {columns.map((column, index) => (
                   <th key={column.key || index} className="px-3 py-3 text-center whitespace-nowrap">
                     {column.key === 'checkbox' ? (
                       <input
                         type="checkbox"
                         checked={checkboxConfig.isAllSelected || false}
                         ref={(el) => {
                           if (el) {
                             el.indeterminate = checkboxConfig.isIndeterminate || false;
                           }
                         }}
                         onChange={(e) => checkboxConfig.onSelectAll?.(e.target.checked)}
                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                       />
                     ) : column.sortable !== false ? (
                       <Tooltip 
                         content={`Click to sort by ${column.label}`} 
                         position="top"
                       >
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center justify-center gap-1.5 font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 mx-auto"
                           aria-label={`Sort by ${column.label}`}
                    >
                           {column.label}
                      {getSortIcon(column.key)}
                    </button>
                       </Tooltip>
                  ) : (
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300 text-center block">
                         {column.label}
                    </span>
                  )}
                </th>
              ))}
                {hasActions && (
                <th className="px-3 py-2 text-center whitespace-nowrap">
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Action
                  </span>
                </th>
              )}
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800" {...tbodyProps}>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                     {hasActions && (
                       <td className="px-4 py-3 text-center">
                         <div className="flex items-center justify-center gap-1">
                        {onView && (
                             <Tooltip content="View" position="top">
                          <button
                            onClick={() => onView(item)}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                                 aria-label={`View ${item.name || item.title || 'item'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                             </Tooltip>
                        )}
                        {onEdit && (
                             <Tooltip content="Edit" position="top">
                          <button
                            onClick={() => onEdit(item)}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                                 aria-label={`Edit ${item.name || item.title || 'item'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                             </Tooltip>
                        )}
                        {onDelete && (
                             <Tooltip content="Delete" position="top">
                          <button
                            onClick={() => onDelete(item)}
                                 className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                 aria-label={`Delete ${item.name || item.title || 'item'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                             </Tooltip>
                        )}
                        {Object.entries(customActions).map(([key, action]) => (
                             <Tooltip 
                               key={key}
                               content={action.title || key} 
                               position="top"
                             >
                          <button
                            onClick={() => action.handler(item)}
                                 className={`p-1.5 ${action.className || 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-lg transition-all duration-200`}
                                 aria-label={action.title || key}
                          >
                            {action.icon}
                          </button>
                             </Tooltip>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                    {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
        {defaultPaginationConfig.showPagination && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of{' '}
                {filteredAndSortedData.length} entries
            </div>
            
               {/* Pagination Controls */}
               {totalPages > 1 && (
            <div className="flex items-center gap-2">
                   <Tooltip content="Previous page" position="top">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                       className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${currentPage === 1
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                           : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                         }`}
                       aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
                   </Tooltip>

                   {[...Array(totalPages)].map((_, i) => (
                     <Tooltip 
                       key={i + 1}
                       content={`Go to page ${i + 1}`} 
                       position="top"
                     >
                    <button
                         onClick={() => handlePageChange(i + 1)}
                         className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === i + 1
                             ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                             : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                           }`}
                         aria-label={`Go to page ${i + 1}`}
                       >
                         {i + 1}
                    </button>
                     </Tooltip>
                   ))}
              
                   <Tooltip content="Next page" position="top">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                       className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${currentPage === totalPages
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                           : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                         }`}
                       aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
                   </Tooltip>
                 </div>
               )}
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default DataTable;
