// path: src/components/quick-recipe/QuickRecipeDisplay.tsx
// file: QuickRecipeDisplay.tsx
// updated: 2025-05-09 11:05 AM

import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { QuickRecipePrint } from '@/components/quick-recipe/QuickRecipePrint';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from 'sonner';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const { saveRecipe, isSaving } = useQuickRecipeSave();
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printEl = printRef.current?.lastChild as HTMLElement;
    printEl?.click?.();
  };

  const handleSave = async () => {
    toast.loading("Saving your recipe...");
    await saveRecipe(recipe);
  };

  return (
    <>
      <QuickRecipeCard
        recipe={recipe}
        onCook={() => setCookModeOpen(true)}
        onSave={handleSave}
        onPrint={handlePrint}
        isSaving={isSaving}
      />
      <QuickCookingMode
        recipe={recipe}
        open={cookModeOpen}
        onOpenChange={setCookModeOpen}
      />
      <div ref={printRef} className="hidden">
        <QuickRecipePrint recipe={recipe} />
      </div>
    </>
  );
}
