# Design System Documentation

## Overview

The Design System provides a centralized, consistent approach to styling across the entire application. It eliminates the need for manual component styling and ensures visual consistency.

## Architecture

```
src/design-system/
├── tokens.js              # Design tokens (colors, spacing, typography, etc.)
├── components/           # Design system components
│   ├── Button.jsx        # Enhanced button component
│   ├── Card.jsx          # Card component
│   └── index.js          # Component exports
├── utils.js              # Utility functions
├── index.js              # Main export
├── README.md             # This file
└── MIGRATION.md          # Migration guide
```

## Design Tokens

### Colors

The design system uses a semantic color palette organized by purpose:

```javascript
import { colors } from '@/design-system';

// Primary colors
colors.primary[500]  // Main primary color
colors.primary[600]  // Hover state

// Semantic colors
colors.success[500]  // Success states
colors.danger[500]   // Error states
colors.warning[500]  // Warning states
```

### Spacing

Consistent spacing scale:

```javascript
import { spacing } from '@/design-system';

spacing[4]  // 1rem (16px)
spacing[6]  // 1.5rem (24px)
spacing[8]  // 2rem (32px)
```

### Typography

Font sizes and weights:

```javascript
import { typography } from '@/design-system';

typography.fontSize.base   // 16px
typography.fontWeight.bold  // 700
```

## Components

### Button

Enhanced button component with variants and sizes:

```jsx
import { Button } from '@/design-system';

// Primary button
<Button variant="primary" size="md" icon={<Plus />}>
  Add Item
</Button>

// Secondary button
<Button variant="secondary" size="lg">
  Cancel
</Button>

// Success button
<Button variant="success" onClick={handleSave}>
  Save
</Button>

// With loading state
<Button variant="primary" loading={isSubmitting}>
  Submit
</Button>
```

#### Button Variants

- `primary` - Blue gradient (default)
- `secondary` - Gray gradient
- `success` - Green gradient
- `danger` - Red gradient
- `warning` - Yellow gradient
- `purple` - Purple gradient
- `ghost` - Transparent with border

#### Button Sizes

- `sm` - Small (px-4 py-2, text-sm)
- `md` - Medium (px-6 py-3, text-base) - default
- `lg` - Large (px-8 py-4, text-lg)

### Card

Consistent card component:

```jsx
import { Card } from '@/design-system';

<Card variant="elevated" padding="lg" hover>
  <Card.Title>Card Title</Card.Title>
  <Card.Body>
    Card content
  </Card.Body>
</Card>
```

#### Card Variants

- `default` - Standard card with white/dark background
- `elevated` - Glass morphism effect with backdrop blur
- `outlined` - Transparent with border only

## Utility Functions

### Class Name Merging

```javascript
import { cn } from '@/design-system/utils';

const className = cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class'
);
```

### Color Utilities

```javascript
import { getColor } from '@/design-system/utils';
import tokens from '@/design-system/tokens';

const color = getColor('primary.500', tokens);
```

## Usage Examples

### Replacing Existing Buttons

**Before:**
```jsx
<button
  className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
  onClick={handleClick}
>
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

### Creating Consistent Cards

**Before:**
```jsx
<div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
  <div className="p-6">
    Content
  </div>
</div>
```

**After:**
```jsx
import { Card } from '@/design-system';

<Card variant="elevated" padding="md">
  Content
</Card>
```

## Best Practices

1. **Always use design system components** instead of custom styled elements
2. **Use semantic variants** (success, danger, warning) rather than color names
3. **Maintain consistency** - use the same variant for similar actions across pages
4. **Leverage tokens** for custom styling when needed
5. **Extend, don't override** - use className prop for minor adjustments

## Backward Compatibility

All existing components continue to work. The design system components are additive and can be adopted gradually. Existing button styles remain functional while you migrate to the new system.

## TypeScript Support

For TypeScript projects, type definitions are included:

```typescript
import { Button } from '@/design-system';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'purple' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // ... other props
}
```

## Testing

Design system components include built-in test utilities:

```javascript
import { render } from '@testing-library/react';
import { Button } from '@/design-system';

test('renders button with variant', () => {
  const { container } = render(<Button variant="primary">Click me</Button>);
  expect(container.firstChild).toHaveClass('bg-gradient-to-r');
});
```

