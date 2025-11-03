# Modal Status Default Values

## Overview
All modals in the application should have status fields defaulting to "Yes" (or equivalent positive values) to provide a better user experience.

## Current Implementation Status

### ✅ Completed Modals

#### 1. CourseModal
- **Status Field**: `status: 'Yes'`
- **Default Value**: `'Yes'` (string)
- **Options**: `['Yes', 'No']`

#### 2. ClassroomModal
- **Status Field**: `status: 'yes'`
- **Default Value**: `'yes'` (string)
- **Options**: `['yes', 'no']`
- **Display**: `{status === 'yes' ? 'Yes' : 'No'}`

#### 3. SubjectModal
- **Status Field**: `status: true`
- **Default Value**: `true` (boolean)
- **Options**: `[true, false]`
- **Display**: `{subject.status ? 'Yes' : 'No'}`

#### 4. BatchModal
- **Status Field**: `isActive: true`
- **Default Value**: `true` (boolean)
- **Options**: `[true, false]`
- **Display**: `{batch.isActive ? 'Yes' : 'No'}`

#### 5. SectionModal
- **Status Field**: `isActive: true`
- **Default Value**: `true` (boolean)
- **Options**: `[true, false]`
- **Display**: `{section.isActive ? 'Yes' : 'No'}`

#### 6. TeacherModal
- **Status Field**: `isActive: true`
- **Default Value**: `true` (boolean)
- **Options**: `[true, false]`
- **Display**: `{teacher.isActive ? 'Yes' : 'No'}`

## Guidelines for Future Modal Development

### 1. Status Field Naming
- Use `status` for general status fields
- Use `isActive` for boolean active/inactive states
- Use `isEnabled` for feature toggles
- Use `isVisible` for visibility controls

### 2. Default Values
- **String Status**: Default to `'Yes'` or `'yes'`
- **Boolean Status**: Default to `true`
- **Never default to empty strings or false values**

### 3. Implementation Pattern

```javascript
// For string-based status
const [formData, setFormData] = useState({
  // ... other fields
  status: 'Yes' // Default to positive value
});

// For boolean-based status
const [formData, setFormData] = useState({
  // ... other fields
  isActive: true // Default to positive value
});

// In useEffect for create mode
setFormData({
  // ... other fields
  status: 'Yes' // or isActive: true
});
```

### 4. Form Reset Pattern

```javascript
// Always reset to positive default values
setFormData({
  name: '',
  // ... other fields
  status: 'Yes' // or isActive: true
});
```

### 5. Edit Mode Handling

```javascript
// When editing, preserve existing value or default to positive
setFormData({
  // ... other fields
  status: existingData.status || 'Yes', // or isActive: existingData.isActive ?? true
});
```

## Best Practices

1. **Consistency**: Use the same default value pattern across all modals
2. **User Experience**: Default to positive values to reduce user friction
3. **Validation**: Ensure status fields are required and validated
4. **Display**: Always show "Yes" for positive values in the UI
5. **Data Integrity**: Maintain consistent data types (string vs boolean)

## Testing Checklist

- [ ] New modal has status field with positive default
- [ ] Create mode resets to positive default
- [ ] Edit mode preserves existing value or defaults to positive
- [ ] Form validation works correctly
- [ ] Display shows "Yes" for positive values
- [ ] Data persistence works correctly

## Examples

### Good Implementation
```javascript
// ✅ Correct - defaults to positive value
const [formData, setFormData] = useState({
  name: '',
  status: 'Yes' // or isActive: true
});
```

### Bad Implementation
```javascript
// ❌ Incorrect - defaults to empty or negative value
const [formData, setFormData] = useState({
  name: '',
  status: '' // or isActive: false
});
```

## Maintenance

This document should be updated whenever:
- New modals are added
- Status field patterns change
- Default value requirements change
- New status field types are introduced
