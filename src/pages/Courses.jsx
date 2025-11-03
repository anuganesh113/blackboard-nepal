import React, { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
  GraduationCap,
  Users,
  BookOpen,
  DollarSign,
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
import CourseModal from '../components/CourseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Tooltip from '../components/Tooltip';
import SubjectsModal from '../components/SubjectsModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';
import { getSequentialSerialNumber } from '../utils/tableUtils.jsx';

const Courses = () => {
  const { playNotificationSound } = useSound();
  
  // Sample data - replace with API call
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      class: 'Nursery', 
      sectionName: 'A, B', 
      subjectName: ['English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 2, 
      class: 'Lkg', 
      sectionName: 'A, B, C', 
      subjectName: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 3, 
      class: 'Ukg', 
      sectionName: 'A, B', 
      subjectName: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 4, 
      class: 'Class 1', 
      sectionName: 'A, B, C, D', 
      subjectName: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 5, 
      class: 'Class 2', 
      sectionName: 'A, B, C', 
      subjectName: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 6, 
      class: 'Class 3', 
      sectionName: 'A, B, C, D', 
      subjectName: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 7, 
      class: 'Class 4', 
      sectionName: 'A, B, C', 
      subjectName: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 8, 
      class: 'Class 5', 
      sectionName: 'A, B, C, D', 
      subjectName: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 9, 
      class: 'Class 6', 
      sectionName: 'A, B, C', 
      subjectName: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 10, 
      class: 'Class 7', 
      sectionName: 'A, B, C, D', 
      subjectName: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 11, 
      class: 'Class 8', 
      sectionName: 'A, B, C', 
      subjectName: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 12, 
      class: 'Class 9', 
      sectionName: 'A, B, C, D', 
      subjectName: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 13, 
      class: 'Class 10', 
      sectionName: 'A, B, C', 
      subjectName: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 14, 
      class: 'Alumuni', 
      sectionName: 'A, B', 
      subjectName: ['English'], 
      feeCost: 'Course fee not assigned' 
    },
    { 
      id: 15, 
      class: 'Alumini', 
      sectionName: 'A', 
      subjectName: ['English'], 
      feeCost: 'Course fee not assigned' 
    }
  ]);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'create'
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [selectedCourseSubjects, setSelectedCourseSubjects] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [filteredData, setFilteredData] = useState(courses); // For export - stores filtered table data

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
      key: 'class',
      label: 'Course',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {item.class}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'sectionName',
      label: 'Sections',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.sectionName}
          </span>
        </div>
      )
    },
    {
      key: 'subjectName',
      label: 'Subjects',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {item.subjectName.slice(0, 3).map((subject, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30"
              >
                {subject}
              </span>
            ))}
            {item.subjectName.length > 3 && (
              <button
                onClick={() => handleShowAllSubjects(item)}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/30 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Tooltip content={`View all ${item.subjectName.length} subjects`} position="top">
                  <span>+{item.subjectName.length - 3} more</span>
                </Tooltip>
              </button>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'feeCost',
      label: 'Fee Cost',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.feeCost}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (item) => {
        const actions = [
          {
            key: 'showSubjects',
            type: 'view',
            title: 'Show All Subjects',
            className: 'text-blue-600 dark:text-blue-400',
            handler: handleShowAllSubjects
          },
          {
            key: 'edit',
            type: 'edit',
            title: 'Edit Course',
            className: 'text-green-600 dark:text-green-400',
            handler: handleEdit
          },
          {
            key: 'delete',
            type: 'delete',
            title: 'Delete Course',
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
    placeholder: 'Search courses...',
    searchFields: ['class', 'sectionName', 'subjectName', 'feeCost'],
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
        key: 'class',
        label: 'Class Level',
        type: 'select',
        allLabel: 'All Classes',
        tooltip: 'Filter courses by class level',
        options: [
          { value: 'nursery', label: '🎓 Nursery' },
          { value: 'lkg', label: '👶 LKG' },
          { value: 'ukg', label: '🧒 UKG' },
          { value: 'primary', label: '📚 Primary (1-5)' },
          { value: 'secondary', label: '🎓 Secondary (6-10)' }
        ],
        filterFn: (item, value) => {
          if (value === 'nursery') return item.class.toLowerCase().includes('nursery');
          if (value === 'lkg') return item.class.toLowerCase().includes('lkg');
          if (value === 'ukg') return item.class.toLowerCase().includes('ukg');
          if (value === 'primary') return ['class 1', 'class 2', 'class 3', 'class 4', 'class 5'].some(cls => item.class.toLowerCase().includes(cls));
          if (value === 'secondary') return ['class 6', 'class 7', 'class 8', 'class 9', 'class 10'].some(cls => item.class.toLowerCase().includes(cls));
          return true;
        }
      }
    ]
  }), []);

  // Event handlers
  const handleEdit = useCallback((course) => {
    setSelectedCourse(course);
    setModalMode('edit');
    setIsCourseModalOpen(true);
  }, []);

  const handleDelete = useCallback((course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedCourse(null);
    setModalMode('create');
    setIsCourseModalOpen(true);
  }, []);

  const handleShowAllSubjects = useCallback((course) => {
    setSelectedCourseSubjects(course.subjectName);
    setSelectedCourseName(`${course.class} - ${course.sectionName}`);
    setIsSubjectsModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (courseToDelete) {
      const courseName = `${courseToDelete.class} - ${courseToDelete.sectionName}`;
      setCourses(courses.filter(c => c.id !== courseToDelete.id));
      console.log('Deleted course:', courseToDelete);
      setCourseToDelete(null);
      
      // Play delete notification sound
      playNotificationSound('delete');
      
      setToast({
        isVisible: true,
        message: `"${courseName}" has been deleted successfully!`,
        type: 'success'
      });
    }
  }, [courseToDelete, courses, playNotificationSound]);

  const handleSaveCourse = useCallback((updatedCourse) => {
    if (modalMode === 'edit') {
      // Update existing course
      setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      console.log('Updated course:', updatedCourse);
      
      // Play edit notification sound
      playNotificationSound('edit');
      
      setToast({
        isVisible: true,
        message: `"${updatedCourse.class} - ${updatedCourse.sectionName}" has been updated successfully!`,
        type: 'success'
      });
    } else {
      // Create new course
      const newCourse = {
        ...updatedCourse,
        id: Math.max(...courses.map(c => c.id)) + 1
      };
      setCourses([...courses, newCourse]);
      console.log('Created course:', newCourse);
      
      // Play add notification sound
      playNotificationSound('add');
      
      setToast({
        isVisible: true,
        message: `"${newCourse.class} - ${newCourse.sectionName}" has been added successfully!`,
        type: 'success'
      });
    }
  }, [modalMode, courses, playNotificationSound]);

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
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
                    <GraduationCap className="w-6 h-6 text-white" />
              </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-indigo-900 dark:from-white dark:via-emerald-100 dark:to-indigo-100 bg-clip-text text-transparent">
                      Course Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                      Manage academic courses, sections, and subject assignments
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
                dataType="courses"
                columns={columns}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                buttonVariant="purple"
              />

              {/* Add Course Button */}
              <Button
                variant="success"
                icon={<Plus />}
                onClick={handleAddNew}
              >
                Add Course
              </Button>
                          </div>
                        </div>
          </div>

        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={courses}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            filterConfig={filterConfig}
            emptyMessage="No courses found matching your filters"
            className=""
            onFilteredDataChange={setFilteredData}
          />
        </Card>
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={useCallback(() => setIsCourseModalOpen(false), [])}
        course={selectedCourse}
        onSave={handleSaveCourse}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={useCallback(() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }, [])}
        onConfirm={confirmDelete}
        itemName={courseToDelete ? `${courseToDelete.class} - ${courseToDelete.sectionName}` : ''}
        itemType="course"
      />

      {/* Subjects Modal */}
      <SubjectsModal
        isOpen={isSubjectsModalOpen}
        onClose={useCallback(() => setIsSubjectsModalOpen(false), [])}
        subjects={selectedCourseSubjects}
        courseName={selectedCourseName}
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

export default Courses;
