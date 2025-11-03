# Design System Usage Examples

## Real-World Examples

### Example 1: Classroom Page

#### Original Implementation
```jsx
// 15+ lines of manual styling
<button
  onClick={handleAddClassroom}
  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <Plus className="w-5 h-5 relative z-10" />
  <span className="relative z-10">Add Classroom</span>
</button>
```

#### Design System Implementation
```jsx
import { Button } from '@/design-system';
import { Plus } from 'lucide-react';

<Button variant="success" icon={<Plus />} onClick={handleAddClassroom}>
  Add Classroom
</Button>
```

**Benefits:**
- 60% code reduction
- Automatic consistency
- Easier maintenance

### Example 2: DataTable Container

#### Original Implementation
```jsx
<div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
  <DataTable ... />
</div>
```

#### Design System Implementation
```jsx
import { Card } from '@/design-system';

<Card variant="elevated">
  <DataTable ... />
</Card>
```

### Example 3: Export Button

#### Original Implementation
```jsx
<button className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
  <Download className="w-5 h-5 relative z-10" />
  <span className="relative z-10">Export</span>
</button>
```

#### Design System Implementation
```jsx
import { Button } from '@/design-system';
import { Download } from 'lucide-react';

<Button variant="purple" icon={<Download />}>
  Export
</Button>
```

### Example 4: Loading State

```jsx
import { Button } from '@/design-system';

<Button variant="primary" loading={isSubmitting}>
  Submit
</Button>
```

### Example 5: Disabled State

```jsx
import { Button } from '@/design-system';

<Button variant="danger" disabled={!canDelete} icon={<Trash2 />}>
  Delete
</Button>
```

### Example 6: Icon-Only Button

```jsx
import { Button } from '@/design-system';

<Tooltip content="View Details">
  <Button variant="ghost" icon={<Eye />} />
</Tooltip>
```

### Example 7: Full Width Button

```jsx
import { Button } from '@/design-system';

<Button variant="primary" fullWidth onClick={handleSubmit}>
  Submit Form
</Button>
```

### Example 8: Card with Title

```jsx
import { Card } from '@/design-system';

<Card title="Student Information" padding="lg">
  <p>Content here</p>
</Card>
```

### Example 9: Card with Custom Header and Footer

```jsx
import { Card } from '@/design-system';

<Card
  header={<div className="flex items-center justify-between">
    <h3>Title</h3>
    <Button variant="ghost" size="sm">Action</Button>
  </div>}
  footer={<div className="text-sm text-gray-500">Footer content</div>}
>
  Content
</Card>
```

### Example 10: Using Design Tokens

```jsx
import { colors, spacing } from '@/design-system';

const customStyle = {
  backgroundColor: colors.success[500],
  padding: spacing[6],
  borderRadius: spacing[2],
};

<div style={customStyle}>Custom styled element</div>
```

## Component Combinations

### Modal with Design System Components

```jsx
import { Card, Button } from '@/design-system';

<Modal>
  <Card variant="default" padding="lg">
    <h2>Modal Title</h2>
    <p>Modal content</p>
    <div className="flex gap-4 mt-4">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  </Card>
</Modal>
```

### Form with Design System

```jsx
import { Card, Button, Input } from '@/design-system';

<Card variant="elevated" padding="lg">
  <form>
    <Input variant="default" placeholder="Name" />
    <Input variant="default" placeholder="Email" />
    <div className="flex gap-4 mt-4">
      <Button variant="secondary">Cancel</Button>
      <Button variant="success" type="submit">Submit</Button>
    </div>
  </form>
</Card>
```

## Migration Patterns

### Pattern: Action Buttons in Table

```jsx
// Original
<button className="...">Edit</button>
<button className="...">Delete</button>

// Migrated
<Button variant="ghost" icon={<Edit />}>Edit</Button>
<Button variant="danger" icon={<Trash2 />}>Delete</Button>
```

### Pattern: Page Headers

```jsx
// Original
<div className="bg-white/80...">
  <h1>Page Title</h1>
  <button className="...">Add</button>
</div>

// Migrated
<Card variant="elevated" padding="md">
  <div className="flex items-center justify-between">
    <h1>Page Title</h1>
    <Button variant="success" icon={<Plus />}>Add</Button>
  </div>
</Card>
```

