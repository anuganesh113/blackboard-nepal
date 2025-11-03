/**
 * Card Component Examples
 */

import React from 'react';
import { Card } from '../components';

export const CardExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Card Variants</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default Card */}
        <Card variant="default" padding="md">
          <h3 className="font-semibold mb-2">Default Card</h3>
          <p>Standard card with white/dark background and shadow.</p>
        </Card>

        {/* Elevated Card */}
        <Card variant="elevated" padding="md" hover>
          <h3 className="font-semibold mb-2">Elevated Card</h3>
          <p>Glass morphism effect with backdrop blur.</p>
        </Card>

        {/* Outlined Card */}
        <Card variant="outlined" padding="md">
          <h3 className="font-semibold mb-2">Outlined Card</h3>
          <p>Transparent background with border only.</p>
        </Card>
      </div>

      {/* Card with Title */}
      <Card title="Card with Title" padding="lg">
        <p>This card has a title prop.</p>
      </Card>

      {/* Card with Header and Footer */}
      <Card
        header={<div className="text-xl font-bold">Custom Header</div>}
        footer={<div className="text-sm text-gray-500">Footer content</div>}
        padding="md"
      >
        <p>Card with custom header and footer.</p>
      </Card>

      {/* Padding Variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="sm" variant="default">
          <p>Small padding</p>
        </Card>
        <Card padding="md" variant="default">
          <p>Medium padding (default)</p>
        </Card>
        <Card padding="lg" variant="default">
          <p>Large padding</p>
        </Card>
      </div>
    </div>
  );
};

export default CardExamples;

