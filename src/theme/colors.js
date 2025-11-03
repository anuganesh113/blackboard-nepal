// Theme color tokens for consistency across the application
// Dark mode text colors selected for WCAG AA contrast on dark backgrounds
// Primary text: high-emphasis content
// Secondary text: medium emphasis
// Muted text: low emphasis/captions
// Accent colors: brand-tinted variants safe for dark surfaces

export const DARK_MODE_TEXT = {
  PRIMARY: '#FFFFFF',       // white
  SECONDARY: '#E0E0E0',     // gray-300-ish
  MUTED: '#BDBDBD',         // gray-400-ish
};

export const DARK_MODE_ACCENT = {
  BLUE: '#BFDBFE',          // tailwind blue-200
  GREEN: '#BBF7D0',         // tailwind green-200
  PURPLE: '#DDD6FE',        // tailwind purple-200
  RED: '#FCA5A5',           // tailwind red-300 for readability
};

// Usage guidelines:
// - Prefer PRIMARY for most body text on dark surfaces.
// - Use SECONDARY for labels and helper text.
// - Use MUTED sparingly for captions/less important metadata.
// - Use ACCENT colors for emphasis links/values, verifying contrast against bg (#111827-#1F2937).
