/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'This field is required';
  }
  return null;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {string|null} Error message or null
 */
export const validateMinLength = (value, minLength) => {
  if (value && value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  return null;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {string|null} Error message or null
 */
export const validateMaxLength = (value, maxLength) => {
  if (value && value.length > maxLength) {
    return `Must be no more than ${maxLength} characters long`;
  }
  return null;
};

/**
 * Validate email field
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
  if (!email) return null;
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate phone field
 * @param {string} phone - Phone to validate
 * @returns {string|null} Error message or null
 */
export const validatePhone = (phone) => {
  if (!phone) return null;
  if (!isValidPhone(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

/**
 * Validate date field
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateDate = (date, options = {}) => {
  if (!date) return null;
  
  const { minDate, maxDate, required = false } = options;
  
  if (required && !date) {
    return 'Date is required';
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (minDate && dateObj < new Date(minDate)) {
    return `Date must be after ${new Date(minDate).toLocaleDateString()}`;
  }
  
  if (maxDate && dateObj > new Date(maxDate)) {
    return `Date must be before ${new Date(maxDate).toLocaleDateString()}`;
  }
  
  return null;
};

/**
 * Validate number field
 * @param {number|string} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateNumber = (value, options = {}) => {
  if (!value && value !== 0) return null;
  
  const { min, max, integer = false, positive = false } = options;
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  
  if (integer && !Number.isInteger(num)) {
    return 'Please enter a whole number';
  }
  
  if (positive && num <= 0) {
    return 'Please enter a positive number';
  }
  
  if (min !== undefined && num < min) {
    return `Must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `Must be no more than ${max}`;
  }
  
  return null;
};

/**
 * Validate URL field
 * @param {string} url - URL to validate
 * @returns {string|null} Error message or null
 */
export const validateURL = (url) => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validatePassword = (password, options = {}) => {
  if (!password) return null;
  
  const { 
    minLength = 8, 
    requireUppercase = true, 
    requireLowercase = true, 
    requireNumbers = true, 
    requireSpecialChars = true 
  } = options;
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return null;
};

/**
 * Create validation schema for forms
 * @param {Object} schema - Validation schema object
 * @returns {Function} Validation function
 */
export const createValidationSchema = (schema) => {
  return (values) => {
    const errors = {};
    
    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = values[field];
      
      // Required validation
      if (rules.required) {
        const requiredError = validateRequired(value);
        if (requiredError) {
          errors[field] = requiredError;
          return;
        }
      }
      
      // Skip other validations if field is empty and not required
      if (!value && !rules.required) return;
      
      // Email validation
      if (rules.email) {
        const emailError = validateEmail(value);
        if (emailError) {
          errors[field] = emailError;
          return;
        }
      }
      
      // Phone validation
      if (rules.phone) {
        const phoneError = validatePhone(value);
        if (phoneError) {
          errors[field] = phoneError;
          return;
        }
      }
      
      // Date validation
      if (rules.date) {
        const dateError = validateDate(value, rules.date);
        if (dateError) {
          errors[field] = dateError;
          return;
        }
      }
      
      // Number validation
      if (rules.number) {
        const numberError = validateNumber(value, rules.number);
        if (numberError) {
          errors[field] = numberError;
          return;
        }
      }
      
      // URL validation
      if (rules.url) {
        const urlError = validateURL(value);
        if (urlError) {
          errors[field] = urlError;
          return;
        }
      }
      
      // Password validation
      if (rules.password) {
        const passwordError = validatePassword(value, rules.password);
        if (passwordError) {
          errors[field] = passwordError;
          return;
        }
      }
      
      // Min length validation
      if (rules.minLength) {
        const minLengthError = validateMinLength(value, rules.minLength);
        if (minLengthError) {
          errors[field] = minLengthError;
          return;
        }
      }
      
      // Max length validation
      if (rules.maxLength) {
        const maxLengthError = validateMaxLength(value, rules.maxLength);
        if (maxLengthError) {
          errors[field] = maxLengthError;
          return;
        }
      }
      
      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value, values);
        if (customError) {
          errors[field] = customError;
          return;
        }
      }
    });
    
    return errors;
  };
};
