import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Tooltip from './Tooltip';

/**
 * BatchActions - Reusable component for batch action buttons
 * @param {Object} props - Component props
 * @param {Object} props.batch - Batch data object
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Action buttons component
 */
const BatchActions = ({ batch, onEdit, onDelete, className = '' }) => {
  const handleEdit = () => {
    onEdit(batch);
  };

  const handleDelete = () => {
    onDelete(batch);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Tooltip content="Edit" position="top">
        <button
          onClick={handleEdit}
          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
          aria-label={`Edit ${batch.name}`}
        >
          <Edit className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Delete" position="top">
        <button
          onClick={handleDelete}
          className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
          aria-label={`Delete ${batch.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
};

export default BatchActions;
