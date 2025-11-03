import React from 'react';
import BatchStatus from './BatchStatus';
import BatchActions from './BatchActions';

/**
 * BatchTableRow - Reusable component for batch table row
 * @param {Object} props - Component props
 * @param {Object} props.batch - Batch data object
 * @param {number} props.index - Row index for serial number
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {Function} props.formatDate - Date formatting function
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Table row component
 */
const BatchTableRow = ({ 
  batch, 
  index, 
  onEdit, 
  onDelete, 
  formatDate,
  className = '' 
}) => {
  return (
    <tr
      key={batch.id}
      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${className}`}
    >
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
        {batch.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {formatDate(batch.startDate)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {formatDate(batch.endDate)}
      </td>
      <td className="px-4 py-3">
        <BatchStatus isActive={batch.isActive} />
      </td>
      <td className="px-4 py-3">
        <BatchActions 
          batch={batch}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default BatchTableRow;
