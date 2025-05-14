
import React from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeHighlights } from './card/RecipeHighlights';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
}

export function QuickRecipeCard({ recipe }: QuickRecipeCardProps) {
  // Convert string times to numbers or use 0 as default
  const prepTimeMinutes = typeof recipe.prepTime === 'string' 
    ? parseInt(recipe.prepTime, 10) || 0 
    : typeof recipe.prepTime === 'number' 
      ? recipe.prepTime 
      : 0;
      
  const cookTimeMinutes = typeof recipe.cookTime === 'string' 
    ? parseInt(recipe.cookTime, 10) || 0 
    : typeof recipe.cookTime === 'number' 
      ? recipe.cookTime 
      : 0;

  return (
    <Card className="w-full border-2 border-recipe-green/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {recipe.title}
        </CardTitle>
        <p className="text-muted-foreground">{recipe.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time indicators with parsed numeric values */}
        <RecipeTimeInfo prepTime={prepTimeMinutes} cookTime={cookTimeMinutes} />
        
        {/* Use RecipeIngredients component that can handle string[] or QuickRecipeIngredient[] */}
        <RecipeIngredients ingredients={recipe.ingredients} />
        
        {/* Steps */}
        <RecipeSteps steps={recipe.steps} />
        
        {/* Nutrition Highlight & Cooking Tip */}
        <RecipeHighlights 
          nutritionHighlight={recipe.nutritionHighlight} 
          cookingTip={recipe.cookingTip} 
        />
      </CardContent>
    </Card>
  );
}
