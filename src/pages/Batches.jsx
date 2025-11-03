import React, { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Calendar,
  CalendarDays,
  Clock,
  TrendingUp,
  Users,
  Filter,
  Grid,
  List,
  Search,
  Settings
} from 'lucide-react';

// Custom hooks
import { useBatches } from '../hooks';

// Components
import { DataTable } from '../components/ui';
import { Button, Card } from '../design-system';
import BatchModal from '../components/BatchModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

// Utils
import { formatDate } from '../utils/dateUtils';

/**
 * Batches - Main component for managing batches using reusable DataTable
 * Features:
 * - Search and filter batches
 * - Sort by any column
 * - Pagination with customizable entries per page
 * - Create, edit, and delete batches
 * - Toast notifications for user feedback
 * - Sound notifications for actions
 * - Responsive design with dark mode support
 */
const Batches = () => {
  const { playNotificationSound } = useSound();
  
  // Sample data - replace with API call
  const initialBatches = [
    { id: 1, name: 'Batch 2082', startDate: '2082-01-01', endDate: '2082-12-30', isActive: true },
    { id: 2, name: 'Batch 2081', startDate: '2081-01-03', endDate: '2081-12-30', isActive: true },
    { id: 3, name: 'Batch 2080', startDate: '2080-01-01', endDate: '2080-12-30', isActive: true },
    { id: 4, name: '2079 Batch', startDate: '2079-02-01', endDate: '2079-12-30', isActive: true },
    { id: 5, name: 'Batch 2078', startDate: '2078-01-01', endDate: '2078-12-30', isActive: false },
    { id: 6, name: 'Batch 2077', startDate: '2077-01-03', endDate: '2077-12-30', isActive: true },
    { id: 7, name: 'Batch 2076', startDate: '2076-01-01', endDate: '2076-12-30', isActive: false },
    { id: 8, name: '2075 Batch', startDate: '2075-02-01', endDate: '2075-12-30', isActive: true },
  ];

  // Custom hooks
  const batches = useBatches(initialBatches);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'create'
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // UI states
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [filteredData, setFilteredData] = useState(batches.batches); // For export - stores filtered table data

  // Export callbacks
  const handleExportSuccess = useCallback((message) => {
    setToast({
      isVisible: true,
      message,
      type: 'success'
    });
  }, []);

  const handleExportError = useCallback((message) => {
    setToast({
      isVisible: true,
      message,
      type: 'error'
    });
  }, []);

  // Memoized column configuration for DataTable
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: getSequentialSerialNumber
    },
    {
      key: 'name',
      label: 'Batch Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-xl shadow-sm">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div> */}
          <div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {item.name}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {/* <CalendarDays className="w-4 h-4 text-blue-500" /> */}
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(item.startDate)}
          </span>
        </div>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {/* <CalendarDays className="w-4 h-4 text-orange-500" /> */}
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(item.endDate)}
          </span>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
            item.isActive
              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:text-emerald-300'
              : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/20 dark:to-red-800/30 dark:text-red-300'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (item) => {
        const actions = [
          {
            key: 'edit',
            type: 'edit',
            title: 'Edit Batch',
            className: 'text-green-600 dark:text-green-400',
            handler: handleEdit
          },
          {
            key: 'delete',
            type: 'delete',
            title: 'Delete Batch',
            className: 'text-red-600 dark:text-red-400',
            handler: handleDelete
          }
        ];

        return (
          <ActionDropdown
            actions={actions}
            item={item}
            position="bottom-end"
            className="flex justify-center"
          />
        );
      }
    }
  ], []);

  // Memoized search configuration
  const searchConfig = useMemo(() => ({
    placeholder: 'Search batches...',
    searchFields: ['name', 'startDate', 'endDate'],
    onSearch: (term) => {
      console.log('Searching for:', term);
    }
  }), []);

  // Memoized pagination configuration
  const paginationConfig = useMemo(() => ({
    entriesPerPage: 10,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [10, 25, 50, 100, -1]
  }), []);

  // Memoized filter configuration
  const filterConfig = useMemo(() => ({
    showFilters: true,
    filters: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        allLabel: 'All Status',
        tooltip: 'Filter batches by status',
        options: [
          { value: 'active', label: '✅ Active Only' },
          { value: 'inactive', label: '❌ Inactive Only' }
        ],
        filterFn: (item, value) => {
          if (value === 'active') return item.isActive === true;
          if (value === 'inactive') return item.isActive === false;
          return true;
        }
      }
    ]
  }), []);

  // Event handlers
  const handleEdit = useCallback((batch) => {
    setSelectedBatch(batch);
    setModalMode('edit');
    setIsBatchModalOpen(true);
  }, []);

  const handleDelete = useCallback((batch) => {
    setBatchToDelete(batch);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedBatch(null);
    setModalMode('create');
    setIsBatchModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (batchToDelete) {
      const batchName = batchToDelete.name;
      const result = batches.deleteBatch(batchToDelete.id);
      console.log('Deleted batch:', batchToDelete);
      setBatchToDelete(null);
      
      // Play delete notification sound
      playNotificationSound('delete');
      
      setToast({
        isVisible: true,
        message: `"${batchName}" has been deleted successfully!`,
        type: 'success'
      });
    }
  }, [batchToDelete, batches, playNotificationSound]);

  const handleSaveBatch = useCallback((updatedBatch) => {
    if (modalMode === 'edit') {
      // Update existing batch
      const result = batches.updateBatch(updatedBatch);
      console.log('Updated batch:', updatedBatch);
      
      // Play edit notification sound
      playNotificationSound('edit');
      
      setToast({
        isVisible: true,
        message: `"${updatedBatch.name}" has been updated successfully!`,
        type: 'success'
      });
    } else {
      // Create new batch
      const result = batches.addBatch(updatedBatch);
      console.log('Created batch:', result);
      
      // Play add notification sound
      playNotificationSound('add');
      
      setToast({
        isVisible: true,
        message: `"${result.name}" has been added successfully!`,
        type: 'success'
      });
    }
  }, [modalMode, batches, playNotificationSound]);

  const handleCloseModal = useCallback(() => {
    setIsBatchModalOpen(false);
    setSelectedBatch(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setBatchToDelete(null);
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-indigo-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-indigo-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
          
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1 space-y-4">
             
              
              {/* Title Section */}
              <div className="space-y-2">
              <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
              </div>
                   <div>
                     <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 dark:from-white dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                       Batches Management
                     </h1>
                     <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                       Manage academic batches, schedules, and academic years
                     </p>
                </div>
              </div>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <ExportDropdown
                data={filteredData}
                dataType="batches"
                columns={columns}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                buttonVariant="purple"
              />

              {/* Add Batch Button */}
                  <button
                onClick={handleAddNew}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add Batch</span>
                  </button>
                </div>
            </div>
          </div>


        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={batches.batches}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage="No batches found matching your filters"
            className=""
            onFilteredDataChange={setFilteredData}
          />
        </Card>
      </div>

      {/* Batch Modal */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={useCallback(() => setIsBatchModalOpen(false), [])}
        batch={selectedBatch}
        onSave={handleSaveBatch}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={useCallback(() => {
          setIsDeleteModalOpen(false);
          setBatchToDelete(null);
        }, [])}
        onConfirm={confirmDelete}
        itemName={batchToDelete?.name}
        itemType="batch"
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={useCallback(() => setToast(prev => ({ ...prev, isVisible: false })), [])}
        duration={3000}
      />
    </div>
  );
};

export default Batches;
