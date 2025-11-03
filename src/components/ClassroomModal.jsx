// 

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Building, 
  BookOpen, 
  User, 
  UserCheck,
  AlertCircle,
  Loader2,
  ChevronDown,
  Search,
  Check,
  Trash2
} from 'lucide-react';
import Toast from './Toast';
import SearchableDropdown from './SearchableDropdown';

const ClassroomModal = ({ isOpen, onClose, classroom, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    course: '',
    section: '',
    classroom: '',
    status: 'yes',
    subjectTeachers: {},
    classTeacher: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Course data from the course module
  const courseData = [
    { id: 1, class: 'Nursery', sectionName: 'A, B' },
    { id: 2, class: 'Lkg', sectionName: 'A, B, C' },
    { id: 3, class: 'Ukg', sectionName: 'A, B' },
    { id: 4, class: 'Class 1', sectionName: 'A, B, C, D' },
    { id: 5, class: 'Class 2', sectionName: 'A, B, C' },
    { id: 6, class: 'Class 3', sectionName: 'A, B, C, D' },
    { id: 7, class: 'Class 4', sectionName: 'A, B, C' },
    { id: 8, class: 'Class 5', sectionName: 'A, B, C, D' },
    { id: 9, class: 'Class 6', sectionName: 'A, B, C' },
    { id: 10, class: 'Class 7', sectionName: 'A, B, C, D' },
    { id: 11, class: 'Class 8', sectionName: 'A, B, C' },
    { id: 12, class: 'Class 9', sectionName: 'A, B, C, D' },
    { id: 13, class: 'Class 10', sectionName: 'A, B, C' },
    { id: 14, class: 'Alumni', sectionName: 'A, B' }
  ];

  // Extract courses and sections from course data
  const courses = courseData.map(course => course.class);
  
  // Get sections for selected course
  const getSectionsForCourse = (courseName) => {
    const course = courseData.find(c => c.class === courseName);
    if (course) {
      return course.sectionName.split(', ').map(section => section.trim());
    }
    return [];
  };

  // Get current sections based on selected course
  const currentSections = getSectionsForCourse(formData.course);

  // Available subjects for different courses
  const getSubjectsForCourse = (course) => {
    const subjectMap = {
      'Nursery': ['English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes'],
      'Lkg': ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      'Ukg': ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      'Class 1': ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      'Class 2': ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      'Class 3': ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'],
      'Class 4': ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      'Class 5': ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      'Class 6': ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      'Class 7': ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      'Class 8': ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      'Class 9': ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      'Class 10': ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      'Alumni': ['English']
    };
    return subjectMap[course] || [];
  };

  // Get subjects for current course
  const currentSubjects = getSubjectsForCourse(formData.course);

  // Available teachers - populated from Teachers module
  const allTeachers = [
    'Vehicle Staff',
    'Principal', 
    'Teacher',
    'John Smith',
    'Sarah Johnson',
    'Anu Shrestha',
    'Sharmila',
    'Admin',
    'Coordinator',
    '-- Select Teacher --'
  ];

  // Status options
  const statusOptions = ['yes', 'no'];

  useEffect(() => {
    if (classroom && mode === 'edit') {
      // Parse classroom name to extract course and section
      const classroomName = classroom.classroom || '';
      const parts = classroomName.split(' - ');
      const course = parts[0] || '';
      const section = parts[1] || '';
      
      // Determine status from isActive if status field doesn't exist
      let statusValue = classroom.status;
      if (!statusValue && typeof classroom.isActive === 'boolean') {
        statusValue = classroom.isActive ? 'yes' : 'no';
      } else if (!statusValue) {
        statusValue = 'yes'; // Default
      }
      
      setFormData({
        course: course,
        section: section,
        classroom: classroomName,
        status: statusValue,
        subjectTeachers: classroom.subjectTeachers || {},
        classTeacher: classroom.classTeacher || ''
      });
    } else {
      setFormData({
        course: '',
        section: '',
        classroom: '',
        status: 'yes',
        subjectTeachers: {},
        classTeacher: ''
      });
    }
    setErrors({});
  }, [classroom, mode, isOpen]);

  // Clear section when course changes
  useEffect(() => {
    if (formData.course) {
      const availableSections = getSectionsForCourse(formData.course);
      if (!availableSections.includes(formData.section)) {
        setFormData(prev => ({
          ...prev,
          section: '',
          classroom: ''
        }));
      }
    }
  }, [formData.course]);

  // Auto-generate classroom name when course and section change
  useEffect(() => {
    if (formData.course && formData.section) {
      setFormData(prev => ({
        ...prev,
        classroom: `${formData.course} - ${formData.section}`
      }));
    }
  }, [formData.course, formData.section]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectTeacherChange = (subject, teacher) => {
    setFormData(prev => ({
      ...prev,
      subjectTeachers: {
        ...prev.subjectTeachers,
        [subject]: teacher
      }
    }));
  };

  const handleClassTeacherChange = (teacher) => {
    setFormData(prev => ({
      ...prev,
      classTeacher: teacher
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }
    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }
    if (!formData.classroom.trim()) {
      newErrors.classroom = 'Classroom name is required';
    }
    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }
    if (!formData.classTeacher.trim()) {
      newErrors.classTeacher = 'Class teacher is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare complete classroom data
      const classroomData = {
        ...formData,
        // Generate subjects and teachers arrays from subjectTeachers
        subjects: Object.keys(formData.subjectTeachers),
        teachers: Object.values(formData.subjectTeachers),
        // Use the selected class teacher
        classTeacher: formData.classTeacher,
        // Ensure isActive is set
        isActive: formData.status === 'yes'
      };
      
      console.log('Saving classroom data:', classroomData);
      onSave(classroomData);
      
      setToast({ isVisible: true, message: 'Classroom saved successfully!', type: 'success' });
      
      // Close modal after showing toast
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving classroom:', error);
      setToast({ isVisible: true, message: 'Failed to save. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all overflow-visible">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl ${
            mode === 'create' 
              ? 'border-green-200 dark:border-green-700' 
              : 'border-blue-200 dark:border-blue-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                mode === 'create' 
                  ? 'bg-green-500' 
                  : 'bg-blue-500'
              }`}>
                {mode === 'create' ? <Plus className="w-6 h-6 text-white" /> : <Save className="w-6 h-6 text-white" />}
              </div>
              <h2 className={`text-2xl font-bold ${
                mode === 'create' 
                  ? 'text-green-700 dark:text-green-400' 
                  : 'text-blue-700 dark:text-blue-400'
              }`}>
                {mode === 'edit' ? 'Update Classroom' : 'Add New Classroom'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure classroom details</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <SearchableDropdown
                      label=""
                      placeholder="Select Course"
                      options={courses}
                      value={formData.course}
                      onChange={(course) => {
                        setFormData(prev => ({ ...prev, course }));
                        if (errors.course) {
                          setErrors(prev => ({ ...prev, course: '' }));
                        }
                      }}
                      error={errors.course}
                      required={true}
                      multiple={false}
                      searchable={true}
                    />
                  </div>

                  {/* Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, section: e.target.value }));
                        if (errors.section) {
                          setErrors(prev => ({ ...prev, section: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.section 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                      <option value="">Select Section</option>
                      {currentSections.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                    {errors.section && (
                      <p className="mt-1 text-sm text-red-500">{errors.section}</p>
                    )}
                  </div>

                  {/* Classroom Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Classroom Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="classroom"
                        value={formData.classroom}
                        onChange={handleChange}
                        placeholder="Auto-generated from Course and Section"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.classroom 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>
                    {errors.classroom && (
                      <p className="mt-1 text-sm text-red-500">{errors.classroom}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, status: e.target.value }));
                        if (errors.status) {
                          setErrors(prev => ({ ...prev, status: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.status 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status === 'yes' ? 'Yes' : 'No'}
                        </option>
                      ))}
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject and Teacher Assignment Section */}
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subject & Teacher Assignment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assign teachers to subjects for this classroom</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {currentSubjects.length > 0 ? (
                      currentSubjects.map((subject, index) => {
                        const isEvenIndex = index % 2 === 0;
                        const isLastRow = index >= currentSubjects.length - (currentSubjects.length % 2 || 2);
                        
                        return (
                          <div 
                            key={subject} 
                            className={`flex items-center gap-3 p-4 ${
                              !isLastRow ? 'border-b border-gray-100 dark:border-gray-700' : ''
                            } ${
                              isEvenIndex && index !== currentSubjects.length - 1 
                                ? 'border-r border-gray-100 dark:border-gray-700' 
                                : ''
                            } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200`}
                          >
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                                  {subject}
                                </span>
                                <SearchableDropdown
                                  placeholder="Select Teacher"
                                  options={allTeachers}
                                  value={formData.subjectTeachers[subject] || ''}
                                  onChange={(teacher) => handleSubjectTeacherChange(subject, teacher)}
                                  multiple={false}
                                  searchable={true}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 p-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm">Please select a course to see available subjects</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Class Teacher Selection */}
              <div className="bg-gradient-to-r from-green-50/50 to-teal-50/50 dark:from-green-900/10 dark:to-teal-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Class Teacher</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select the primary teacher for this classroom</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Class Teacher <span className="text-red-500">*</span>
                    </label>
                    <SearchableDropdown
                      placeholder="Select Class Teacher"
                      options={allTeachers}
                      value={formData.classTeacher}
                      onChange={handleClassTeacherChange}
                      multiple={false}
                      searchable={true}
                      error={errors.classTeacher}
                    />
                
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    mode === 'create'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {mode === 'create' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                      {mode === 'edit' ? 'Update' : 'Add'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
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

export default ClassroomModal;
