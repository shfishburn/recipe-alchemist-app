
// path: src/components/quick-recipe/QuickRecipeDisplay.tsx
// file: QuickRecipeDisplay.tsx
// updated: 2025-05-09 11:05 AM

import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from 'sonner';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const { saveRecipe, isSaving } = useQuickRecipeSave();

  const handleSave = async () => {
    toast.loading("Saving your recipe...");
    await saveRecipe(recipe);
  };

  return (
    <>
      <QuickRecipeCard
        recipe={recipe}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
}
