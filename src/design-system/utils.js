/**
 * Design System Utilities
 * 
 * Helper functions for working with design tokens and components
 */

/**
 * Merge class names, filtering out falsy values
 * @param {...string} classes - Class names to merge
 * @returns {string} Merged class string
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get color value from token path
 * @param {string} path - Dot-separated path (e.g., 'primary.500')
 * @param {object} tokens - Design tokens object
 * @returns {string} Color value
 */
export const getColor = (path, tokens) => {
  const keys = path.split('.');
  let value = tokens.colors;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return null;
  }
  return value;
};

/**
 * Generate responsive class names
 * @param {object} breakpoints - Object with breakpoint:className pairs
 * @returns {string} Responsive class string
 */
export const responsive = (breakpoints) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'base') return className;
      return `${breakpoint}:${className}`;
    })
    .join(' ');
};

/**
 * Get CSS variable string from token
 * @param {string} tokenPath - Path to token
 * @param {string} prefix - CSS variable prefix (default: 'ds')
 * @returns {string} CSS variable string
 */
export const cssVar = (tokenPath, prefix = 'ds') => {
  return `var(--${prefix}-${tokenPath.replace(/\./g, '-')})`;
};

/**
 * Apply design system styles to element
 * @param {object} styles - Style object with design token paths
 * @param {object} tokens - Design tokens
 * @returns {object} CSS-in-JS style object
 */
export const applyStyles = (styles, tokens) => {
  const result = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'string' && value.includes('.')) {
      // Assume it's a token path
      const tokenValue = getColor(value, tokens);
      if (tokenValue) {
        result[key] = tokenValue;
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Create variant function for component props
 * @param {object} variants - Variant configuration object
 * @param {string} defaultVariant - Default variant key
 * @returns {Function} Variant function
 */
export const createVariants = (variants, defaultVariant = 'default') => {
  return (variant = defaultVariant) => {
    return variants[variant] || variants[defaultVariant] || '';
  };
};

export default {
  cn,
  getColor,
  responsive,
  cssVar,
  applyStyles,
  createVariants,
};

