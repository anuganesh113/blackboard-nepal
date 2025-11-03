import { useState, useCallback } from 'react';

/**
 * useForm - Custom hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationSchema - Validation function
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Handle special cases
    if (name === 'isActive' || name === 'status') {
      if (typeof value === 'string') {
        newValue = value === 'true';
      }
    }
    
    setValue(name, newValue);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setFieldTouched(name);
  }, [setFieldTouched]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const newErrors = validationSchema(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const validateField = useCallback((name) => {
    if (!validationSchema) return true;
    
    const fieldErrors = validationSchema({ [name]: values[name] });
    const fieldError = fieldErrors[name];
    
    if (fieldError) {
      setFieldError(name, fieldError);
      return false;
    } else {
      setFieldError(name, '');
      return true;
    }
  }, [values, validationSchema, setFieldError]);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFormData = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    const isValid = validate();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    validate,
    validateField,
    reset,
    setFormData,
    handleSubmit
  };
};

export default useForm;
