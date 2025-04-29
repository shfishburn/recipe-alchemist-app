
import React from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/types/recipe';
import type { Database } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';

// Allow both Recipe types to be used
type RecipeCardProps = {
  recipe: Recipe | Database['public']['Tables']['recipes']['Row'];
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="h-full relative z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border transition-all flex flex-col">
        <div className="aspect-[4/3] max-h-[300px] bg-gray-100 relative">
          {recipe.image_url && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full absolute inset-0" />
                </div>
              )}
              <img 
                src={recipe.image_url}
                alt={recipe.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="font-medium text-base md:text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mt-auto">
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
