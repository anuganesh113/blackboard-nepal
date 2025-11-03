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
    subjectTeachers: {}
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Available courses
  const courses = [
    'Nursery', 'Lkg', 'Ukg', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 
    'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Alumni'
  ];

  // Available sections
  const sections = ['A', 'B', 'C', 'D'];

  // Available subjects for Nursery
  const nurserySubjects = [
    'English', 'Nepali', 'Maths', 'English Oral', 'Nepali Oral', 'Maths Oral', 'Rhymes', 'Hygiene'
  ];

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
    '-- Select Option --'
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
      
      setFormData({
        course: course,
        section: section,
        classroom: classroomName,
        status: classroom.status || 'yes',
        subjectTeachers: classroom.subjectTeachers || {}
      });
    } else {
      setFormData({
        course: '',
        section: '',
        classroom: '',
        status: 'yes',
        subjectTeachers: {}
      });
    }
    setErrors({});
  }, [classroom, mode, isOpen]);

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
      
      onSave(formData);
      
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
                      {sections.map((section) => (
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
                          {status === 'yes' ? 'Active' : 'Inactive'}
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
                  <div className="grid grid-cols-1 gap-0">
                    {nurserySubjects.map((subject, index) => (
                      <div key={subject} className={`flex items-center gap-4 p-4 ${
                        index !== nurserySubjects.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                      } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200`}>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-40">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {subject}
                              </span>
                            </div>
                            <div className="flex-1">
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
                      </div>
                    ))}
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
