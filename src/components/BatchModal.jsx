import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const BatchModal = ({ isOpen, onClose, batch, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (batch && mode === 'edit') {
      setFormData({
        name: batch.name || '',
        startDate: batch.startDate || '',
        endDate: batch.endDate || '',
        isActive: batch.isActive ?? true,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [batch, mode, isOpen]);

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
    let newValue = type === 'checkbox' ? checked : value;
    
    // Convert string 'true'/'false' to boolean for isActive
    if (name === 'isActive') {
      newValue = value === 'true';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Batch name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
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
    onSave({ ...batch, ...formData });
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
                {mode === 'edit' ? 'Update Batch' : 'Add New Batch'}
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
            {/* Batch Name */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Batch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter batch name"
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

            {/* Start Date */}
            <div>
              <label 
                htmlFor="startDate" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.startDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label 
                htmlFor="endDate" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.endDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>

            {/* Is Active */}
            <div>
              <label 
                htmlFor="isActive" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Active Status <span className="text-red-500">*</span>
              </label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive.toString()}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
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

export default BatchModal;

