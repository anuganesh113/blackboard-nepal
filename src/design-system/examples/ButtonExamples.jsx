/**
 * Button Component Examples
 * 
 * This file demonstrates all button variants and usage patterns.
 * Use this as a reference when implementing buttons in your pages.
 */

import React from 'react';
import { Button } from '../components';
import { Plus, Edit, Trash2, Download, Eye, Save } from 'lucide-react';

export const ButtonExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Button Variants</h2>
      
      {/* Primary Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">Small Primary</Button>
          <Button variant="primary" size="md">Medium Primary</Button>
          <Button variant="primary" size="lg">Large Primary</Button>
          <Button variant="primary" icon={<Plus />}>With Icon</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Success Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Success Buttons (Add Actions)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="success" icon={<Plus />}>Add Classroom</Button>
          <Button variant="success" icon={<Plus />}>Add Teacher</Button>
          <Button variant="success" icon={<Plus />}>Add Subject</Button>
        </div>
      </section>

      {/* Secondary Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Secondary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary" icon={<Edit />}>Edit</Button>
        </div>
      </section>

      {/* Danger Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Danger Buttons (Delete Actions)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="danger" icon={<Trash2 />}>Delete</Button>
          <Button variant="danger">Remove</Button>
        </div>
      </section>

      {/* Warning Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Warning Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="warning">Warning</Button>
        </div>
      </section>

      {/* Purple Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Purple Buttons (Export Actions)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="purple" icon={<Download />}>Export</Button>
          <Button variant="purple" icon={<Download />}>Download</Button>
        </div>
      </section>

      {/* Ghost Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Ghost Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="ghost" icon={<Eye />}>View</Button>
          <Button variant="ghost">Secondary Action</Button>
        </div>
      </section>

      {/* Icon Position Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Icon Positions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<Save />} iconPosition="left">
            Save (Icon Left)
          </Button>
          <Button variant="primary" icon={<Save />} iconPosition="right">
            Save (Icon Right)
          </Button>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Full Width Button</h3>
        <Button variant="primary" fullWidth>
          Full Width Button
        </Button>
      </section>
    </div>
  );
};

export default ButtonExamples;

