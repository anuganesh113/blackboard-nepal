# Design System Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the design system across your application.

## Architecture

```
src/design-system/
├── tokens.js              # All design tokens (colors, spacing, etc.)
├── components/            # Reusable design system components
│   ├── Button.jsx         # Enhanced button with variants
│   ├── Card.jsx           # Card component
│   ├── Input.jsx          # Input component
│   ├── Badge.jsx          # Badge component
│   └── index.js           # Component exports
├── hooks/                 # Design system hooks
│   ├── useDesignTokens.js # Hook to access tokens
│   └── index.js
├── utils.js               # Utility functions
├── types.d.ts             # TypeScript definitions
├── examples/              # Example implementations
│   ├── ButtonExamples.jsx
│   ├── CardExamples.jsx
│   └── MigrationExample.jsx
├── __tests__/             # Unit tests
│   └── Button.test.js
├── index.js               # Main export
├── README.md              # Full documentation
├── MIGRATION.md           # Migration guide
├── QUICK_REFERENCE.md      # Quick reference
└── IMPLEMENTATION_GUIDE.md # This file
```

## Step 1: Installation

The design system is already set up in your project. To use it:

```javascript
import { Button, Card } from '@/design-system';
```

Or using relative paths:

```javascript
import { Button, Card } from '../design-system';
```

## Step 2: Understanding Variants

### Button Variants

Each variant has a semantic meaning:

- **primary** - Main actions (blue)
- **success** - Add/create actions (green)
- **danger** - Delete/destructive actions (red)
- **warning** - Warning actions (yellow)
- **purple** - Export/download actions (purple)
- **secondary** - Cancel/secondary actions (gray)
- **ghost** - Subtle actions (transparent)

### Card Variants

- **default** - Standard card (white/dark background)
- **elevated** - Glass morphism effect
- **outlined** - Border only, transparent background

## Step 3: Migration Process

### Phase 1: Identify Patterns

Look for these patterns in your code:

1. **Buttons with gradient classes:**
   ```jsx
   className="bg-gradient-to-r from-green-500 to-green-600..."
   ```

2. **Cards with backdrop blur:**
   ```jsx
   className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl..."
   ```

3. **Hardcoded colors:**
   ```jsx
   backgroundColor: '#22c55e'
   ```

### Phase 2: Replace Components

#### Replace Buttons

**Before:**
```jsx
<button
  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
  onClick={handleClick}
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <Plus className="w-5 h-5 relative z-10" />
  <span className="relative z-10">Add Item</span>
</button>
```

**After:**
```jsx
import { Button } from '@/design-system';
import { Plus } from 'lucide-react';

<Button variant="success" icon={<Plus />} onClick={handleClick}>
  Add Item
</Button>
```

#### Replace Cards

**Before:**
```jsx
<div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
  <DataTable ... />
</div>
```

**After:**
```jsx
import { Card } from '@/design-system';

<Card variant="elevated">
  <DataTable ... />
</Card>
```

### Phase 3: Update Styling

Replace hardcoded values with tokens:

```javascript
// Before
const style = {
  backgroundColor: '#22c55e',
  padding: '1.5rem',
};

// After
import { colors, spacing } from '@/design-system';

const style = {
  backgroundColor: colors.success[500],
  padding: spacing[6],
};
```

## Step 4: Testing

After migration:

1. **Visual Testing:** Compare before/after screenshots
2. **Functional Testing:** Ensure all interactions work
3. **Responsive Testing:** Check on different screen sizes
4. **Accessibility Testing:** Verify keyboard navigation and screen readers

## Step 5: Documentation

Update component documentation to reference design system:

```jsx
/**
 * AddClassroomButton
 * 
 * Uses design system Button component with success variant.
 * @see Button component documentation
 */
```

## Common Issues & Solutions

### Issue: Button looks different after migration

**Solution:** Verify variant matches original intent. Use `className` prop for minor adjustments.

### Issue: Card spacing is wrong

**Solution:** Adjust `padding` prop or use custom className.

### Issue: Need custom variant

**Solution:** Extend tokens.js and add new variant, or use className for one-off styling.

## Best Practices

1. **Use semantic variants** - Use `success` instead of `green`
2. **Be consistent** - Use same variant for same action type
3. **Don't override** - Trust the design system, use className sparingly
4. **Document exceptions** - If you need custom styling, document why
5. **Update tokens** - If you need to change styles globally, update tokens.js

## Performance Considerations

- Design system uses CSS classes, not inline styles
- No runtime style calculations
- All classes are static and optimized by Tailwind
- Minimal bundle size impact

## Next Steps

1. Review examples in `src/design-system/examples/`
2. Start with one page (recommend: Classroom.jsx)
3. Test thoroughly
4. Gradually migrate remaining pages
5. Remove old styling patterns once complete

## Support

For questions or issues:
1. Check README.md for full documentation
2. Check QUICK_REFERENCE.md for common patterns
3. Review examples in examples/ directory
4. Check MIGRATION.md for migration specifics

