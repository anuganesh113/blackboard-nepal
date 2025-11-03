import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Save, ChevronDown, Search, Check } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

const CourseModal = ({ isOpen, onClose, course, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    name: '',
    subjects: [],
    sections: [],
    status: 'Yes'
  });

  const [errors, setErrors] = useState({});
  const [modalHeight, setModalHeight] = useState('auto');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const modalRef = useRef(null);

  // Comprehensive subject list based on the reference image
  const allSubjects = [
    'Drawing Cursive', 'Hamro Dhangadhi', 'Science Oral', 'Nepali Oral', 'Maths Oral', 
    'English Oral', 'General Knowledge', 'Computer', 'Cursive', 'Drawing', 'English', 
    'Hygiene', 'Maths', 'Nepali', 'Rhymes', 'Science', 'Health and Education', 
    'Social', 'Economics', 'OPT Maths', 'Physics', 'Chemistry', 'Biology', 
    'History', 'Geography', 'Mathematics'
  ];

  // Section options
  const allSections = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Status options
  const statusOptions = ['Yes', 'No'];

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        name: course.class || '', // Map class to name field
        subjects: course.subjectName || [], // Map subjectName to subjects
        sections: course.sectionName ? course.sectionName.split(', ').map(s => s.trim()) : [], // Convert comma-separated string to array
        status: course.status || ''
      });
    } else {
      setFormData({
        name: '',
        subjects: [],
        sections: [],
        status: 'Yes'
      });
    }
    setErrors({});
  }, [course, mode, isOpen]);

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

  // Handle dropdown overflow and calculate required modal height
  const handleDropdownOverflow = (overflowInfo) => {
    if (overflowInfo && overflowInfo.isOverflowing) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Responsive height calculations
      const isMobile = viewportWidth < 768;
      const minModalHeight = isMobile ? 300 : 400; // Smaller minimum on mobile
      const maxModalHeight = isMobile ? viewportHeight * 0.95 : viewportHeight * 0.9;
      
      // Calculate required height with padding for mobile
      const currentModalHeight = modalRef.current?.offsetHeight || 0;
      const mobilePadding = isMobile ? 40 : 0;
      const requiredHeight = Math.max(
        minModalHeight,
        Math.min(maxModalHeight, currentModalHeight + overflowInfo.requiredHeight + mobilePadding)
      );
      
      setModalHeight(`${requiredHeight}px`);
      setIsOverflowing(true);
    } else {
      setModalHeight('auto');
      setIsOverflowing(false);
    }
  };

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (isOverflowing) {
        // Recalculate height on resize
        const viewportHeight = window.innerHeight;
        const maxModalHeight = viewportHeight * 0.9;
        const currentHeight = parseInt(modalHeight) || 0;
        
        if (currentHeight > maxModalHeight) {
          setModalHeight(`${maxModalHeight}px`);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOverflowing, modalHeight]);


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please assign subjects';
    }
    if (formData.sections.length === 0) {
      newErrors.sections = 'Please assign sections';
    }
    if (!formData.status) {
      newErrors.status = 'Please choose course status';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Transform form data to match the expected course structure
    const courseData = {
      ...course,
      class: formData.name, // Map name to class field
      sectionName: formData.sections.join(', '), // Convert sections array to comma-separated string
      subjectName: formData.subjects, // Keep subjects as array
      feeCost: 'Course fee not assigned', // Default fee cost
      status: formData.status // Add status field
    };

    onSave(courseData);
    onClose();
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
      <div className={`flex min-h-full items-center justify-center p-2 sm:p-4 transition-all duration-300 ${
        isOverflowing ? 'items-start pt-4 sm:pt-8' : ''
      }`}>
        <div 
          ref={modalRef}
          className={`relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ${
            isOverflowing ? 'mt-4 sm:mt-8 modal-scroll' : ''
          }`}
          style={{
            height: modalHeight,
            maxHeight: '95vh',
            overflowY: isOverflowing ? 'auto' : 'visible'
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl ${
            mode === 'create' 
              ? 'border-green-200 dark:border-green-700' 
              : 'border-blue-200 dark:border-blue-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
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
                {mode === 'edit' ? 'Update Course' : 'Add New Course'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Name */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name of the course"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

             {/* Assign Subjects */}
             <SearchableDropdown
               label="Assign Subjects"
               placeholder="Nothing selected"
               options={allSubjects}
               value={formData.subjects}
               onChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
               onOverflowChange={handleDropdownOverflow}
               error={errors.subjects}
               required={true}
               multiple={true}
               searchable={true}
               showSelectedCount={false}
               searchPlaceholder="Search subjects..."
               headerText="Choose Subjects"
               theme={mode === 'create' ? 'green' : 'blue'}
             />

            {/* Assign Sections */}
            <SearchableDropdown
              label="Assign Sections"
              placeholder="Nothing selected"
              options={allSections}
              value={formData.sections}
              onChange={(sections) => setFormData(prev => ({ ...prev, sections }))}
              onOverflowChange={handleDropdownOverflow}
              error={errors.sections}
              required={true}
              multiple={true}
              searchable={true}
              showSelectedCount={false}
              searchPlaceholder="Search sections..."
              headerText="Choose Sections"
              theme={mode === 'create' ? 'green' : 'blue'}
            />

            {/* Status */}
            <SearchableDropdown
              label="Status"
              placeholder="Change section status"
              options={statusOptions}
              value={formData.status}
              onChange={(status) => setFormData(prev => ({ ...prev, status }))}
              onOverflowChange={handleDropdownOverflow}
              error={errors.status}
              required={true}
              multiple={false}
              searchable={false}
              theme={mode === 'create' ? 'green' : 'blue'}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                  mode === 'create'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              >
                {mode === 'create' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {mode === 'edit' ? 'Update' : 'Add'}
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
  );
};

export default CourseModal;
