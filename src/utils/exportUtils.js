/**
 * Export utility functions for DataTable data
 */
import * as XLSX from 'xlsx';

/**
 * Extract value from column render function for export
 * @param {Object} item - Data item
 * @param {Object} column - Column configuration
 * @param {string} key - Column key
 * @param {Array} data - Full data array
 * @param {number} currentIndex - Current item index
 * @returns {string} Extracted value
 */
const getRenderFunctionValue = (item, column, key, data = [], currentIndex = 0) => {
  // Handle ID column (S.No.) - show sequential number based on position in filtered data
  // This ensures exports show 1, 2, 3... instead of original IDs (5, 8, etc.)
  if (key === 'id') {
    // Use currentIndex + 1 for sequential numbering in exports
    // currentIndex is already 0-based, so add 1 for S.No.
    return String(currentIndex + 1);
  }
  
  // Handle name column with optional code
  if (key === 'name') {
    if (item.code) {
      return `${item.name} (${item.code})`;
    }
    return item.name || '';
  }
  
  // Handle subject type column
  if (key === 'type') {
    if (item.isOptional) return 'Optional';
    if (item.isAdditional) return 'Additional';
    return 'Core';
  }
  
  // Handle status columns (both 'status' and 'isActive')
  if (key === 'status') {
    return item.status ? 'Active' : 'Inactive';
  }
  
  if (key === 'isActive') {
    return item.isActive ? 'Active' : 'Inactive';
  }
  
  // Handle credit hours column
  if (key === 'creditHours') {
    return `${item.creditHours} hrs`;
  }
  
  // Handle date columns (startDate, endDate, etc.)
  if (key === 'startDate' || key === 'endDate' || key.includes('Date')) {
    if (item[key]) {
      // For dates in YYYY-MM-DD format, return as is
      const dateStr = String(item[key]);
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr;
      }
      
      // Try to parse and format the date
      const date = new Date(item[key]);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
      }
      
      return dateStr;
    }
    return '';
  }
  
  // Handle boolean columns
  if (typeof item[key] === 'boolean') {
    return item[key] ? 'Yes' : 'No';
  }
  
  // Handle numeric columns
  if (typeof item[key] === 'number') {
    return String(item[key]);
  }
  
  // Handle array columns
  if (Array.isArray(item[key])) {
    return item[key].join(', ');
  }
  
  // Handle object columns
  if (typeof item[key] === 'object' && item[key] !== null) {
    return JSON.stringify(item[key]);
  }
  
  // Default: return the raw value as string
  return String(item[key] || '');
};

/**
 * Export data to CSV format with enhanced data handling
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column configuration array
 */
export const exportToCSV = (data, filename = 'export', columns = []) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // Get column keys and labels, excluding Actions column
    const columnKeys = columns.length > 0 
      ? columns.map(col => col.key).filter(key => key && key !== 'actions')
      : Object.keys(data[0]).filter(key => key !== 'actions');
    
    const columnLabels = columns.length > 0
      ? columns.map(col => col.label || col.key).filter((label, index) => columns[index].key !== 'actions')
      : columnKeys;

    // Create CSV header with proper escaping
    const headers = columnLabels.map(label => {
      const cleanLabel = String(label || '').replace(/"/g, '""');
      return cleanLabel.includes(',') || cleanLabel.includes('\n') || cleanLabel.includes('"') 
        ? `"${cleanLabel}"` 
        : cleanLabel;
    }).join(',');
    
    // Create CSV rows with enhanced data handling
    const rows = data.map((item, itemIndex) => {
      return columnKeys.map((key, index) => {
        let value;
        
        // Check if column has a custom render function
        const column = columns.find(col => col.key === key);
        if (column && column.render && typeof column.render === 'function') {
          // Use our enhanced render function value extractor
          value = getRenderFunctionValue(item, column, key, data, itemIndex);
        } else {
          // Use direct property access with fallback
          value = item[key];
        }
        
        // Convert value to string and handle special cases
        let stringValue = '';
        
        if (value === null || value === undefined) {
          stringValue = '';
        } else if (Array.isArray(value)) {
          stringValue = value.join('; ');
        } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value);
        } else if (typeof value === 'boolean') {
          stringValue = value ? 'Yes' : 'No';
        } else {
          stringValue = String(value);
        }
        
        // Clean and escape the string value
        const cleanValue = stringValue.replace(/"/g, '""');
        
        // Quote the value if it contains special characters
        if (cleanValue.includes(',') || cleanValue.includes('\n') || cleanValue.includes('"') || cleanValue.includes('\r')) {
          return `"${cleanValue}"`;
        }
        
        return cleanValue;
      }).join(',');
    });

    // Combine header and rows with proper line endings
    const csvContent = [headers, ...rows].join('\r\n');
    
    // Create and download file with BOM for proper UTF-8 encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`CSV exported: ${data.length} records with ${columnKeys.length} columns`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

/**
 * Export data to Excel format (XLSX) with enhanced data handling
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column configuration array
 */
export const exportToExcel = (data, filename = 'export', columns = []) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // Get column keys and labels, excluding Actions column
    const columnKeys = columns.length > 0 
      ? columns.map(col => col.key).filter(key => key && key !== 'actions')
      : Object.keys(data[0]).filter(key => key !== 'actions');
    
    const columnLabels = columns.length > 0
      ? columns.map(col => col.label || col.key).filter((label, index) => columns[index].key !== 'actions')
      : columnKeys;

    // Prepare data for Excel with enhanced formatting
    const excelData = data.map((item, itemIndex) => {
      const row = {};
      columnKeys.forEach((key, index) => {
        let value;
        
        // Check if column has a custom render function
        const column = columns.find(col => col.key === key);
        if (column && column.render && typeof column.render === 'function') {
          value = getRenderFunctionValue(item, column, key, data, itemIndex);
        } else {
          value = item[key];
        }
        
        // Convert value to appropriate format for Excel
        let excelValue = '';
        
        if (value === null || value === undefined) {
          excelValue = '';
        } else if (Array.isArray(value)) {
          excelValue = value.join('; ');
        } else if (typeof value === 'object') {
          excelValue = JSON.stringify(value);
        } else if (typeof value === 'boolean') {
          excelValue = value ? 'Yes' : 'No';
        } else if (typeof value === 'number') {
          excelValue = value;
        } else {
          excelValue = String(value);
        }
        
        // Use column label as header
        const header = columnLabels[index] || key;
        row[header] = excelValue;
      });
      return row;
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const colWidths = columnLabels.map(label => {
      const maxLength = Math.max(
        label.length,
        ...excelData.map(row => String(row[label] || '').length)
      );
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Generate Excel file and download
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true
    });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Excel exported: ${data.length} records with ${columnKeys.length} columns`);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    throw error;
  }
};

/**
 * Export data to PDF format (HTML) with enhanced data handling
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column configuration array
 * @param {string} title - Title for the PDF
 */
export const exportToPDF = (data, filename = 'export', columns = [], title = 'Data Export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // Get column keys and labels, excluding Actions column
    const columnKeys = columns.length > 0 
      ? columns.map(col => col.key).filter(key => key && key !== 'actions')
      : Object.keys(data[0]).filter(key => key !== 'actions');
    
    const columnLabels = columns.length > 0
      ? columns.map(col => col.label || col.key).filter((label, index) => columns[index].key !== 'actions')
      : columnKeys;

    // Create HTML table with enhanced styling
    const tableRows = data.map((item, itemIndex) => 
      `<tr>${columnKeys.map((key, index) => {
        let value;
        
        // Check if column has a custom render function
        const column = columns.find(col => col.key === key);
        if (column && column.render && typeof column.render === 'function') {
          value = getRenderFunctionValue(item, column, key, data, itemIndex);
        } else {
          value = item[key];
        }
        
        // Convert value to display format
        let displayValue = '';
        if (value === null || value === undefined) {
          displayValue = '';
        } else if (Array.isArray(value)) {
          displayValue = value.join(', ');
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value);
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Yes' : 'No';
        } else {
          displayValue = String(value);
        }
        
        // Escape HTML characters
        const escapedValue = displayValue
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        
        return `<td>${escapedValue}</td>`;
      }).join('')}</tr>`
    ).join('');

    const tableHeaders = columnLabels.map(label => {
      const escapedLabel = String(label || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `<th>${escapedLabel}</th>`;
    }).join('');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              background-color: #f8f9fa;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { 
              color: #2c3e50; 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 3px solid #3498db;
              padding-bottom: 15px;
            }
            .export-info { 
              margin-bottom: 25px; 
              text-align: center; 
              color: #7f8c8d;
              background-color: #ecf0f1;
              padding: 15px;
              border-radius: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 14px;
            }
            th, td { 
              border: 1px solid #bdc3c7; 
              padding: 12px 8px; 
              text-align: left; 
            }
            th { 
              background-color: #34495e; 
              color: white;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            tr:hover {
              background-color: #e8f4f8;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #95a5a6;
              font-size: 12px;
              border-top: 1px solid #ecf0f1;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <div class="export-info">
              <strong>Export Details:</strong><br>
              Generated on: ${new Date().toLocaleString()}<br>
              Total Records: ${data.length} | Columns: ${columnKeys.length}
            </div>
            <table>
              <thead>
                <tr>${tableHeaders}</tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <div class="footer">
              Generated by Blackboard Admin System
            </div>
          </div>
        </body>
      </html>
    `;

    // Create and download file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`PDF exported: ${data.length} records with ${columnKeys.length} columns`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

/**
 * Get filtered data from DataTable
 * @param {Array} data - Original data array
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @param {Object} activeFilters - Active filters
 * @param {Array} filterConfig - Filter configuration
 * @returns {Array} Filtered data
 */
export const getFilteredData = (data, searchTerm = '', searchFields = [], activeFilters = {}, filterConfig = []) => {
  let filtered = [...data];

  // Apply search filter
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

  // Apply custom filters
  if (filterConfig.length > 0) {
    filterConfig.forEach(filter => {
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

  return filtered;
};
