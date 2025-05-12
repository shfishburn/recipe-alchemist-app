
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from './QuickRecipeCard'; // Fixed import 
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
  onSave?: () => void;
  isSaving?: boolean;
  debugMode?: boolean; // Re-added debug mode prop
}

export function QuickRecipeDisplay({ 
  recipe, 
  onSave,
  isSaving = false,
  debugMode = false // Default to false
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
      />
      
      {/* Re-added debug section with conditional rendering */}
      {debugMode && <RecipeDebugSection recipe={recipe} />}
    </div>
  );
}
