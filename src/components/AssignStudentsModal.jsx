import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  UserPlus, 
  Filter,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import Toast from './Toast';

const AssignStudentsModal = ({ isOpen, onClose, classroom, onAssign }) => {
  const [filters, setFilters] = useState({
    batch: '',
    class: '',
    section: ''
  });
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  // Mock available students data - replace with actual API call
  const [availableStudents, setAvailableStudents] = useState([
    {
      id: 101,
      studentId: 'STU101',
      name: 'Michael Brown',
      contact: '9818555666',
      course: 'Class 8',
      batch: '2082',
      section: 'A'
    },
    {
      id: 102,
      studentId: 'STU102',
      name: 'Sarah Wilson',
      contact: '9818555667',
      course: 'Class 8',
      batch: '2082',
      section: 'A'
    },
    {
      id: 103,
      studentId: 'STU103',
      name: 'David Lee',
      contact: '9818555668',
      course: 'Class 8',
      batch: '2081',
      section: 'A'
    },
    {
      id: 104,
      studentId: 'STU104',
      name: 'Emily Chen',
      contact: '9818555669',
      course: 'Class 8',
      batch: '2082',
      section: 'B'
    },
  ]);

  // Extract unique batches, classes, and sections from available students
  const batches = [...new Set(availableStudents.map(s => s.batch))].sort();
  const classes = [...new Set(availableStudents.map(s => s.course))].sort();
  const sections = [...new Set(availableStudents.map(s => s.section))].sort();

  // Filter students based on selected filters
  const filteredStudents = availableStudents.filter(student => {
    if (filters.batch && student.batch !== filters.batch) return false;
    if (filters.class && student.course !== filters.class) return false;
    if (filters.section && student.section !== filters.section) return false;
    return true;
  });

  // Reset filters
  const handleReset = useCallback(() => {
    setFilters({
      batch: '',
      class: '',
      section: ''
    });
    setSelectedStudents(new Set());
    setErrors({});
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear errors when filter changes
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  }, [errors]);

  // Handle student selection
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
    // Clear error when student is selected
    if (errors.students) {
      setErrors(prev => ({ ...prev, students: '' }));
    }
  }, [errors]);

  // Handle select all
  const handleSelectAll = useCallback((isChecked) => {
    if (isChecked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  }, [filteredStudents]);

  // Validate form
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (selectedStudents.size === 0) {
      newErrors.students = 'The Student List field is required';
    }
    
    return newErrors;
  }, [selectedStudents]);

  // Handle assign
  const handleAssign = useCallback(async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({
        isVisible: true,
        message: 'Please select at least one student to assign',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get selected student objects
      const assignedStudents = filteredStudents.filter(s => selectedStudents.has(s.id));
      
      // Call parent handler
      onAssign(assignedStudents);
      
      // Reset form
      handleReset();
      
      setToast({
        isVisible: true,
        message: `${assignedStudents.length} student(s) assigned successfully!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error assigning students:', error);
      setToast({
        isVisible: true,
        message: 'Failed to assign students. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudents, filteredStudents, validate, onAssign, handleReset]);

  // Reset on modal close
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen, handleReset]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all overflow-visible max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Assign Students to Classroom
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {classroom?.classroom || 'Classroom'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filter Section */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Students</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use filters to find eligible students</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Batch Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Batch
                  </label>
                  <select
                    value={filters.batch}
                    onChange={(e) => handleFilterChange('batch', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">All Batches</option>
                    {batches.map(batch => (
                      <option key={batch} value={batch}>
                        Batch {batch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Class
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) => handleFilterChange('class', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Section
                  </label>
                  <select
                    value={filters.section}
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">All Sections</option>
                    {sections.map(section => (
                      <option key={section} value={section}>
                        Section {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Select All ({filteredStudents.length} students)
                    </span>
                  </div>
                  {selectedStudents.size > 0 && (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {selectedStudents.size} selected
                    </span>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {errors.students && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/30">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{errors.students}</span>
                  </div>
                </div>
              )}

              {/* Student List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No students found matching the filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student.id)}
                            onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.studentId}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.contact}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Batch</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.batch}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Assign To Classroom
                    </>
                  )}
                </button>
              </div>
            </div>
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

export default AssignStudentsModal;

