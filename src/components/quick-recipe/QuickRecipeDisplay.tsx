
import React from 'react';
import { Recipe } from '@/types/quick-recipe';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeHighlights } from './card/RecipeHighlights';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeSectionHeader } from './card/RecipeSectionHeader';
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { QuickRecipePrint } from './QuickRecipePrint';

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
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No recipe data available. Please try again.</AlertDescription>
      </Alert>
    );
  }
  
  // Check if recipe has instructions or steps
  const hasInstructions = Boolean(
    (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) || 
    (Array.isArray(recipe.steps) && recipe.steps.length > 0)
  );
  
  // Check if recipe has ingredients
  const hasIngredients = Boolean(
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
  );

  // Determine which instructions/steps to display
  const instructionsToDisplay = 
    (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) ? recipe.instructions :
    (Array.isArray(recipe.steps) && recipe.steps.length > 0) ? recipe.steps :
    [];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{recipe.title || 'Untitled Recipe'}</h2>
          
          {recipe.tagline && (
            <p className="text-gray-600 dark:text-gray-300 italic">{recipe.tagline}</p>
          )}
          
          <RecipeHighlights 
            highlights={recipe.highlights || []}
            cuisine={recipe.cuisine || ''}
            dietary={recipe.dietary || []}
            flavors={recipe.flavor_tags || []}
            nutritionHighlight={recipe.nutritionHighlight || ''}
            cookingTip={recipe.cookingTip || ''}
          />
          
          <RecipeTimeInfo 
            prepTime={recipe.prep_time_min || recipe.prepTime || 0}
            cookTime={recipe.cook_time_min || recipe.cookTime || 0}
            servings={recipe.servings || 0}
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {/* Remove duplicated section header - it's already in RecipeIngredients */}
              {hasIngredients ? (
                <RecipeIngredients ingredients={recipe.ingredients || []} />
              ) : (
                <Alert className="mt-2 bg-amber-50 dark:bg-amber-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Missing Ingredients</AlertTitle>
                  <AlertDescription>
                    This recipe doesn't have any ingredients listed.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div>
              {/* Remove duplicated section header - it's already in RecipeSteps */}
              {hasInstructions ? (
                <RecipeSteps steps={instructionsToDisplay} />
              ) : (
                <Alert className="mt-2 bg-amber-50 dark:bg-amber-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Missing Instructions</AlertTitle>
                  <AlertDescription>
                    This recipe doesn't have any cooking instructions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          
          {!hasInstructions && !hasIngredients && (
            <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Incomplete Recipe</AlertTitle>
              <AlertDescription>
                This recipe is missing both ingredients and instructions. You may want to try generating a new recipe.
              </AlertDescription>
            </Alert>
          )}
          
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
