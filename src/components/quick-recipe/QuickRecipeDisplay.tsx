
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { RecipeCard } from './QuickRecipeCard';
import { RecipeActionButtons } from './card/RecipeActionButtons';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
  onSave?: () => void;
  isSaving?: boolean;
}

export function QuickRecipeDisplay({ 
  recipe, 
  onSave,
  isSaving = false
}: QuickRecipeDisplayProps) {
  if (!recipe) return null;
  
  return (
    <div className="flex flex-col gap-4">
      <RecipeCard recipe={recipe} />
      
      <RecipeActionButtons 
        recipe={recipe} 
        onSave={onSave} 
        isSaving={isSaving}
      />
    </div>
  );
}
