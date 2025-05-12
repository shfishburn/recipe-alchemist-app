
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from './QuickRecipeCard'; 
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  debugMode?: boolean;
  onResetSaveSuccess?: () => void; // New prop for reset functionality
}

export function QuickRecipeDisplay({ 
  recipe, 
  onSave,
  isSaving = false,
  saveSuccess = false,
  debugMode = false,
  onResetSaveSuccess
}: QuickRecipeDisplayProps) {
  // Enhanced null check and validation
  if (!recipe || typeof recipe !== 'object' || !recipe.title || !Array.isArray(recipe.ingredients)) {
    console.error('Invalid recipe object provided to QuickRecipeDisplay:', recipe);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: Recipe data is invalid or incomplete.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      <QuickRecipeCard recipe={recipe} />
      
      <RecipeActionButtons 
        recipe={recipe} 
        onSave={onSave} 
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onResetSaveSuccess={onResetSaveSuccess}
      />
      
      {debugMode && <RecipeDebugSection recipe={recipe} />}
    </div>
  );
}
