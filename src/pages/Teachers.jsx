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
import { DataTable, Modal } from '../components/ui';
import { Button, Card } from '../design-system';
import TeacherModal from '../components/TeacherModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';
import { downloadTeacherCardsPDF, downloadTeachersTablePDF, downloadTeachersTableCSV, downloadTeachersTableExcel } from '../utils/pdfGenerator';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

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
  const [filteredData, setFilteredData] = useState(teachers); // For export - stores filtered table data
  
  // Checkbox selection state
  const [selectedTeachers, setSelectedTeachers] = useState(new Set());
  
  // Checkbox handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allTeacherIds = new Set(teachers.map(teacher => teacher.id));
      setSelectedTeachers(allTeacherIds);
    } else {
      setSelectedTeachers(new Set());
    }
  }, [teachers]);

  const handleSelectTeacher = useCallback((teacherId, checked) => {
    setSelectedTeachers(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(teacherId);
        } else {
        newSet.delete(teacherId);
      }
      return newSet;
    });
  }, []);

  // Check if all teachers are selected
  const isAllSelected = useMemo(() => {
    return teachers.length > 0 && selectedTeachers.size === teachers.length;
  }, [teachers.length, selectedTeachers.size]);

  // Check if some teachers are selected (for indeterminate state)
  const isIndeterminate = useMemo(() => {
    return selectedTeachers.size > 0 && selectedTeachers.size < teachers.length;
  }, [selectedTeachers.size, teachers.length]);
  
  // Memoized column configuration for DataTable
  const columns = useMemo(() => [
    {
      key: 'checkbox',
      label: '',
      sortable: false,
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedTeachers.has(item.id)}
          onChange={(e) => handleSelectTeacher(item.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      )
    },
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: getSequentialSerialNumber
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
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (item) => {
        const actions = [
          {
            key: 'view',
            type: 'view',
            title: 'View Teacher',
            className: 'text-blue-600 dark:text-blue-400',
            handler: handleView
          },
          {
            key: 'edit',
            type: 'edit',
            title: 'Edit Teacher',
            className: 'text-green-600 dark:text-green-400',
            handler: handleEdit
          },
          {
            key: 'download',
            type: 'download',
            title: 'Download Card',
            className: 'text-purple-600 dark:text-purple-400',
            handler: async (teacher) => {
              try {
                const safeTeachers = normalizeTeachersForPDF([teacher]);
                await downloadTeacherCardsPDF([teacher.id], safeTeachers);
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
          },
          {
            key: 'delete',
            type: 'delete',
            title: 'Delete Teacher',
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
  ], [selectedTeachers, handleSelectTeacher]);

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

  // Normalize teacher objects to be safe for PDF generation
  const normalizeTeachersForPDF = useCallback((list) => {
    return list.map(t => ({
      ...t,
      name: t.name || 'Unknown Teacher',
      teacherId: t.teacherId || 'N/A',
      mobile: t.mobile || 'N/A',
      address: t.address || 'N/A',
      // Ensure non-string images are ignored so generator uses fallback image
      profileImage: typeof t.profileImage === 'string' ? t.profileImage : ''
    }));
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
  const customActions = useMemo(() => ({}), []);


  // Teachers columns configuration for export
  const teachersColumns = useMemo(() => [
    { key: 'teacherId', label: 'Teacher ID' },
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'address', label: 'Address' }
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
            {/* Download All Button */}
            <Button
              variant="primary"
              icon={<Download />}
              onClick={async () => {
                if (selectedTeachers.size === 0) {
                  setAlertMessage('Please Select Teachers first');
                  setIsAlertOpen(true);
                  return;
                }
                try {
                  const selectedTeacherIds = Array.from(selectedTeachers);
                  const selectedTeachersData = teachers.filter(teacher => selectedTeachers.has(teacher.id));
                  const safeTeachers = normalizeTeachersForPDF(selectedTeachersData);
                  await downloadTeacherCardsPDF(selectedTeacherIds, safeTeachers);
                  setToast({
                    isVisible: true,
                    message: `Successfully downloaded ${selectedTeachers.size} teacher card(s)!`,
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
              }}
            >
              Download Teacher Cards
            </Button>
            
            {/* Export Dropdown */}
            <ExportDropdown
                data={filteredData}
              dataType="teachers"
              columns={teachersColumns}
              onExportSuccess={handleExportSuccess}
              onExportError={handleExportError}
              buttonVariant="purple"
            />
            
              {/* Add Teacher Button */}
            <Button
              variant="success"
              icon={<Plus />}
                onClick={handleAddNew}
            >
              Add Teacher
            </Button>
          </div>
                </div>
              </div>

        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={teachers}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage="No teachers found matching your filters"
            className=""
            checkboxConfig={{
              isAllSelected,
              isIndeterminate,
              onSelectAll: handleSelectAll
            }}
            onFilteredDataChange={setFilteredData}
          />
        </Card>
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

      {/* Selection Required Alert Modal */}
        <Modal
          isOpen={isAlertOpen}
          onClose={useCallback(() => setIsAlertOpen(false), [])}
          title="Selection Required"
          size="sm"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-200">
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            </div>
            <h3 id="teacher-selection-alert-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {alertMessage || 'Please Select Teachers first'}
            </h3>
            <p id="teacher-selection-alert-desc" className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select one or more teachers using the checkboxes to continue.
            </p>
            <button
              type="button"
              autoFocus
              aria-labelledby="teacher-selection-alert-title"
              aria-describedby="teacher-selection-alert-desc"
              onClick={useCallback(() => setIsAlertOpen(false), [])}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Got it
            </button>
          </div>
        </Modal>

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
