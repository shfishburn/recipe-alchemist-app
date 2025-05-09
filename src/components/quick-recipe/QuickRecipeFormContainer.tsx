// path: src/components/quick-recipe/QuickRecipeFormContainer.tsx
// file: QuickRecipeFormContainer.tsx
// updated: 2025-05-09 11:05 AM

import React, { useState } from 'react';
import QuickRecipeTagForm from './QuickRecipeTagForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { Card } from '@/components/ui/card';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { FullScreenLoading } from './FullScreenLoading';

export function QuickRecipeFormContainer() {
  const { handleSubmit } = useQuickRecipeForm();
  const { isLoading } = useQuickRecipeStore();

  return (
    <div className="relative overflow-hidden">
      {isLoading && <FullScreenLoading />}
      {/* Decorative background circles could stay here if desired */}
      <Card className="relative z-10 bg-white/50 backdrop-blur-sm border-gray-100 shadow-lg p-6 rounded-xl">
        <QuickRecipeTagForm
          onIngredientsChange={...}
          onServingsSelect={...}
          onCuisineSelect={...}
          onDietarySelect={...}
          ingredients={...}
          selectedServings={...}
          selectedCuisine={...}
          selectedDietary={...}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
