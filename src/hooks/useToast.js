import { useState, useCallback } from 'react';

/**
 * useToast - Custom hook for toast notifications
 * @param {Object} options - Toast options
 * @returns {Object} Toast state and handlers
 */
export const useToast = (options = {}) => {
  const {
    defaultDuration = 3000,
    defaultType = 'success'
  } = options;

  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: defaultType
  });

  const showToast = useCallback((message, type = defaultType, duration = defaultDuration) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration
    });
  }, [defaultType, defaultDuration]);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;
