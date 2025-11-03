/**
 * Date utility functions for batch management
 */

/**
 * Format date string from YYYY-MM-DD to DD-MM-YYYY
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string in DD-MM-YYYY format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Format date string from DD-MM-YYYY to YYYY-MM-DD
 * @param {string} dateString - Date string in DD-MM-YYYY format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Check if start date is before end date
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {boolean} True if start date is before end date
 */
export const isStartDateBeforeEndDate = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) < new Date(endDate);
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get date N days from today
 * @param {number} days - Number of days to add/subtract
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getDateFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
