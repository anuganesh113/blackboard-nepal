import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const SubjectModal = ({ isOpen, onClose, subject, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    icon: '',
    status: true,
    isOptional: false,
    creditHours: '',
    isAdditional: false,
  });

  const [errors, setErrors] = useState({});

  // Icon options for the dropdown
  const iconOptions = [
    { value: '✏️', label: '✏️ Pencil' },
    { value: 'अ', label: 'अ Nepali' },
    { value: '🔬', label: '🔬 Science' },
    { value: '🔢', label: '🔢 Math' },
    { value: '🔤', label: '🔤 English' },
    { value: '📚', label: '📚 Books' },
    { value: '📖', label: '📖 Book' },
    { value: '👑', label: '👑 Crown' },
    { value: '🎨', label: '🎨 Art' },
    { value: '⚽', label: '⚽ Sports' },
    { value: '🎵', label: '🎵 Music' },
    { value: '💻', label: '💻 Computer' },
    { value: '🌍', label: '🌍 Geography' },
    { value: '⏰', label: '⏰ History' },
  ];

  useEffect(() => {
    if (subject && mode === 'edit') {
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        icon: subject.icon || '',
        status: subject.status ?? true,
        isOptional: subject.isOptional ?? false,
        creditHours: subject.creditHours?.toString() || '',
        isAdditional: subject.isAdditional ?? false,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        code: '',
        icon: '',
        status: true,
        isOptional: false,
        creditHours: '',
        isAdditional: false,
      });
    }
    setErrors({});
  }, [subject, mode, isOpen]);

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
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    // Convert string 'true'/'false' to boolean for select dropdowns
    if (type === 'select-one' && (value === 'true' || value === 'false')) {
      processedValue = value === 'true';
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }
    
    if (!formData.icon) {
      newErrors.icon = 'Subject icon is required';
    }
    
    if (!formData.creditHours || formData.creditHours <= 0) {
      newErrors.creditHours = 'Credit hours must be greater than 0';
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

    // Convert creditHours back to number
    const dataToSave = {
      ...subject,
      ...formData,
      creditHours: parseInt(formData.creditHours, 10)
    };

    onSave(dataToSave);
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
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl transform transition-all">
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
                {mode === 'edit' ? 'Update Subject' : 'Add New Subject'}
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Subject Name */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter subject name"
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

            {/* Subject Icon */}
            <div>
              <label 
                htmlFor="icon" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Subject Icon <span className="text-red-500">*</span>
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.icon 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              >
                <option value="">Select</option>
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.icon && (
                <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
              )}
            </div>

            {/* Subject Code */}
            <div>
              <label 
                htmlFor="code" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Subject code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Please Enter Subject code"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Status */}
            <div>
              <label 
                htmlFor="status" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status.toString()}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Is Optional Subject */}
            <div>
              <label 
                htmlFor="isOptional" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Is Optional Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="isOptional"
                name="isOptional"
                value={formData.isOptional.toString()}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {/* Credit Hours */}
            <div>
              <label 
                htmlFor="creditHours" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Credit Hours
              </label>
              <input
                type="number"
                id="creditHours"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleChange}
                placeholder="Please Enter Subject credit hours"
                min="0"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.creditHours 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {errors.creditHours && (
                <p className="mt-1 text-sm text-red-500">{errors.creditHours}</p>
              )}
            </div>

            {/* Is Additional Subject */}
            <div>
              <label 
                htmlFor="isAdditional" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Is Additional Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="isAdditional"
                name="isAdditional"
                value={formData.isAdditional.toString()}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

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

export default SubjectModal;

