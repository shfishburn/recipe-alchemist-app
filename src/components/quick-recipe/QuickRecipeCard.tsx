
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeHighlights } from './card/RecipeHighlights';
import { RecipeDebugSection } from './card/RecipeDebugSection';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
}

export function QuickRecipeCard({ recipe }: QuickRecipeCardProps) {
  return (
    <Card className="w-full border-2 border-recipe-green/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {recipe.title}
        </CardTitle>
        <p className="text-muted-foreground">{recipe.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time indicators */}
        <RecipeTimeInfo prepTime={recipe.prepTime} cookTime={recipe.cookTime} />
        
        {/* Ingredients */}
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
