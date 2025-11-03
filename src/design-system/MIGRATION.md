# Migration Guide

## Overview

This guide helps you migrate existing components to use the new Design System while maintaining 100% backward compatibility.

## Migration Strategy

### Phase 1: Setup (No Breaking Changes)

1. Install the design system (already done)
2. Import components alongside existing code
3. Test that everything still works

### Phase 2: Gradual Migration

1. Start with new components - use design system from the start
2. Migrate high-traffic pages one at a time
3. Update shared components (buttons, cards)
4. Finally, migrate remaining pages

### Phase 3: Cleanup

1. Remove old styling patterns
2. Consolidate duplicate styles
3. Update documentation

## Step-by-Step Migration

### Step 1: Button Migration

#### Example: Add Classroom Button

**Before (Classroom.jsx):**
```jsx
<button
  onClick={handleAddClassroom}
  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <Plus className="w-5 h-5 relative z-10" />
  <span className="relative z-10">Add Classroom</span>
</button>
```

**After:**
```jsx
import { Button } from '@/design-system';
import { Plus } from 'lucide-react';

<Button 
  variant="success" 
  icon={<Plus />}
  onClick={handleAddClassroom}
>
  Add Classroom
</Button>
```

**Benefits:**
- Reduced from ~15 lines to 6 lines
- Consistent styling automatically
- No manual hover effects needed

### Step 2: Card Migration

#### Example: DataTable Container

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

### Step 3: Using Design Tokens

**Before:**
```jsx
const customStyle = {
  backgroundColor: '#22c55e',
  padding: '1.5rem',
};
```

**After:**
```jsx
import { colors, spacing } from '@/design-system';

const customStyle = {
  backgroundColor: colors.success[500],
  padding: spacing[6],
};
```

## Common Patterns

### Pattern 1: Action Buttons

**Pattern:** Primary actions use `variant="success"`, secondary actions use `variant="secondary"`

```jsx
// Primary action
<Button variant="success" icon={<Plus />}>
  Add Item
</Button>

// Secondary action
<Button variant="secondary">
  Cancel
</Button>
```

### Pattern 2: Icon-Only Buttons

**Pattern:** Use ghost variant with icon

```jsx
<Button variant="ghost" icon={<Eye />} />
```

### Pattern 3: Loading States

```jsx
<Button variant="primary" loading={isSubmitting}>
  Submit
</Button>
```

## Migration Checklist

For each page/component:

- [ ] Identify all custom-styled buttons
- [ ] Replace with `<Button>` component
- [ ] Identify all custom-styled cards/containers
- [ ] Replace with `<Card>` component
- [ ] Check for hardcoded colors
- [ ] Replace with design tokens
- [ ] Test visual appearance
- [ ] Test functionality
- [ ] Update component documentation

## Backward Compatibility Notes

1. **Old buttons still work** - No immediate migration required
2. **Design system is additive** - Use alongside existing code
3. **Gradual adoption** - Migrate at your own pace
4. **No breaking changes** - Existing functionality preserved

## Troubleshooting

### Issue: Button looks different

**Solution:** Check variant matches the original intent. Adjust size prop if needed.

### Issue: Card spacing wrong

**Solution:** Adjust padding prop (sm, md, lg) or use className for custom spacing.

### Issue: Need custom styling

**Solution:** Use className prop for minor adjustments, or extend the component.

## Examples by Page

### Classroom.jsx
- ✅ "Add Classroom" button → `Button variant="success"`
- ✅ DataTable container → `Card variant="elevated"`

### Teachers.jsx
- ✅ "Download Teacher Cards" → `Button variant="info"`
- ✅ "Add Teacher" → `Button variant="success"`

### Subjects.jsx
- ✅ "Add Subject" → `Button variant="success"`

## Next Steps

1. Review this guide
2. Start with one page (recommend: Classroom.jsx)
3. Test thoroughly
4. Migrate remaining pages incrementally
5. Remove old styling patterns once migration complete

