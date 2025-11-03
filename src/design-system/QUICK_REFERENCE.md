# Design System Quick Reference

## Import Paths

```javascript
// Import from main entry point
import { Button, Card, colors, spacing } from '@/design-system';

// Or import from specific paths
import { Button } from '@/design-system/components';
import tokens from '@/design-system/tokens';
```

## Button Component

```jsx
<Button variant="success" size="md" icon={<Plus />} onClick={handleClick}>
  Add Item
</Button>
```

**Variants:** `primary`, `secondary`, `success`, `danger`, `warning`, `purple`, `ghost`  
**Sizes:** `sm`, `md`, `lg`  
**Common Props:** `icon`, `iconPosition`, `loading`, `disabled`, `fullWidth`

## Card Component

```jsx
<Card variant="elevated" padding="md" hover>
  <DataTable ... />
</Card>
```

**Variants:** `default`, `elevated`, `outlined`  
**Padding:** `sm`, `md`, `lg`, `none`  
**Common Props:** `title`, `header`, `footer`, `hover`

## Design Tokens

```javascript
import { colors, spacing, typography } from '@/design-system';

// Colors
colors.primary[500]    // Main primary color
colors.success[500]    // Success green
colors.danger[500]     // Error red

// Spacing
spacing[4]            // 1rem (16px)
spacing[6]            // 1.5rem (24px)

// Typography
typography.fontSize.base     // 16px
typography.fontWeight.bold   // 700
```

## Common Patterns

### Add/Submit Actions
```jsx
<Button variant="success" icon={<Plus />}>Add</Button>
```

### Delete Actions
```jsx
<Button variant="danger" icon={<Trash2 />}>Delete</Button>
```

### Export/Download Actions
```jsx
<Button variant="purple" icon={<Download />}>Export</Button>
```

### Cancel/Secondary Actions
```jsx
<Button variant="secondary">Cancel</Button>
```

### View/Info Actions
```jsx
<Button variant="ghost" icon={<Eye />}>View</Button>
```

## Migration Checklist

1. Replace manual button styles → `<Button variant="...">`
2. Replace manual card containers → `<Card variant="...">`
3. Replace hardcoded colors → `colors.primary[500]`
4. Replace hardcoded spacing → `spacing[6]`
5. Test visual appearance
6. Test functionality

