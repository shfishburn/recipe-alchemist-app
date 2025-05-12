
import React from 'react';
import { Recipe } from '@/types/quick-recipe';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeHighlights } from './card/RecipeHighlights';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeSectionHeader } from './card/RecipeSectionHeader';
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';

interface QuickRecipeDisplayProps {
  recipe: Recipe;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  saveSuccess?: boolean;
  debugMode?: boolean;
  onResetSaveSuccess?: () => void;
  savedSlug?: string;
}

export const QuickRecipeDisplay: React.FC<QuickRecipeDisplayProps> = ({ 
  recipe,
  onSave,
  isSaving = false,
  saveSuccess = false,
  debugMode = false,
  onResetSaveSuccess,
  savedSlug
}) => {
  if (!recipe) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{recipe.title}</h2>
          
          {recipe.tagline && (
            <p className="text-gray-600 dark:text-gray-300 italic">{recipe.tagline}</p>
          )}
          
          <RecipeHighlights recipe={recipe} />
          
          <RecipeTimeInfo 
            prepTimeMin={recipe.prep_time_min} 
            cookTimeMin={recipe.cook_time_min} 
            servings={recipe.servings} 
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <RecipeSectionHeader title="Ingredients" />
              <RecipeIngredients ingredients={recipe.ingredients} />
            </div>
            
            <div>
              <RecipeSectionHeader title="Instructions" />
              <RecipeSteps steps={recipe.instructions} />
            </div>
          </div>
          
          <RecipeActionButtons 
            onSave={onSave}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            recipe={recipe}
            onResetSaveSuccess={onResetSaveSuccess}
            savedSlug={savedSlug}
          />
          
          {debugMode && <RecipeDebugSection recipe={recipe} />}
        </div>
      </div>
    </div>
  );
};
