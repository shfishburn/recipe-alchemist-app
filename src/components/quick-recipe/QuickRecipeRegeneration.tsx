// path: src/components/quick-recipe/QuickRecipeRegeneration.tsx
// file: QuickRecipeRegeneration.tsx
// updated: 2025-05-09 11:05 AM

import React from 'react';
import { Button } from '@/components/ui/button';

export interface QuickRecipeRegenerationProps {
  formData: any;
  isLoading: boolean;
  onRetry: () => void;
}

export function QuickRecipeRegeneration({
  formData,
  isLoading,
  onRetry
}: QuickRecipeRegenerationProps) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={() => onRetry(formData)}
        disabled={isLoading}
      >
        {isLoading ? 'Regenerating…' : 'Regenerate Recipe'}
      </Button>
    </div>
  );
}
