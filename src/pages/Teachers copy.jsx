import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import avatarImage from '../assets/img/avatar.png';
import fallbackAvatarImage from '../assets/img/fallback-avatar.png';

// Components
import { DataTable } from '../components/ui';
import TeacherModal from '../components/TeacherModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import { useSound } from '../context/SoundContext';
import { downloadTeacherCardsPDF, downloadTeachersTablePDF, downloadTeachersTableCSV, downloadTeachersTableExcel } from '../utils/pdfGenerator';

const Teachers = () => {
  const navigate = useNavigate();
  const { playNotificationSound } = useSound();
  
  // Sample data - replace with API call
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      teacherId: 'BBAT20820125031',
      name: 'Vehicle Staff',
      designation: 'Bus Staff',
      email: 'vehiclestaff@bbn.edu.np',
      mobile: '9800000002',
      address: 'Dhangadhi - 08, Kailali',
      subjects: ['Transportation', 'Vehicle Management'],
      profileImage: avatarImage,
      isActive: true,
      joinDate: '2020-08-20',
      salary: 'N/A'
    },
    { 
      id: 2, 
      teacherId: 'BBAT2079100502',
      name: 'Principal',
      designation: 'Principal',
      email: 'principal@bbn.edu.np',
      mobile: '9800000000',
      address: 'Dhangadhi,04-Kailali',
      subjects: ['Administration', 'Management'],
      profileImage: avatarImage,
      isActive: true,
      joinDate: '2019-07-10',
      salary: 'N/A'
    },
    { 
      id: 3, 
      teacherId: 'BBAT2079100501',
      name: 'Teacher',
      designation: 'Teacher',
      email: 'teacher@bbn.edu.np',
      mobile: '9800000001',
      address: 'Dhangadhi, Kailali',
      subjects: ['Mathematics', 'Science'],
      profileImage: avatarImage,
      isActive: true,
      joinDate: '2019-07-10',
      salary: 'N/A'
    },
    { 
      id: 4, 
      teacherId: 'BBAT20820125032',
      name: 'John Smith',
      designation: 'Senior Teacher',
      email: 'john.smith@bbn.edu.np',
      mobile: '9800000003',
      address: 'Kathmandu, Nepal',
      subjects: ['English', 'Literature'],
      profileImage: avatarImage,
      isActive: true,
      joinDate: '2020-08-25',
      salary: 'N/A'
    },
    { 
      id: 5, 
      teacherId: 'BBAT20820125033',
      name: 'Sarah Johnson',
      designation: 'Math Teacher',
      email: 'sarah.johnson@bbn.edu.np',
      mobile: '9800000004',
      address: 'Pokhara, Nepal',
      subjects: ['Mathematics', 'Statistics'],
      profileImage: null,
      isActive: false,
      joinDate: '2020-09-01',
      salary: 'N/A'
    }
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  

  // Memoized column configuration for DataTable
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: (item, column, index, currentData, filteredAndSortedData) => {
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300">
            {item.id}
          </div>
        );
      }
    },
    {
      key: 'profile',
      label: 'Profile',
      sortable: false,
      render: (item) => (
        <div className="w-12 h-12 rounded-full shadow-md">
          <img
            src={item.profileImage || fallbackAvatarImage}
            alt={item.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        </div>
      )
    },
    {
      key: 'teacherId',
      label: 'Teacher ID',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {item.teacherId}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {item.name}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.designation}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {item.email}
        </span>
      )
    },
    {
      key: 'mobile',
      label: 'Mobile',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {item.mobile}
        </span>
      )
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {item.address}
        </span>
      )
    },
    {
      key: 'subjects',
      label: 'Subjects',
      sortable: true,
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.subjects.slice(0, 2).map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/30 dark:text-blue-300"
            >
              {subject}
            </span>
          ))}
          {item.subjects.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{item.subjects.length - 2} more
            </span>
          )}
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
    }
  ], []);

  // Memoized search configuration
  const searchConfig = useMemo(() => ({
    placeholder: 'Search teachers...',
    searchFields: ['name', 'teacherId', 'email', 'mobile', 'designation'],
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
        tooltip: 'Filter teachers by status',
        options: [
          { value: 'active', label: '✅ Active Only' },
          { value: 'inactive', label: '❌ Inactive Only' }
        ],
        filterFn: (item, value) => {
          if (value === 'active') return item.isActive === true;
          if (value === 'inactive') return item.isActive === false;
          return true;
        }
      },
      {
        key: 'designation',
        label: 'Designation',
        type: 'select',
        allLabel: 'All Designations',
        tooltip: 'Filter teachers by designation',
        options: [
          { value: 'principal', label: '👑 Principal' },
          { value: 'teacher', label: '👨‍🏫 Teacher' },
          { value: 'senior', label: '⭐ Senior Teacher' },
          { value: 'staff', label: '🚌 Staff' }
        ],
        filterFn: (item, value) => {
          if (value === 'principal') return item.designation.toLowerCase().includes('principal');
          if (value === 'teacher') return item.designation.toLowerCase().includes('teacher');
          if (value === 'senior') return item.designation.toLowerCase().includes('senior');
          if (value === 'staff') return item.designation.toLowerCase().includes('staff');
          return true;
        }
      }
    ]
  }), []);

  // Event handlers
  const handleEdit = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  }, []);

  const handleView = useCallback((teacher) => {
    navigate('/teachers/view', { state: { teacher } });
  }, [navigate]);

  const handleAddNew = useCallback(() => {
    setSelectedTeacher(null);
    setModalMode('create');
    setIsModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedTeacher) {
      const teacherName = selectedTeacher.name;
      setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
      console.log('Deleted teacher:', selectedTeacher);
      setSelectedTeacher(null);

      // Play delete notification sound
      playNotificationSound('delete');

      setToast({
        isVisible: true,
        message: `"${teacherName}" has been deleted successfully!`,
        type: 'success'
      });
    }
  }, [selectedTeacher, teachers, playNotificationSound]);

  const handleSaveTeacher = useCallback((teacherData) => {
    if (modalMode === 'edit') {
      // Update existing teacher
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, ...teacherData } : t));
      console.log('Updated teacher:', teacherData);

      // Play edit notification sound
      playNotificationSound('edit');

      setToast({
        isVisible: true,
        message: `"${teacherData.name}" has been updated successfully!`,
        type: 'success'
      });
    } else {
      // Create new teacher
      const newTeacher = {
        ...teacherData,
        id: Math.max(...teachers.map(t => t.id)) + 1,
        teacherId: `BBAT${Date.now().toString().slice(-10)}`
      };
      setTeachers([...teachers, newTeacher]);
      console.log('Created teacher:', newTeacher);
      
      // Play add notification sound
      playNotificationSound('add');

      setToast({
        isVisible: true,
        message: `"${newTeacher.name}" has been added successfully!`,
        type: 'success'
      });
    }
    setIsModalOpen(false);
  }, [modalMode, teachers, selectedTeacher, playNotificationSound]);

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

  // Custom actions for DataTable
  const customActions = useMemo(() => ({
    view: {
      icon: <Eye className="w-4 h-4" />,
      title: 'View Teacher',
      className: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',
      handler: handleView
    },
    downloadCards: {
      icon: <Download className="w-4 h-4" />,
      title: 'Download Teacher Cards',
      className: 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30',
      handler: async (teacher) => {
        try {
          await downloadTeacherCardsPDF([teacher.id], teachers);
          setToast({
            isVisible: true,
            message: `Successfully downloaded teacher card for "${teacher.name}"!`,
            type: 'success'
          });
    } catch (error) {
      console.error('Error generating PDF:', error);
          setToast({
            isVisible: true,
            message: 'Error generating PDF. Please try again.',
            type: 'error'
          });
        }
      }
    }
  }), [handleView, teachers]);


  // Teachers columns configuration for export
  const teachersColumns = useMemo(() => [
    { key: 'teacherId', label: 'Teacher ID' },
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'address', label: 'Address' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'isActive', label: 'Status' },
    { key: 'joinDate', label: 'Join Date' }
  ], []);

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
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                      Teachers Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                      Manage teachers, profiles, and academic assignments
                    </p>
                </div>
              </div>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <ExportDropdown
                data={teachers}
                dataType="teachers"
                columns={teachersColumns}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                buttonVariant="purple"
              />

              {/* Add Teacher Button */}
                  <button
                onClick={handleAddNew}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add Teacher</span>
                  </button>
            </div>
          </div>
        </div>

        {/* Enhanced DataTable Container */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <DataTable
            data={teachers}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            onEdit={handleEdit}
            onDelete={handleDelete}
            customActions={customActions}
            emptyMessage="No teachers found matching your filters"
            className=""
          />
        </div>
      </div>

      {/* Teacher Modal */}
        <TeacherModal
          isOpen={isModalOpen}
        onClose={useCallback(() => setIsModalOpen(false), [])}
          teacher={selectedTeacher}
          onSave={handleSaveTeacher}
          mode={modalMode}
        />

      {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
        onClose={useCallback(() => {
          setIsDeleteModalOpen(false);
          setSelectedTeacher(null);
        }, [])}
        onConfirm={confirmDelete}
          itemName={selectedTeacher?.name}
          itemType="teacher"
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

export default Teachers;
