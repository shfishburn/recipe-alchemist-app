
import React from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/types/recipe';
import type { Database } from '@/integrations/supabase/types';

// Allow both Recipe types to be used
type RecipeCardProps = {
  recipe: Recipe | Database['public']['Tables']['recipes']['Row'];
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="relative z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border transition-all">
        <div className="aspect-[4/3] max-h-[300px] bg-gray-100">
          {recipe.image_url ? (
            <img 
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="p-4 md:p-6">
          <h3 className="font-medium text-base md:text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
            {recipe.dietary && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-recipe-green rounded-full mr-2"></span>
                {recipe.dietary}
              </span>
            )}
            {recipe.cook_time_min && (
              <span>{recipe.cook_time_min} minutes</span>
            )}
            {typeof recipe.nutrition === 'object' && 
             recipe.nutrition && 
             ('calories' in recipe.nutrition || 'kcal' in recipe.nutrition) && (
              <span>
                {recipe.nutrition.calories !== undefined 
                  ? `${recipe.nutrition.calories} calories` 
                  : recipe.nutrition.kcal !== undefined
                  ? `${recipe.nutrition.kcal} calories`
                  : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
