import React, { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Filter,
  Grid,
  List,
  Search, 
  Settings
} from 'lucide-react';

// Components
import { DataTable } from '../components/ui';
import { Button, Card } from '../design-system';
import SectionModal from '../components/SectionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

// Utils
import { formatDate } from '../utils/dateUtils';

const Sections = () => {
  const { playNotificationSound } = useSound();
  
  // Sample data - replace with API call
  const [sections, setSections] = useState([
    { id: 1, name: 'B', isActive: true, createdOn: '2079-10-05', modifiedOn: '2079-10-05' },
    { id: 2, name: 'A', isActive: true, createdOn: '2079-10-05', modifiedOn: '2079-10-05' },
    { id: 3, name: 'C', isActive: true, createdOn: '2079-10-05', modifiedOn: '2079-10-05' },
    { id: 4, name: 'D', isActive: false, createdOn: '2079-09-15', modifiedOn: '2079-10-01' },
    { id: 5, name: 'E', isActive: true, createdOn: '2079-08-20', modifiedOn: '2079-09-25' },
  ]);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'create'
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [filteredData, setFilteredData] = useState(sections); // For export - stores filtered table data

  // UI states
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

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
      label: 'Section Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {item.name}
            </span>
            </div>
          </div>
      )
    },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(item.createdOn)}
          </span>
        </div>
      )
    },
    {
      key: 'modifiedOn',
      label: 'Modified On',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(item.modifiedOn)}
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
            title: 'Edit Section',
            className: 'text-green-600 dark:text-green-400',
            handler: handleEdit
          },
          {
            key: 'delete',
            type: 'delete',
            title: 'Delete Section',
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
    placeholder: 'Search sections...',
    searchFields: ['name', 'createdOn', 'modifiedOn'],
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
        key: 'isActive',
        label: 'Status',
        type: 'select',
        allLabel: 'All Status',
        tooltip: 'Filter sections by status',
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
  const handleEdit = useCallback((section) => {
    setSelectedSection(section);
    setModalMode('edit');
    setIsSectionModalOpen(true);
  }, []);

  const handleDelete = useCallback((section) => {
    setSectionToDelete(section);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedSection(null);
    setModalMode('create');
    setIsSectionModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (sectionToDelete) {
      const sectionName = sectionToDelete.name;
      setSections(sections.filter(s => s.id !== sectionToDelete.id));
      console.log('Deleted section:', sectionToDelete);
      setSectionToDelete(null);
      
      // Play delete notification sound
      playNotificationSound('delete');
      
      setToast({
        isVisible: true,
        message: `"${sectionName}" has been deleted successfully!`,
        type: 'success'
      });
    }
  }, [sectionToDelete, sections, playNotificationSound]);

  const handleSaveSection = useCallback((updatedSection) => {
    if (modalMode === 'edit') {
      // Update existing section
      setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
      console.log('Updated section:', updatedSection);
      
      // Play edit notification sound
      playNotificationSound('edit');
      
      setToast({
        isVisible: true,
        message: `"${updatedSection.name}" has been updated successfully!`,
        type: 'success'
      });
    } else {
      // Create new section
      const newSection = {
        ...updatedSection,
        id: Math.max(...sections.map(s => s.id)) + 1
      };
      setSections([...sections, newSection]);
      console.log('Created section:', newSection);
      
      // Play add notification sound
      playNotificationSound('add');
      
      setToast({
        isVisible: true,
        message: `"${newSection.name}" has been added successfully!`,
        type: 'success'
      });
    }
  }, [modalMode, sections, playNotificationSound]);

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20" />
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
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
              </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                      Sections Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                      Manage academic sections, schedules, and student groups
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
                dataType="sections"
                columns={columns}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                buttonVariant="purple"
              />

              {/* Add Section Button */}
              <Button
                variant="success"
                icon={<Plus />}
                onClick={handleAddNew}
              >
                Add Section
              </Button>
                </div>
            </div>
          </div>

        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={sections}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage="No sections found matching your filters"
            className=""
            onFilteredDataChange={setFilteredData}
          />
        </Card>
      </div>

      {/* Section Modal */}
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={useCallback(() => setIsSectionModalOpen(false), [])}
        section={selectedSection}
        onSave={handleSaveSection}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={useCallback(() => {
          setIsDeleteModalOpen(false);
          setSectionToDelete(null);
        }, [])}
        onConfirm={confirmDelete}
        itemName={sectionToDelete?.name}
        itemType="section"
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

export default Sections;

