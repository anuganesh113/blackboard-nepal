import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  BookPlus,
  BookCheck,
  Filter,
  Grid,
  List,
  Search,
  Settings,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

// Components
import { DataTable } from '../components/ui';
import { Button, Card } from '../design-system';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SubjectModal from '../components/SubjectModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

const Subjects = () => {
  const navigate = useNavigate();
  const { playNotificationSound } = useSound();

  // Sample data - replace with API call
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Drawing Cursive', code: '', icon: '✏️', isOptional: false, creditHours: 4, isAdditional: true, status: true },
    { id: 2, name: 'Hamro Dhangadhi', code: 'hd', icon: 'अ', isOptional: false, creditHours: 4, isAdditional: false, status: true },
    { id: 3, name: 'Science Oral', code: 'SORAL', icon: '🔬', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 4, name: 'Nepali Oral', code: 'NORAL', icon: 'अ', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 5, name: 'Maths Oral', code: 'MORAL', icon: '🔢', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 6, name: 'English Oral', code: 'EORAL', icon: '🔤', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 7, name: 'General Knowledge', code: 'GK', icon: '📚', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 8, name: 'English Grammar', code: 'Eng.Gram', icon: '📖', isOptional: false, creditHours: 2, isAdditional: false, status: true },
    { id: 9, name: 'OPT Maths', code: '', icon: '🔢', isOptional: true, creditHours: 4, isAdditional: false, status: true },
    { id: 10, name: 'Hygiene', code: 'Hyg', icon: '👑', isOptional: false, creditHours: 4, isAdditional: true, status: true },
  ]);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'create'
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // UI states
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [filteredData, setFilteredData] = useState(subjects); // For export - stores filtered table data

  // Memoized column configuration for DataTable
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: getSequentialSerialNumber
    },
    {
      key: 'icon',
      label: 'Subject Icon',
      sortable: false,
      render: (item) => (
        <div className="flex justify-center">
          <span className="text-2xl">{item.icon}</span>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Subject Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {item.name}
            </span>
            {item.code && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Code: {item.code}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (item) => {
        let type = 'Core';
        let className = 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/30 dark:text-blue-300';

        if (item.isOptional) {
          type = 'Optional';
          className = 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 dark:from-purple-900/20 dark:to-purple-800/30 dark:text-purple-300';
        } else if (item.isAdditional) {
          type = 'Additional';
          className = 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:text-emerald-300';
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${className}`}
          >
            {type}
          </span>
        );
      }
    },
    {
      key: 'creditHours',
      label: 'Credit Hours',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {/* <Clock className="w-4 h-4 text-amber-500" /> */}
          <span className="font-medium text-gray-900 dark:text-white">
            {item.creditHours}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">hrs</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${item.status
            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:text-emerald-300'
            : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/20 dark:to-red-800/30 dark:text-red-300'
          }`}
        >
          {item.status ? 'Active' : 'Inactive'}
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
            key: 'assignSyllabus',
            type: 'assignSyllabus',
            title: 'Assign Syllabus',
            className: 'text-indigo-600 dark:text-indigo-400',
            handler: handleAssignSyllabus
          },
          {
            key: 'assignAdditional',
            type: 'assignAdditional',
            title: 'Assign Additional Subjects',
            className: 'text-blue-600 dark:text-blue-400',
            handler: handleAssignAdditional
          },
          {
            key: 'assignOptional',
            type: 'assignOptional',
            title: 'Assign Optional Subjects',
            className: 'text-purple-600 dark:text-purple-400',
            handler: handleAssignOptional
          },
          {
            key: 'edit',
            type: 'edit',
            title: 'Edit Subject',
            className: 'text-green-600 dark:text-green-400',
            handler: handleEdit
          },
          {
            key: 'delete',
            type: 'delete',
            title: 'Delete Subject',
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
    placeholder: 'Search subjects...',
    searchFields: ['name', 'code'],
    onSearch: (term) => {
      console.log('Searching for:', term);
    }
  }), []);

  const handleViewModeToggle = useCallback(() => {
    setViewMode(prev => prev === 'table' ? 'grid' : 'table');
  }, []);

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
        tooltip: 'Filter subjects by status',
        options: [
          { value: 'active', label: '✅ Active Only' },
          { value: 'inactive', label: '❌ Inactive Only' }
        ],
        filterFn: (item, value) => {
          if (value === 'active') return item.status === true;
          if (value === 'inactive') return item.status === false;
          return true;
        }
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        allLabel: 'All Types',
        tooltip: 'Filter subjects by type',
        options: [
          { value: 'core', label: '📖 Core Only' },
          { value: 'optional', label: '🔍 Optional Only' },
          { value: 'additional', label: '➕ Additional Only' }
        ],
        filterFn: (item, value) => {
          if (value === 'core') return !item.isOptional && !item.isAdditional;
          if (value === 'optional') return item.isOptional;
          if (value === 'additional') return item.isAdditional;
          return true;
        }
      }
    ]
  }), []);

  // Event handlers
  const handleEdit = useCallback((subject) => {
    setSelectedSubject(subject);
    setModalMode('edit');
    setIsSubjectModalOpen(true);
  }, []);

  const handleDelete = useCallback((subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAssignSyllabus = useCallback((subject) => {
    console.log('Assign syllabus for subject:', subject);
    navigate('/subjects/assign-syllabus', { state: { subject } });
  }, [navigate]);

  const handleAddNew = useCallback(() => {
    setSelectedSubject(null);
    setModalMode('create');
    setIsSubjectModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (subjectToDelete) {
      const subjectName = subjectToDelete.name;
      setSubjects(subjects.filter(s => s.id !== subjectToDelete.id));
      console.log('Deleted subject:', subjectToDelete);
      setSubjectToDelete(null);

      // Play delete notification sound
      playNotificationSound('delete');

      setToast({
        isVisible: true,
        message: `"${subjectName}" has been deleted successfully!`,
        type: 'success'
      });
    }
  }, [subjectToDelete, subjects, playNotificationSound]);

  const handleSaveSubject = useCallback((updatedSubject) => {
    if (modalMode === 'edit') {
      // Update existing subject
      setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
      console.log('Updated subject:', updatedSubject);

      // Play edit notification sound
      playNotificationSound('edit');

      setToast({
        isVisible: true,
        message: `"${updatedSubject.name}" has been updated successfully!`,
        type: 'success'
      });
    } else {
      // Create new subject
      const newSubject = {
        ...updatedSubject,
        id: Math.max(...subjects.map(s => s.id)) + 1
      };
      setSubjects([...subjects, newSubject]);
      console.log('Created subject:', newSubject);

      // Play add notification sound
      playNotificationSound('add');

      setToast({
        isVisible: true,
        message: `"${newSubject.name}" has been added successfully!`,
        type: 'success'
      });
    }
  }, [modalMode, subjects, playNotificationSound]);

  const handleAssignAdditional = useCallback(() => {
    navigate('/subjects/assign-additional');
  }, [navigate]);

  const handleAssignOptional = useCallback(() => {
    navigate('/subjects/assign-optional');
  }, [navigate]);

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
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                      Subjects Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                      Manage subjects, credit hours, and curriculum assignments
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
                dataType="subjects"
                columns={columns}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                buttonVariant="purple"
              />

              {/* Add Subject Button */}
              <Button
                variant="success"
                icon={<Plus />}
                onClick={handleAddNew}
              >
                Add Subject
              </Button>
            </div>
          </div>
        </div>


        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={subjects}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage="No subjects found matching your filters"
            className=""
            onFilteredDataChange={setFilteredData}
          />
        </Card>
      </div>

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={useCallback(() => setIsSubjectModalOpen(false), [])}
        subject={selectedSubject}
        onSave={handleSaveSubject}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={useCallback(() => {
          setIsDeleteModalOpen(false);
          setSubjectToDelete(null);
        }, [])}
        onConfirm={confirmDelete}
        itemName={subjectToDelete?.name}
        itemType="subject"
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

export default Subjects;
