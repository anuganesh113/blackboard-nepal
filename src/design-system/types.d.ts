/**
 * TypeScript Type Definitions for Design System
 * 
 * These types provide IntelliSense and type checking for design system components.
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'purple'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export type PaddingSize = 'sm' | 'md' | 'lg' | 'none';

export type InputVariant = 'default' | 'outlined' | 'filled';

export type BadgeVariant = 
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'gray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant - determines color scheme and styling
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * Whether button is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether button is in loading state
   */
  loading?: boolean;
  
  /**
   * Icon component to display
   */
  icon?: ReactNode;
  
  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Whether button should take full width
   */
  fullWidth?: boolean;
  
  /**
   * @deprecated This prop is ignored. Sparkles icons have been removed from the design system.
   */
  withSparkles?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Button content
   */
  children?: ReactNode;
}

export interface CardProps {
  /**
   * Card variant - determines background and border styling
   */
  variant?: CardVariant;
  
  /**
   * Card padding size
   */
  padding?: PaddingSize;
  
  /**
   * Whether card has hover effect
   */
  hover?: boolean;
  
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Custom header content
   */
  header?: ReactNode;
  
  /**
   * Custom footer content
   */
  footer?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Card content
   */
  children?: ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input variant
   */
  variant?: InputVariant;
  
  /**
   * Input size
   */
  size?: ButtonSize;
  
  /**
   * Whether input has error state
   */
  error?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface BadgeProps {
  /**
   * Badge variant
   */
  variant?: BadgeVariant;
  
  /**
   * Badge size
   */
  size?: ButtonSize;
  
  /**
   * Whether badge is outlined
   */
  outlined?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Badge content
   */
  children?: ReactNode;
}

export interface DesignTokens {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    danger: Record<string, string>;
    info: Record<string, string>;
    purple: Record<string, string>;
    gray: Record<string, string>;
    dark: {
      bg: Record<string, string>;
      text: Record<string, string>;
    };
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string[]>;
    fontSize: Record<string, [string, { lineHeight: string }]>;
    fontWeight: Record<string, number>;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  transitions: {
    duration: Record<string, string>;
    timing: Record<string, string>;
  };
  zIndex: Record<string, number>;
  buttonVariants: Record<ButtonVariant, {
    bg: string;
    hover: string;
    text: string;
    shadow: string;
    border?: string;
  }>;
  buttonSizes: Record<ButtonSize, {
    padding: string;
    text: string;
    icon: string;
  }>;
  cardVariants: Record<CardVariant, {
    bg: string;
    border: string;
    shadow: string;
  }>;
}

