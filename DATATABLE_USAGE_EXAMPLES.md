# DataTable Component Usage Examples

## Overview

The `DataTable` component is a highly reusable, feature-rich data table that can be used across your application for displaying, searching, sorting, and paginating data.

## Basic Usage

```jsx
import { DataTable } from '../components/ui';

const MyComponent = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
    />
  );
};
```

## Advanced Usage with Custom Rendering

```jsx
import { DataTable } from '../components/ui';

const UsersTable = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', avatar: '/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', avatar: '/avatar2.jpg' },
  ];

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (item, column, index) => index + 1
    },
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <img 
            src={item.avatar} 
            alt={item.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{item.name}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (item) => (
        <a 
          href={`mailto:${item.email}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {item.email}
        </a>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {item.status}
        </span>
      )
    }
  ];

  const searchConfig = {
    placeholder: 'Search users...',
    searchFields: ['name', 'email'],
    onSearch: (term) => console.log('Searching:', term)
  };

  const paginationConfig = {
    entriesPerPage: 10,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [5, 10, 25, 50, 100, -1]
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user) => {
    console.log('Delete user:', user);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      searchConfig={searchConfig}
      paginationConfig={paginationConfig}
      onEdit={handleEdit}
      onDelete={handleDelete}
      emptyMessage="No users found"
    />
  );
};
```

## With Custom Actions

```jsx
import { DataTable } from '../components/ui';
import { Eye, Download, Share } from 'lucide-react';

const DocumentsTable = () => {
  const data = [
    { id: 1, title: 'Document 1', type: 'PDF', size: '2.5 MB', date: '2024-01-15' },
    { id: 2, title: 'Document 2', type: 'DOCX', size: '1.8 MB', date: '2024-01-14' },
  ];

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'size', label: 'Size', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const customActions = {
    view: {
      icon: <Eye className="w-4 h-4" />,
      title: 'View Document',
      className: 'text-blue-600 hover:bg-blue-50',
      handler: (item) => console.log('View:', item)
    },
    download: {
      icon: <Download className="w-4 h-4" />,
      title: 'Download',
      className: 'text-green-600 hover:bg-green-50',
      handler: (item) => console.log('Download:', item)
    },
    share: {
      icon: <Share className="w-4 h-4" />,
      title: 'Share',
      className: 'text-purple-600 hover:bg-purple-50',
      handler: (item) => console.log('Share:', item)
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      customActions={customActions}
      onEdit={(item) => console.log('Edit:', item)}
      onDelete={(item) => console.log('Delete:', item)}
    />
  );
};
```

## With View Action

```jsx
import { DataTable } from '../components/ui';

const ProductsTable = () => {
  const data = [
    { id: 1, name: 'Product 1', price: 29.99, category: 'Electronics', inStock: true },
    { id: 2, name: 'Product 2', price: 19.99, category: 'Clothing', inStock: false },
  ];

  const columns = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'inStock', label: 'In Stock', sortable: true },
  ];

  const handleView = (product) => {
    // Navigate to product detail page
    console.log('View product:', product);
  };

  const handleEdit = (product) => {
    // Open edit modal
    console.log('Edit product:', product);
  };

  const handleDelete = (product) => {
    // Show delete confirmation
    console.log('Delete product:', product);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      searchConfig={{
        placeholder: 'Search products...',
        searchFields: ['name', 'category']
      }}
    />
  );
};
```

## Minimal Configuration

```jsx
import { DataTable } from '../components/ui';

const SimpleTable = () => {
  const data = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'value', label: 'Value' },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      paginationConfig={{ showPagination: false }}
      searchConfig={{ searchFields: [] }}
    />
  );
};
```

## Props Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | Array of data objects to display |
| `columns` | `Array` | `[]` | Column configuration array |
| `searchConfig` | `Object` | `{}` | Search configuration |
| `paginationConfig` | `Object` | `{}` | Pagination configuration |
| `onEdit` | `Function` | - | Edit handler function |
| `onDelete` | `Function` | - | Delete handler function |
| `onView` | `Function` | - | View handler function |
| `customActions` | `Object` | `{}` | Custom action buttons |
| `emptyMessage` | `String` | `'No data found'` | Message when no data |
| `className` | `String` | `''` | Additional CSS classes |
| `tableProps` | `Object` | `{}` | Additional table props |
| `theadProps` | `Object` | `{}` | Additional thead props |
| `tbodyProps` | `Object` | `{}` | Additional tbody props |

### Column Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `String` | Yes | Data property key |
| `label` | `String` | Yes | Column header label |
| `sortable` | `Boolean` | No | Whether column is sortable (default: true) |
| `render` | `Function` | No | Custom render function |

### Search Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `String` | `'Search...'` | Search input placeholder |
| `searchFields` | `Array` | `[]` | Fields to search in |
| `onSearch` | `Function` | `() => {}` | Search callback function |

### Pagination Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entriesPerPage` | `Number` | `10` | Default entries per page |
| `showEntriesSelector` | `Boolean` | `true` | Show entries selector |
| `showPagination` | `Boolean` | `true` | Show pagination controls |
| `entriesOptions` | `Array` | `[5, 10, 25, 50, 100, -1]` | Available entries options |

### Custom Actions

```jsx
const customActions = {
  actionKey: {
    icon: <IconComponent className="w-4 h-4" />,
    title: 'Action Title',
    className: 'text-color hover:bg-color-50',
    handler: (item) => {
      // Action logic
    }
  }
};
```

## Features

- ✅ **Search**: Real-time search across specified fields
- ✅ **Sorting**: Click column headers to sort
- ✅ **Pagination**: Configurable pagination with entries selector
- ✅ **Actions**: Built-in edit, delete, view actions
- ✅ **Custom Actions**: Add your own action buttons
- ✅ **Tooltips**: Interactive tooltips for all buttons and controls
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **Customizable**: Extensive styling and behavior options
- ✅ **TypeScript Ready**: Full TypeScript support

## Styling

The DataTable uses Tailwind CSS classes and supports:
- Custom className prop for additional styling
- Dark mode variants
- Responsive design
- Hover effects and transitions
- Gradient backgrounds and shadows

## Tooltip Integration

The DataTable component includes comprehensive tooltip support for enhanced user experience:

### Built-in Tooltips

- **Action Buttons**: View, Edit, Delete buttons show helpful tooltips
- **Custom Actions**: All custom action buttons automatically get tooltips
- **Column Headers**: Sortable columns show "Click to sort by [Column Name]"
- **Pagination**: Previous/Next buttons and page numbers have descriptive tooltips
- **Controls**: Search input and entries selector have helpful tooltips

### Tooltip Features

- **Smart Positioning**: Tooltips automatically position to avoid viewport edges
- **Hover Delay**: 200ms delay before showing tooltips
- **Keyboard Support**: Tooltips work with keyboard navigation
- **Dark Mode**: Tooltips adapt to dark/light theme
- **Accessibility**: Proper ARIA labels and screen reader support

### Example with Custom Action Tooltips

```jsx
const customActions = {
  download: {
    icon: <Download className="w-4 h-4" />,
    title: 'Download Document', // This becomes the tooltip text
    className: 'text-green-600 hover:bg-green-50',
    handler: (item) => console.log('Download:', item)
  }
};
```

## Performance

- Memoized components for optimal re-rendering
- Efficient search and sorting algorithms
- Lazy loading for large datasets
- Optimized pagination calculations
