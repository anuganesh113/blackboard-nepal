import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function generateColorPalette(primaryColor: string) {
  // Generate complementary colors based on primary
  const colors = {
    primary: primaryColor,
    secondary: adjustColor(primaryColor, 120),  // Complementary
    accent: adjustColor(primaryColor, 60),      // Analogous
    neutral: '#64748b',
    background: '#ffffff',
    text: '#0f172a'
  }
  return colors
}

export function adjustColor(color: string, degree: number) {
  // Simple color adjustment for demo
  // In production, use a proper color library
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Simple hue rotation (simplified for demo)
  const adjusted = {
    r: Math.min(255, Math.max(0, r + degree)),
    g: Math.min(255, Math.max(0, g + degree/2)),
    b: Math.min(255, Math.max(0, b - degree/2))
  }
  
  return `#${adjusted.r.toString(16).padStart(2, '0')}${adjusted.g.toString(16).padStart(2, '0')}${adjusted.b.toString(16).padStart(2, '0')}`
}