
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeIngredientsProps {
  recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients && Array.isArray(recipe.ingredients) ? 
              recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {ingredient.qty} {ingredient.unit} {ingredient.item}
                  </span>
                </li>
              )) : 
              <li className="text-muted-foreground">No ingredients listed</li>
            }
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
