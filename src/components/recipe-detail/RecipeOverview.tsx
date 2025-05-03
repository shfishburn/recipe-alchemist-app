
import React from 'react';
import { Clock, Users, ChefHat, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/types/recipe';

interface RecipeOverviewProps {
  recipe: Recipe;
}

export function RecipeOverview({ recipe }: RecipeOverviewProps) {
  return (
    <Card className="mt-4 sm:mt-6">
      <CardContent className="pt-4 sm:pt-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-recipe-blue" /> Recipe Overview
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {recipe.servings && (
            <div className="flex flex-col items-center text-center p-2 border rounded-md">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{recipe.servings}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Servings</span>
            </div>
          )}
          {recipe.prep_time_min && (
            <div className="flex flex-col items-center text-center p-2 border rounded-md">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{recipe.prep_time_min} min</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Prep Time</span>
            </div>
          )}
          {recipe.cook_time_min && (
            <div className="flex flex-col items-center text-center p-2 border rounded-md">
              <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{recipe.cook_time_min} min</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Cook Time</span>
            </div>
          )}
          {recipe.prep_time_min && recipe.cook_time_min && (
            <div className="flex flex-col items-center text-center p-2 border rounded-md">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{recipe.prep_time_min + recipe.cook_time_min} min</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Total Time</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
