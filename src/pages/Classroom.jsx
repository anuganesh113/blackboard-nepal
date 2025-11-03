import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Users,
} from 'lucide-react';
import { DataTable } from '../components/ui';
import { Button, Card } from '../design-system';
import ClassroomModal from '../components/ClassroomModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ClassroomDetailsModal from '../components/ClassroomDetailsModal';
import ManageStudentsView from '../components/ManageStudentsView';
import Toast from '../components/Toast';
import ActionDropdown from '../components/ActionDropdown';
import ExportDropdown from '../components/ExportDropdown';
import Tooltip from '../components/Tooltip';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

const Classroom = () => {
  const { playNotificationSound } = useSound();
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      classroom: 'Nursery - A',
      course: 'Nursery',
      section: 'A',
      subjects: ['English', 'Nepali', 'Maths', 'English Oral', 'Nepali Oral', 'Maths Oral', 'Rhymes', 'Hygiene'],
      teachers: ['Anu Shrestha', 'Sharmila', 'Teacher', 'Teacher'],
      classTeacher: 'Sharmila',
      isActive: true,
    },
    {
      id: 2,
      classroom: 'Nursery - B',
      course: 'Nursery',
      section: 'B',
      subjects: ['English', 'Nepali', 'Maths', 'Rhymes'],
      teachers: ['Teacher1', 'Teacher2', 'Teacher3'],
      classTeacher: 'Teacher1',
      isActive: true,
    },
    {
      id: 3,
      classroom: 'Lkg - A',
      course: 'Lkg',
      section: 'A',
      subjects: ['Drawing', 'Maths', 'Rhymes', 'English Oral'],
      teachers: ['Teacher4', 'Teacher5'],
      classTeacher: 'Teacher5',
      isActive: true,
    },
    {
      id: 4,
      classroom: 'Lkg - B',
      course: 'Lkg',
      section: 'B',
      subjects: ['Science', 'Maths', 'Nepali'],
      teachers: ['Teacher9', 'Teacher10'],
      classTeacher: 'Teacher9',
      isActive: true,
    },
    {
      id: 5,
      classroom: 'Class 1 - A',
      course: 'Class 1',
      section: 'A',
      subjects: ['English', 'Science', 'Maths', 'Nepali'],
      teachers: ['Teacher6', '-'],
      classTeacher: 'Teacher6',
      isActive: false,
    },
    {
      id: 6,
      classroom: 'Class 1 - B',
      course: 'Class 1',
      section: 'B',
      subjects: ['English', 'General Knowledge', 'Maths'],
      teachers: ['Teacher7'],
      classTeacher: 'Teacher7',
      isActive: true,
    },
    {
      id: 7,
      classroom: 'Class 2 - A',
      course: 'Class 2',
      section: 'A',
      subjects: ['Nepali', 'Drawing', 'Science'],
      teachers: ['Teacher8', 'Teacher3'],
      classTeacher: 'Teacher3',
      isActive: true,
    },
    {
      id: 8,
      classroom: 'Class 2 - B',
      course: 'Class 2',
      section: 'B',
      subjects: ['English', 'Computer'],
      teachers: ['Teacher10'],
      classTeacher: 'Teacher10',
      isActive: false,
    },
    {
      id: 9,
      classroom: 'Class 3 - A',
      course: 'Class 3',
      section: 'A',
      subjects: ['Maths', 'Science', 'Computer', 'Drawing'],
      teachers: ['Teacher11', 'Teacher12', 'Teacher13'],
      classTeacher: 'Teacher12',
      isActive: true,
    },
    {
      id: 10,
      classroom: 'Class 4 - A',
      course: 'Class 4',
      section: 'A',
      subjects: ['Social', 'English', 'Maths', 'Science'],
      teachers: ['Teacher14', 'Teacher15', 'Teacher16'],
      classTeacher: 'Teacher14',
      isActive: true,
    },
    // Add more if needed
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsModalType, setDetailsModalType] = useState('subjects');
  const [showDisabled, setShowDisabled] = useState(null); // null = all, 'inactive' = disabled only, 'active' = active only
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [filteredData, setFilteredData] = useState([]); // For export - stores filtered table data from DataTable
  const [manageStudentsClassroom, setManageStudentsClassroom] = useState(null); // Track which classroom's students are being managed

  // Normalize classroom data on mount to ensure isActive is always a boolean
  useEffect(() => {
    setClassrooms(prev => {
      // Check if normalization is needed
      const needsNormalization = prev.some(classroom => typeof classroom.isActive !== 'boolean');
      
      if (!needsNormalization) {
        // All classrooms already have boolean isActive, no need to update
        return prev;
      }
      
      // Normalize classrooms that don't have boolean isActive
      return prev.map(classroom => {
        // If isActive is already a proper boolean, keep it unchanged
        if (typeof classroom.isActive === 'boolean') {
          return classroom;
        }
        // Otherwise, normalize based on status field
        const normalizedIsActive = classroom.status === 'no' || classroom.status === false 
          ? false 
          : (classroom.status === 'yes' || classroom.status === true ? true : true);
        return {
          ...classroom,
          isActive: normalizedIsActive
        };
      });
    });
  }, []); // Run once on mount

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

  // DataTable columns
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: getSequentialSerialNumber,
    },
    {
      key: 'classroom',
      label: 'Classroom',
      sortable: true,
      render: (item) => <span className="font-medium text-gray-900 dark:text-white text-sm">{item.classroom}</span>,
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (item) => <span className="font-medium text-gray-900 dark:text-white text-sm">{item.course}</span>,
    },
    {
      key: 'subjects',
      label: 'Subjects',
      sortable: false,
      render: (item) => {
        const subjects = item.subjects || [];
        const shown = subjects.slice(0, 3);
        return (
          <div className="max-w-xs">
            <ul className="space-y-1">
              {shown.map((subject, idx) => (
                <li key={`${subject}-${idx}`} className="text-sm text-gray-900 dark:text-gray-100">
                  {subject}
                </li>
              ))}
            </ul>
            {subjects.length > 3 && (
              <Tooltip content={`View all ${subjects.length} subjects`} position="top">
              <button
                onClick={() => handleViewAll(item, 'subjectTeachers')}
                className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/30 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                View all
              </button>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      key: 'teachers',
      label: 'Teachers',
      sortable: false,
      render: (item) => {
        const subjects = item.subjects || [];
        const shownSubjects = subjects.slice(0, 3);
        const mapping = item.subjectTeachers || {};
        const fallback = item.teachers || [];
        const teachersForShown = shownSubjects.map((s, i) => mapping[s] || fallback[i] || '-');
        return (
          <div className="max-w-xs">
            <ul className="space-y-1">
              {teachersForShown.map((teacher, idx) => (
                <li key={`${teacher}-${idx}`} className={`text-sm ${teacher === '-' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                  {teacher}
                </li>
              ))}
            </ul>
            {subjects.length > 3 && (
              <Tooltip content={`View all teachers for ${subjects.length} subjects`} position="top">
              <button
                onClick={() => handleViewAll(item, 'subjectTeachers')}
                className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/30 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                View all
              </button>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      key: 'classTeacher',
      label: 'Class Teacher',
      sortable: true,
      render: (item) => (<span className="font-medium text-gray-900 dark:text-white text-sm">{item.classTeacher}</span>),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (item) => (
        <div className="flex justify-center">
          <ActionDropdown
            actions={[
              {
                key: 'manageStudents',
                type: 'manageStudents',
                title: 'Manage Students',
                className: 'text-blue-600 dark:text-blue-400',
                handler: handleManageStudents
              },
              {
                key: 'edit',
                type: 'edit',
                title: 'Edit Classroom',
                className: 'text-green-600 dark:text-green-400',
                handler: handleEditClassroom
              },
              {
                key: 'delete',
                type: 'delete',
                title: 'Delete Classroom',
                className: 'text-red-600 dark:text-red-400',
                handler: handleDeleteClassroom
              },
            ]}
            item={item}
            position="bottom-end"
            className="flex justify-center"
          />
        </div>
      )
    }
  ], []);

  // DataTable config
  const searchConfig = useMemo(() => ({
    placeholder: 'Search classrooms...',
    searchFields: ['classroom', 'course', 'section', 'classTeacher', 'subjects', 'teachers'],
  }), []);
  const paginationConfig = useMemo(() => ({
    entriesPerPage: 25,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [10, 25, 50, 100, -1]
  }), []);
  const filterConfig = useMemo(() => ({
    showFilters: true,
    filters: [
      {
        key: 'course',
        label: 'Course',
        type: 'select',
        allLabel: 'All Courses',
        tooltip: 'Filter classrooms by course',
        options: [
          { value: 'nursery', label: '🎓 Nursery' },
          { value: 'lkg', label: '👶 LKG' },
          { value: 'ukg', label: '🧒 UKG' },
          { value: 'primary', label: '📚 Primary (1-5)' },
          { value: 'secondary', label: '🎓 Secondary (6-10)' },
          { value: 'alumni', label: '🎓 Alumni' }
        ],
        filterFn: (item, value) => {
          if (value === 'nursery') return item.course.toLowerCase().includes('nursery');
          if (value === 'lkg') return item.course.toLowerCase().includes('lkg');
          if (value === 'ukg') return item.course.toLowerCase().includes('ukg');
          if (value === 'primary') return ['class 1', 'class 2', 'class 3', 'class 4', 'class 5'].some(cls => item.course.toLowerCase().includes(cls));
          if (value === 'secondary') return ['class 6', 'class 7', 'class 8', 'class 9', 'class 10'].some(cls => item.course.toLowerCase().includes(cls));
          if (value === 'alumni') return item.course.toLowerCase().includes('alumni') || item.course.toLowerCase().includes('alumuni') || item.course.toLowerCase().includes('alumini');
          return true;
        }
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        allLabel: 'All Status',
        tooltip: 'Filter classrooms by active status',
        options: [
          { value: 'active', label: '✅ Active' },
          { value: 'inactive', label: '❌ Inactive' }
        ],
        filterFn: (item, value) => {
          // Early return: if no filter value or 'all', show all items
          if (!value || value === 'all' || value === '' || value === null || value === undefined) {
            return true;
          }
          
          // Normalize filter value first
          const filterValue = String(value).toLowerCase().trim();
          
          // Get the item's active status - STRICTLY use isActive boolean field ONLY
          // Do NOT use status field as fallback to avoid conflicts
          let isItemActive;
          
          // ONLY check isActive field - it's the single source of truth
          if (item.hasOwnProperty('isActive') && typeof item.isActive === 'boolean') {
            isItemActive = item.isActive === true; // Explicit boolean check
          } else {
            // If isActive doesn't exist or isn't a boolean, this shouldn't happen
            // But if it does, default to false (inactive) for safety
            console.warn(`Classroom ${item.id} (${item.classroom}) has invalid isActive value:`, item.isActive);
            isItemActive = false;
          }
          
          // Apply filter with strict boolean comparison
          if (filterValue === 'active') {
            // For active: return true ONLY if isActive is explicitly true
            return isItemActive === true;
          }
          
          if (filterValue === 'inactive') {
            // For inactive: return true ONLY if isActive is explicitly false
            return isItemActive === false;
          }
          
          // Unknown filter value - hide item
          return false;
        }
      }
    ]
  }), []);

  // Table action functions
  const handleEditClassroom = useCallback((classroom) => {
    setEditingClassroom(classroom);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClassroom = useCallback((classroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddClassroom = useCallback(() => {
    setEditingClassroom(null);
    setIsModalOpen(true);
  }, []);

  const handleManageStudents = useCallback((classroom) => {
    setManageStudentsClassroom(classroom);
  }, []);

  const handleBackFromStudents = useCallback(() => {
    setManageStudentsClassroom(null);
  }, []);

  const handleViewAll = useCallback((classroom, type) => {
    setSelectedClassroom(classroom);
    setDetailsModalType(type);
    setIsDetailsModalOpen(true);
  }, []);

  const handleSaveClassroom = useCallback((classroomData) => {
    // Determine isActive value - prioritize explicit isActive boolean
    let isActiveValue;
    if (typeof classroomData.isActive === 'boolean') {
      isActiveValue = classroomData.isActive;
    } else if (classroomData.status !== undefined && classroomData.status !== null) {
      // Convert status to boolean
      const statusStr = String(classroomData.status).toLowerCase().trim();
      isActiveValue = (statusStr === 'yes' || statusStr === 'true' || classroomData.status === true);
    } else {
      // Default to true for new classrooms, preserve existing for edits
      isActiveValue = editingClassroom ? (editingClassroom.isActive !== false) : true;
    }
    
    // Create normalized data with guaranteed boolean isActive
    // Keep status field for modal compatibility, but isActive is the source of truth for filtering
    const normalizedData = {
      ...classroomData,
      isActive: isActiveValue
    };
    
    if (editingClassroom) {
      setClassrooms(prev => prev.map(c => 
        c.id === editingClassroom.id ? { ...c, ...normalizedData } : c
      ));
      playNotificationSound('edit');
      setToast({
        isVisible: true,
        message: 'Classroom updated successfully!',
        type: 'success',
      });
    } else {
      const newClassroom = {
        id: Math.max(...classrooms.map(c => c.id), 0) + 1,
        ...normalizedData,
        isActive: isActiveValue
      };
      setClassrooms(prev => [...prev, newClassroom]);
      playNotificationSound('add');
      setToast({
        isVisible: true,
        message: 'Classroom added successfully!',
        type: 'success',
      });
    }
    setIsModalOpen(false);
    setEditingClassroom(null);
  }, [editingClassroom, classrooms, playNotificationSound]);

  const handleConfirmDelete = useCallback(() => {
    if (selectedClassroom) {
      setClassrooms(prev => prev.filter(c => c.id !== selectedClassroom.id));
      playNotificationSound('delete');
      setToast({
        isVisible: true,
        message: 'Classroom deleted successfully!',
        type: 'success',
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedClassroom(null);
  }, [selectedClassroom, playNotificationSound]);

  const handleToggleDisabled = () => {
    if (showDisabled === null) {
      // Currently showing all, switch to showing only disabled
      setShowDisabled('inactive');
      setToast({
        isVisible: true,
        message: 'Showing disabled classrooms only',
        type: 'info',
      });
    } else if (showDisabled === 'inactive') {
      // Currently showing disabled, switch to showing only active
      setShowDisabled('active');
      setToast({
        isVisible: true,
        message: 'Showing active classrooms only',
        type: 'info',
      });
    } else {
      // Currently showing active, switch back to showing all
      setShowDisabled(null);
      setToast({
        isVisible: true,
        message: 'Showing all classrooms',
        type: 'info',
      });
    }
  };

  // Filter classrooms based on showDisabled state
  const filteredClassrooms = useMemo(() => {
    if (showDisabled === 'inactive') {
      // Show only inactive classrooms when "Disabled Classroom" button is clicked
      return classrooms.filter(classroom => {
        // Check isActive field - must be explicitly false
        return typeof classroom.isActive === 'boolean' && classroom.isActive === false;
      });
    } else if (showDisabled === 'active') {
      // Show only active classrooms when "Active Classroom" button is clicked
      return classrooms.filter(classroom => {
        // Check isActive field - must be explicitly true
        return typeof classroom.isActive === 'boolean' && classroom.isActive === true;
      });
    } else {
      // Show all classrooms (both active and inactive) by default
      return classrooms;
    }
  }, [classrooms, showDisabled]);

  // If managing students, show the ManageStudentsView
  if (manageStudentsClassroom) {
    return (
      <ManageStudentsView 
        classroom={manageStudentsClassroom}
        onBack={handleBackFromStudents}
      />
    );
  }

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-indigo-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-indigo-950/20" />
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
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
          <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-indigo-900 dark:from-white dark:via-emerald-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Classroom Management
            </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
              Manage and organize your classrooms
            </p>
          </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDisabled}
              className={`group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${
                showDisabled === 'inactive'
                  ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                  : showDisabled === 'active'
                  ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
              } text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{showDisabled === 'inactive' ? 'Active Classroom' : showDisabled === 'active' ? 'Show All' : 'Disabled Classroom'}</span>
            </button>
            
            {/* Export Dropdown */}
            <ExportDropdown
              data={filteredData.length > 0 ? filteredData : filteredClassrooms}
              dataType="classrooms"
              columns={columns}
              onExportSuccess={handleExportSuccess}
              onExportError={handleExportError}
              buttonVariant="purple"
            />

            <Button
              variant="success"
              icon={<Plus />}
              onClick={handleAddClassroom}
            >
              Add Classroom
            </Button>
          </div>
        </div>
              </div>

        {/* Main Content */}
        <Card variant="elevated">
          <DataTable
            data={filteredClassrooms}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage={
              showDisabled === 'inactive' 
                ? "No inactive classrooms found" 
                : showDisabled === 'active'
                ? "No active classrooms found"
                : "No classrooms found"
            }
            onFilteredDataChange={setFilteredData}
          />
        </Card>
      </div>

      {/* Classroom Modal */}
      {isModalOpen && (
        <ClassroomModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClassroom(null);
          }}
          classroom={editingClassroom}
          onSave={handleSaveClassroom}
          mode={editingClassroom ? 'edit' : 'create'}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedClassroom(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedClassroom?.classroom}
          itemType="classroom"
        />
      )}

      {/* Classroom Details Modal */}
      {isDetailsModalOpen && (
        <ClassroomDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedClassroom(null);
          }}
          classroom={selectedClassroom}
          type={detailsModalType}
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

export default Classroom;
