import { useMemo } from 'react';
import tokens from '../tokens';

/**
 * Hook to access design tokens
 * 
 * @param {string} tokenPath - Optional path to specific token (e.g., 'colors.primary.500')
 * @returns {object} Design tokens or specific token value
 * 
 * @example
 * const tokens = useDesignTokens();
 * const primaryColor = useDesignTokens('colors.primary.500');
 */
export const useDesignTokens = (tokenPath = null) => {
  return useMemo(() => {
    if (!tokenPath) {
      return tokens;
    }

    const keys = tokenPath.split('.');
    let value = tokens;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        console.warn(`Design token path "${tokenPath}" not found`);
        return null;
      }
    }

    return value;
  }, [tokenPath]);
};

export default useDesignTokens;

