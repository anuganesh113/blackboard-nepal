/**
 * Migration Example: Classroom.jsx
 * 
 * This file shows a before/after comparison for migrating Classroom.jsx
 * to use the design system.
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { Button, Card } from '../index';

// ============================================================================
// BEFORE: Original implementation with manual styling
// ============================================================================

const ClassroomBefore = () => {
  return (
    <>
      {/* Manual button styling - 15+ lines */}
      <button
        onClick={handleAddClassroom}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Plus className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Add Classroom</span>
      </button>

      {/* Manual card styling */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
        <DataTable ... />
      </div>
    </>
  );
};

// ============================================================================
// AFTER: Using design system components
// ============================================================================

const ClassroomAfter = () => {
  return (
    <>
      {/* Design system button - 3 lines, consistent styling */}
      <Button 
        variant="success" 
        icon={<Plus />}
        onClick={handleAddClassroom}
      >
        Add Classroom
      </Button>

      {/* Design system card */}
      <Card variant="elevated">
        <DataTable ... />
      </Card>
    </>
  );
};

// ============================================================================
// BENEFITS:
// ============================================================================
// 
// 1. Reduced code: 15+ lines → 6 lines (60% reduction)
// 2. Consistency: Automatic styling consistency across all pages
// 3. Maintainability: Change button style in one place (tokens.js)
// 4. Type safety: TypeScript definitions provide IntelliSense
// 5. Accessibility: Built-in focus states and ARIA attributes
// 6. Performance: Optimized CSS classes, no runtime style calculations
//
// ============================================================================

export { ClassroomBefore, ClassroomAfter };

