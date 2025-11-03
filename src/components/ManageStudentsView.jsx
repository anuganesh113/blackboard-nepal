import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Tag, 
  FileText, 
  Hash, 
  UserPlus,
  Eye,
  Trash2,
  Users
} from 'lucide-react';
import avatarImage from '../assets/img/avatar.png';
import fallbackAvatarImage from '../assets/img/fallback-avatar.png';
import { DataTable } from './ui';
import AssignStudentsModal from './AssignStudentsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Toast from './Toast';
import Tooltip from './Tooltip';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

const ManageStudentsView = ({ classroom, onBack }) => {
  const navigate = useNavigate();
  const { playNotificationSound } = useSound();
  const [activeTab, setActiveTab] = useState('rollNumber');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Mock student data - replace with actual data from API
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNumber: '1',
      studentId: 'STU001',
      photo: null,
      name: 'John Doe',
      contact: '1234567890',
      course: 'Class 8',
      batch: 'Batch 2082',
      symbolNumber: 'SYM001',
      registrationNumber: 'REG001'
    },
    {
      id: 2,
      rollNumber: '2',
      studentId: 'STU002',
      photo: null,
      name: 'Jane Smith',
      contact: '9818555666',
      course: 'Class 8',
      batch: 'Batch 2082',
      symbolNumber: 'SYM002',
      registrationNumber: 'REG002'
    },
    {
      id: 3,
      rollNumber: '3',
      studentId: 'STU003',
      photo: null,
      name: 'Alice Johnson',
      contact: '9851234567',
      course: 'Class 8',
      batch: 'Batch2082',
      symbolNumber: 'SYM003',
      registrationNumber: 'REG003'
    },
  ]);

  const tabs = [
    { key: 'symbolNumber', label: 'Symbol Number', icon: Tag },
    { key: 'registrationNumber', label: 'Registration Number', icon: FileText },
    { key: 'rollNumber', label: 'Roll Number', icon: Hash },
    { key: 'assign', label: 'Assign to classroom', icon: UserPlus }
  ];

  // Handle tab click
  const handleTabClick = useCallback((tabKey) => {
    if (tabKey === 'assign') {
      setIsAssignModalOpen(true);
    } else {
      setActiveTab(tabKey);
      setSelectedStudents(new Set());
    }
  }, []);

  // Handle checkbox selection
  const handleSelectStudent = useCallback((studentId, isChecked) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(studentId);
      } else {
        newSet.delete(studentId);
      }
      return newSet;
    });
  }, []);

  // Handle select all - works with filtered/visible students
  const handleSelectAll = useCallback((isChecked) => {
    if (isChecked) {
      const visibleIds = new Set(filteredStudents.length > 0 ? filteredStudents.map(s => s.id) : students.map(s => s.id));
      setSelectedStudents(prev => new Set([...prev, ...visibleIds]));
    } else {
      // Remove only visible students from selection
      const visibleIds = new Set(filteredStudents.length > 0 ? filteredStudents.map(s => s.id) : students.map(s => s.id));
      setSelectedStudents(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
  }, [students, filteredStudents]);

  // Handle view student details
  const handleViewStudent = useCallback((student) => {
    navigate('/students/profile', { state: { student } });
  }, [navigate]);

  // Handle quick remove student - opens confirmation modal
  const handleQuickRemove = useCallback((student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (selectedStudent) {
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      playNotificationSound('delete');
      setToast({
        isVisible: true,
        message: `${selectedStudent.name} removed from classroom`,
        type: 'success'
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  }, [selectedStudent, playNotificationSound]);

  // Handle remove selected students
  const handleRemoveSelected = useCallback(() => {
    if (selectedStudents.size === 0) {
      setToast({
        isVisible: true,
        message: 'Please select students to remove',
        type: 'error'
      });
      return;
    }

    setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
    const removedCount = selectedStudents.size;
    setSelectedStudents(new Set());
    playNotificationSound('delete');
    setToast({
      isVisible: true,
      message: `${removedCount} student(s) removed from classroom`,
      type: 'success'
    });
  }, [selectedStudents, playNotificationSound]);

  // Handle assign students
  const handleAssignStudents = useCallback((assignedStudents) => {
    // Add new students to the list
    const newStudents = assignedStudents.map(student => ({
      ...student,
      rollNumber: String(students.length + assignedStudents.indexOf(student) + 1)
    }));
    
    setStudents(prev => [...prev, ...newStudents]);
    setIsAssignModalOpen(false);
    playNotificationSound('add');
    setToast({
      isVisible: true,
      message: `${assignedStudents.length} student(s) assigned to classroom`,
      type: 'success'
    });
  }, [students.length, playNotificationSound]);

  // DataTable columns
  const columns = useMemo(() => [
    {
      key: 'checkbox',
      label: '',
      sortable: false,
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedStudents.has(item.id)}
          onChange={(e) => handleSelectStudent(item.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      )
    },
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: getSequentialSerialNumber,
    },
    {
      key: 'rollNumber',
      label: 'Roll No.',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {item.rollNumber}
        </span>
      ),
    },
    {
      key: 'studentId',
      label: 'Student Id',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {item.studentId}
        </span>
      ),
    },
    {
      key: 'photo',
      label: 'Photo',
      sortable: false,
      render: (item) => (
        <div className="w-10 h-10 rounded-full shadow-md">
          <img
            src={item.photo || fallbackAvatarImage}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatarImage;
            }}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {item.name}
        </span>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      sortable: true,
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {item.contact}
        </span>
      ),
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {item.course}
        </span>
      ),
    },
    {
      key: 'batch',
      label: 'Batch',
      sortable: true,
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {item.batch}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Tooltip content="View Profile" position="top">
            <button
              onClick={() => handleViewStudent(item)}
              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Delete" position="top">
            <button
              onClick={() => handleQuickRemove(item)}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      ),
    }
  ], [selectedStudents, handleSelectStudent, handleViewStudent, handleQuickRemove]);

  // DataTable config
  const searchConfig = useMemo(() => ({
    placeholder: 'Search students...',
    searchFields: ['name', 'studentId', 'rollNumber', 'contact', 'batch'],
  }), []);

  const paginationConfig = useMemo(() => ({
    entriesPerPage: 25,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [10, 25, 50, 100, -1]
  }), []);

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-indigo-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-indigo-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <Tooltip content="Back to Classroom List" position="top">
                <button
                  onClick={onBack}
                  className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </button>
              </Tooltip>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-indigo-900 dark:from-white dark:via-emerald-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  Students Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                  {classroom?.classroom || 'Classroom'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20 dark:border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key || (tab.key === 'assign' && isAssignModalOpen);
              const isAssignTab = tab.key === 'assign';

              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isAssignTab ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
          {/* Table Header with Remove Button */}
          {selectedStudents.size > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/30 flex items-center justify-between">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {selectedStudents.size} student(s) selected
              </span>
              <button
                onClick={handleRemoveSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove from Classroom
              </button>
            </div>
          )}

          <DataTable
            data={students}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            emptyMessage="No students found in this classroom"
            checkboxConfig={{
              isAllSelected: filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.id)),
              isIndeterminate: filteredStudents.length > 0 && filteredStudents.some(s => selectedStudents.has(s.id)) && !filteredStudents.every(s => selectedStudents.has(s.id)),
              onSelectAll: handleSelectAll
            }}
            onFilteredDataChange={setFilteredStudents}
          />
        </div>
      </div>

      {/* Assign Students Modal */}
      {isAssignModalOpen && (
        <AssignStudentsModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          classroom={classroom}
          onAssign={handleAssignStudents}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedStudent?.name}
          itemType="student"
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />
    </div>
  );
};

export default ManageStudentsView;

