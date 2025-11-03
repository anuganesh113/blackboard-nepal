/**
 * Table utility functions for common DataTable patterns
 */

/**
 * Get sequential S.No. based on position in filtered/sorted data
 * This ensures S.No. shows 1, 2, 3... based on filtered table position,
 * not the original ID, regardless of filtering, sorting, or pagination
 * 
 * @param {Object} item - Current table row item
 * @param {Object} column - Column configuration
 * @param {number} index - Index in current page (0-based)
 * @param {Array} allData - All filtered/sorted data (not paginated)
 * @returns {JSX.Element} Rendered S.No. cell
 * 
 * Usage in column definition:
 * {
 *   key: 'id',
 *   label: 'S.No.',
 *   sortable: true,
 *   render: getSequentialSerialNumber
 * }
 */
export const getSequentialSerialNumber = (item, column, index, allData) => {
  // Use position in filtered data for sequential numbering
  // allData is the filtered/sorted array (without pagination)
  const actualIndex = allData ? allData.indexOf(item) : index;
  return <span className="text-sm text-gray-900 dark:text-gray-100">{actualIndex + 1}</span>;
};

