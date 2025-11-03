# Export Functionality Guide

## Overview
The export functionality provides a reusable way to export DataTable data in multiple formats (PDF, CSV, Excel) across all pages in the application.

## Components

### 1. ExportDropdown Component
**Location**: `src/components/ExportDropdown.jsx`

A reusable dropdown component that provides export options for any data.

#### Props
```javascript
<ExportDropdown
  data={Array}                    // Required: Data to export
  dataType={string}              // Required: Type of data (e.g., 'subjects', 'teachers')
  columns={Array}                // Optional: Column configuration for export
  filename={string}              // Optional: Custom filename (auto-generated if not provided)
  title={string}                 // Optional: Title for PDF export
  onExportPDF={Function}         // Optional: Custom PDF export handler
  onExportCSV={Function}         // Optional: Custom CSV export handler
  onExportExcel={Function}       // Optional: Custom Excel export handler
  onExportSuccess={Function}     // Optional: Success callback
  onExportError={Function}       // Optional: Error callback
  className={string}             // Optional: Additional CSS classes
  buttonText={string}            // Optional: Button text (default: 'Export')
  buttonVariant={string}         // Optional: Button style ('purple', 'blue', 'green', 'gray')
/>
```

### 2. Export Utilities
**Location**: `src/utils/exportUtils.js`

Utility functions that handle the actual export logic.

#### Functions
- `exportToCSV(data, filename, columns)` - Export data to CSV format
- `exportToExcel(data, filename, columns)` - Export data to Excel format
- `exportToPDF(data, filename, columns, title)` - Export data to PDF format
- `getFilteredData(data, searchTerm, searchFields, activeFilters, filterConfig)` - Get filtered data

## Usage Examples

### Basic Usage
```javascript
import ExportDropdown from '../components/ExportDropdown';

// Basic export with default handlers
<ExportDropdown
  data={myData}
  dataType="myData"
/>
```

### Advanced Usage with Custom Handlers
```javascript
import ExportDropdown from '../components/ExportDropdown';

const handleExportSuccess = (message) => {
  setToast({ isVisible: true, message, type: 'success' });
};

const handleExportError = (message) => {
  setToast({ isVisible: true, message, type: 'error' });
};

// Custom export handlers
const handleCustomPDF = async () => {
  // Custom PDF logic
  await customPDFExport(data);
  handleExportSuccess('Custom PDF export completed!');
};

<ExportDropdown
  data={filteredData}
  dataType="subjects"
  columns={columnConfig}
  onExportPDF={handleCustomPDF}
  onExportSuccess={handleExportSuccess}
  onExportError={handleExportError}
  buttonVariant="blue"
  buttonText="Export Subjects"
/>
```

### Column Configuration
```javascript
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];
```

## Implementation in Pages

### 1. Subjects Page
```javascript
// Export callbacks
const handleExportSuccess = useCallback((message) => {
  setToast({ isVisible: true, message, type: 'success' });
}, []);

const handleExportError = useCallback((message) => {
  setToast({ isVisible: true, message, type: 'error' });
}, []);

// In JSX
<ExportDropdown
  data={subjects}
  dataType="subjects"
  columns={columns}
  onExportSuccess={handleExportSuccess}
  onExportError={handleExportError}
  buttonVariant="purple"
/>
```

### 2. Teachers Page
```javascript
// Custom export handlers using existing PDF generator
const handleExportPDF = useCallback(async () => {
  try {
    await downloadTeachersTablePDF(filteredAndSortedTeachers);
    handleExportSuccess(`Successfully exported ${filteredAndSortedTeachers.length} teacher(s) to PDF!`);
  } catch (error) {
    handleExportError('Error exporting PDF. Please try again.');
  }
}, [filteredAndSortedTeachers, handleExportSuccess, handleExportError]);

// In JSX
<ExportDropdown
  data={filteredAndSortedTeachers}
  dataType="teachers"
  columns={teachersColumns}
  onExportPDF={handleExportPDF}
  onExportCSV={handleExportCSV}
  onExportExcel={handleExportExcel}
  onExportSuccess={handleExportSuccess}
  onExportError={handleExportError}
  buttonVariant="purple"
/>
```

### 3. Batches Page
```javascript
// Export callbacks
const handleExportSuccess = useCallback((message) => {
  setToast({ isVisible: true, message, type: 'success' });
}, []);

const handleExportError = useCallback((message) => {
  setToast({ isVisible: true, message, type: 'error' });
}, []);

// In JSX
<ExportDropdown
  data={batches.batches}
  dataType="batches"
  columns={columns}
  onExportSuccess={handleExportSuccess}
  onExportError={handleExportError}
  buttonVariant="purple"
/>
```

## Features

### 1. Automatic File Naming
- Default format: `{dataType}_export_{YYYY-MM-DD}`
- Custom filename can be provided via `filename` prop

### 2. Automatic Title Generation
- **Subjects**: "Subjects list" (instead of "subjects Export")
- **Teachers**: "Teachers list" (instead of "teachers Export")
- **Batches**: "Batches list" (instead of "batches Export")
- **Courses**: "Courses list" (instead of "courses Export")
- **Sections**: "Sections list" (instead of "sections Export")
- **Classrooms**: "Classrooms list" (instead of "classrooms Export")
- **Custom types**: Falls back to "{DataType} Export"

### 3. Multiple Export Formats
- **CSV**: Comma-separated values with proper escaping
- **Excel**: HTML-based Excel format (.xls) with table styling
- **PDF**: HTML-based PDF with table formatting

### 4. Column Configuration
- Supports custom column labels
- Handles complex data types (arrays, objects)
- Proper data formatting for export

### 5. Error Handling
- Try-catch blocks for all export operations
- User-friendly error messages
- Success/error callbacks for custom handling

### 6. Responsive Design
- Consistent styling across all pages
- Multiple button variants
- Smooth animations and transitions

## Button Variants

### Purple (Default)
```javascript
buttonVariant="purple"
// Classes: from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
```

### Blue
```javascript
buttonVariant="blue"
// Classes: from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
```

### Green
```javascript
buttonVariant="green"
// Classes: from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
```

### Gray
```javascript
buttonVariant="gray"
// Classes: from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700
```

## Data Handling

### Supported Data Types
- Strings
- Numbers
- Booleans
- Arrays (joined with '; ')
- Objects (JSON stringified)
- Null/undefined (converted to empty string)
- **Custom Render Functions**: Automatically extracts text from JSX render functions

### Render Function Support
The export utility automatically handles columns with custom render functions by extracting the meaningful text content:

- **Subject Type**: `isOptional` → "Optional", `isAdditional` → "Additional", default → "Core"
- **Status**: `status: true` → "Active", `status: false` → "Inactive"
- **Credit Hours**: `creditHours: 4` → "4 hrs"
- **Name with Code**: `name: "Math", code: "MATH"` → "Math (MATH)"
- **ID**: Direct property access

### CSV Export Features
- Proper quote escaping
- Comma and newline handling
- UTF-8 encoding

### Excel Export Features
- XLSX format
- Proper data formatting
- Column headers

### PDF Export Features
- HTML-based generation
- Table formatting
- Export metadata (date, record count)
- Responsive design

## Best Practices

### 1. Always Provide Column Configuration
```javascript
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  // ... more columns
];

<ExportDropdown
  data={data}
  columns={columns}
  // ... other props
/>
```

### 2. Handle Success and Error States
```javascript
const handleExportSuccess = useCallback((message) => {
  // Show success toast/notification
  setToast({ isVisible: true, message, type: 'success' });
}, []);

const handleExportError = useCallback((message) => {
  // Show error toast/notification
  setToast({ isVisible: true, message, type: 'error' });
}, []);
```

### 3. Use Filtered Data for Export
```javascript
// Export only filtered/visible data
<ExportDropdown
  data={filteredData}  // Not raw data
  // ... other props
/>
```

### 4. Custom Filenames for Different Contexts
```javascript
<ExportDropdown
  data={data}
  filename="subjects_report_2024"
  title="Subjects Report 2024"
  // ... other props
/>
```

## Troubleshooting

### Common Issues

1. **Export not working**
   - Check if data array is not empty
   - Verify column configuration
   - Check browser console for errors

2. **Incorrect data formatting**
   - Ensure column keys match data properties
   - Check data types in column configuration

3. **File not downloading**
   - Check browser popup blockers
   - Verify file permissions
   - Check console for errors

4. **Missing data in exports (e.g., subject type not showing)**
   - **Cause**: Column uses custom render function instead of direct data property
   - **Solution**: The export utility automatically handles this by extracting text from render functions
   - **Verification**: Check that columns with `render` functions are properly configured
   - **Example**: Subject type column uses `isOptional` and `isAdditional` properties to determine "Optional", "Additional", or "Core"

5. **Excel file cannot be opened ("file format or file extension is not valid")**
   - **Cause**: Previous implementation generated CSV content with .xlsx extension
   - **Solution**: Now generates HTML-based Excel format (.xls) that Excel can properly open
   - **Verification**: Excel files now open correctly with proper table formatting
   - **Note**: Uses .xls extension for better compatibility across Excel versions

### Debug Tips

1. **Enable Console Logging**
   ```javascript
   // Check what data is being exported
   console.log('Export data:', data);
   console.log('Export columns:', columns);
   ```

2. **Test with Sample Data**
   ```javascript
   const sampleData = [
     { id: 1, name: 'Test', status: 'Active' }
   ];
   ```

3. **Verify Column Configuration**
   ```javascript
   const columns = [
     { key: 'id', label: 'ID' },
     { key: 'name', label: 'Name' }
   ];
   ```

## Future Enhancements

1. **Advanced PDF Styling**
   - Custom CSS for PDF generation
   - Logo and branding support
   - Page headers and footers

2. **Excel Formatting**
   - Cell styling and formatting
   - Multiple sheets support
   - Charts and graphs

3. **Additional Export Formats**
   - JSON export
   - XML export
   - Custom format support

4. **Bulk Export**
   - Export multiple datasets
   - Batch processing
   - Progress indicators

5. **Export Scheduling**
   - Scheduled exports
   - Email delivery
   - Cloud storage integration
