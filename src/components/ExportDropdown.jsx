import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

/**
 * Get default title for export based on data type
 * @param {string} dataType - Type of data
 * @returns {string} Default title
 */
const getDefaultTitle = (dataType) => {
  const titleMap = {
    'subjects': 'Subjects list',
    'teachers': 'Teachers list',
    'batches': 'Batches list',
    'courses': 'Courses list',
    'sections': 'Sections list',
    'classrooms': 'Classrooms list'
  };
  
  return titleMap[dataType] || `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Export`;
};

/**
 * ExportDropdown - Reusable export dropdown component
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to export
 * @param {string} props.dataType - Type of data (e.g., 'subjects', 'teachers', 'batches')
 * @param {Array} props.columns - Column configuration for export
 * @param {string} props.filename - Custom filename (optional)
 * @param {string} props.title - Title for PDF export (optional)
 * @param {Function} props.onExportPDF - Custom PDF export handler (optional)
 * @param {Function} props.onExportCSV - Custom CSV export handler (optional)
 * @param {Function} props.onExportExcel - Custom Excel export handler (optional)
 * @param {Function} props.onExportSuccess - Success callback
 * @param {Function} props.onExportError - Error callback
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.buttonText - Button text (default: 'Export')
 * @param {string} props.buttonVariant - Button style variant ('purple', 'blue', 'green', 'gray')
 * @returns {JSX.Element} ExportDropdown component
 */
const ExportDropdown = ({
  data = [],
  dataType = 'data',
  columns = [],
  filename,
  title,
  onExportPDF,
  onExportCSV,
  onExportExcel,
  onExportSuccess,
  onExportError,
  className = '',
  buttonText = 'Export',
  buttonVariant = 'purple'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Button variant styles
  const buttonVariants = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    gray: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
  };

  // Generate filename and title
  const exportFilename = filename || `${dataType}_export_${new Date().toISOString().split('T')[0]}`;
  const exportTitle = title || getDefaultTitle(dataType);

  // Default export handlers using utility functions
  const defaultExportPDF = useCallback(async () => {
    try {
      exportToPDF(data, exportFilename, columns, exportTitle);
      onExportSuccess?.(`Successfully exported ${data.length} ${dataType} to PDF!`);
    } catch (error) {
      onExportError?.(`Error exporting PDF: ${error.message}`);
      throw error;
    }
  }, [data, dataType, columns, exportFilename, exportTitle, onExportSuccess, onExportError]);

  const defaultExportCSV = useCallback(async () => {
    try {
      exportToCSV(data, exportFilename, columns);
      onExportSuccess?.(`Successfully exported ${data.length} ${dataType} to CSV!`);
    } catch (error) {
      onExportError?.(`Error exporting CSV: ${error.message}`);
      throw error;
    }
  }, [data, dataType, columns, exportFilename, onExportSuccess, onExportError]);

  const defaultExportExcel = useCallback(async () => {
    try {
      exportToExcel(data, exportFilename, columns);
      onExportSuccess?.(`Successfully exported ${data.length} ${dataType} to Excel!`);
    } catch (error) {
      onExportError?.(`Error exporting Excel: ${error.message}`);
      throw error;
    }
  }, [data, dataType, columns, exportFilename, onExportSuccess, onExportError]);

  // Use custom handlers or defaults
  const handleExportPDF = onExportPDF || defaultExportPDF;
  const handleExportCSV = onExportCSV || defaultExportCSV;
  const handleExportExcel = onExportExcel || defaultExportExcel;

  // Handle export click
  const handleExportClick = useCallback(async (format) => {
    setIsOpen(false);
    
    try {
      switch (format) {
        case 'pdf':
          await handleExportPDF();
          break;
        case 'csv':
          await handleExportCSV();
          break;
        case 'excel':
          await handleExportExcel();
          break;
        default:
          console.warn(`Unknown export format: ${format}`);
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  }, [handleExportPDF, handleExportCSV, handleExportExcel]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${buttonVariants[buttonVariant]}`}
        aria-label={`Export ${dataType}`}
      >
        <FileText className="w-5 h-5" />
        {buttonText}
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            <button
              onClick={() => handleExportClick('pdf')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <FileText className="w-4 h-4 text-red-500" />
              <span className="font-medium">Export as PDF</span>
            </button>
            <button
              onClick={() => handleExportClick('csv')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-500" />
              <span className="font-medium">Export as CSV</span>
            </button>
            <button
              onClick={() => handleExportClick('excel')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <FileDown className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Export as Excel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
