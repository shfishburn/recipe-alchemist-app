
import React from 'react';
import { Recipe } from '@/types/quick-recipe';
import { RecipeHighlights } from './card/RecipeHighlights';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeSectionHeader } from './card/RecipeSectionHeader';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';

interface QuickRecipeDisplayProps {
  recipe: Recipe;
  debugMode?: boolean;
}

export const QuickRecipeDisplay: React.FC<QuickRecipeDisplayProps> = ({
  recipe,
  debugMode = false
}) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6 animate-fade-in">
      {/* Recipe Title & Overview */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{recipe.title}</h1>
        <p className="text-muted-foreground mb-4">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-4 items-center">
          <RecipeTimeInfo 
            prepTime={recipe.prep_time_min} 
            cookTime={recipe.cook_time_min}
            servings={recipe.servings}
          />
        </div>
      </div>

      {/* Recipe Highlights */}
      <RecipeHighlights 
        highlights={recipe.highlights} 
        cuisine={recipe.cuisine}
        dietary={recipe.dietary}
        flavors={recipe.flavor_tags || []}
      />

      {/* Ingredients */}
      <div className="my-6">
        <RecipeSectionHeader title="Ingredients" icon="ingredients" />
        <RecipeIngredients ingredients={recipe.ingredients} />
      </div>

      {/* Instructions */}
      <div className="my-6">
        <RecipeSectionHeader title="Instructions" icon="instructions" />
        <RecipeSteps steps={recipe.instructions} />
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8">
        <RecipeActionButtons recipe={recipe} />
      </div>
      
      {/* Debug Information */}
      {debugMode && (
        <RecipeDebugSection recipe={recipe} />
      )}
    </div>
  );
};

export default QuickRecipeDisplay;
