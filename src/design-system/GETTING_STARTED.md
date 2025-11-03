# Getting Started with the Design System

## Quick Start (5 minutes)

### Step 1: Import Components

```javascript
import { Button, Card } from '@/design-system';
```

Or using relative paths:

```javascript
import { Button, Card } from '../design-system';
```

### Step 2: Use in Your Component

```jsx
import React from 'react';
import { Button } from '@/design-system';
import { Plus } from 'lucide-react';

function MyComponent() {
  return (
    <Button variant="success" icon={<Plus />} onClick={handleClick}>
      Add Item
    </Button>
  );
}
```

### Step 3: Replace Existing Buttons

Find buttons with manual styling like this:

```jsx
<button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500...">
  Add Item
</button>
```

Replace with:

```jsx
<Button variant="success" icon={<Plus />}>
  Add Item
</Button>
```

**That's it!** You're now using the design system.

## Common Use Cases

### Add/Create Button
```jsx
<Button variant="success" icon={<Plus />}>Add</Button>
```

### Delete Button
```jsx
<Button variant="danger" icon={<Trash2 />}>Delete</Button>
```

### Export Button
```jsx
<Button variant="purple" icon={<Download />}>Export</Button>
```

### Cancel Button
```jsx
<Button variant="secondary">Cancel</Button>
```

### View Button
```jsx
<Button variant="ghost" icon={<Eye />}>View</Button>
```

### Card Container
```jsx
<Card variant="elevated">
  <YourContent />
</Card>
```

## Next Steps

1. **Read the Quick Reference:** `QUICK_REFERENCE.md`
2. **See Examples:** Check `examples/` directory
3. **Read Full Docs:** `README.md`
4. **Migration Guide:** `MIGRATION.md` (when ready to migrate)

## Need Help?

- Check `README.md` for full documentation
- See `USAGE_EXAMPLES.md` for real-world examples
- Review `examples/` directory for component demos

## Path Alias Configuration

The design system is configured to work with the `@/design-system` alias. This has been set up in `vite.config.js`.

If you need to use relative paths instead:

```javascript
import { Button } from '../design-system';
```

Both approaches work!

