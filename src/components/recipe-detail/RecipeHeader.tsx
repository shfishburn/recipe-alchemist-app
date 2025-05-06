
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NutriScoreBadge } from './nutrition/nutri-score/NutriScoreBadge';
import type { Recipe } from '@/types/recipe';

interface RecipeHeaderProps {
  recipe: Recipe;
  hideReasoning?: boolean;
}

export function RecipeHeader({ recipe, hideReasoning = false }: RecipeHeaderProps) {
  // Display all tags together in a flatter structure
  const hasTags = recipe.cuisine || recipe.dietary || (recipe.flavor_tags && recipe.flavor_tags.length > 0);
  
  return (
    <div className="mb-4">
      {hasTags && (
        <div className="mb-2 flex flex-wrap gap-2 items-center">
          {recipe.cuisine && (
            <Badge variant="outline" className="bg-recipe-blue/10 text-recipe-blue">
              {recipe.cuisine}
            </Badge>
          )}
          {recipe.dietary && (
            <Badge variant="outline" className="bg-green-500/10 text-green-700">
              {recipe.dietary}
            </Badge>
          )}
          {recipe.nutri_score && (
            <div className="ml-1">
              <NutriScoreBadge nutriScore={recipe.nutri_score} size="sm" />
            </div>
          )}
          {recipe.flavor_tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.tagline && (
        <p className="text-base sm:text-lg text-muted-foreground italic">{recipe.tagline}</p>
      )}
    </div>
  );
}
