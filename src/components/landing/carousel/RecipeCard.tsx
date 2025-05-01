
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/types/recipe';
import type { Database } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Allow both Recipe types to be used
type RecipeCardProps = {
  recipe: Recipe | Database['public']['Tables']['recipes']['Row'];
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();
  
  // Add state for touch handling
  const [isTouched, setIsTouched] = useState(false);
  
  // Add touch handlers with correct visual feedback
  const handleTouchStart = () => setIsTouched(true);
  const handleTouchEnd = () => setIsTouched(false);
  
  // Optimize image loading
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Use intersection observer for lazy loading
  useEffect(() => {
    if (!imageRef.current || !recipe.image_url || imageError) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imageRef.current) {
            // Set proper src only when visible
            const img = imageRef.current;
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              img.setAttribute('src', dataSrc);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );
    
    observer.observe(imageRef.current);
    
    return () => observer.disconnect();
  }, [recipe.image_url, imageError]);

  return (
    <Link 
      to={`/recipes/${recipe.id}`}
      className={cn(
        "block h-full touch-optimized card-touch-optimized",
        isTouched ? "touch-active" : ""
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={cn(
        "h-full relative z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-xl overflow-hidden border transition-all flex flex-col",
        "touch-transition hw-accelerated", // Add optimizations
        isMobile ? "touch-optimized" : ""
      )}>
        <div className="aspect-[4/3] max-h-[200px] md:max-h-[300px] bg-gray-100 relative">
          {recipe.image_url && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full absolute inset-0" />
                </div>
              )}
              <img 
                ref={imageRef}
                data-src={recipe.image_url} // Use data-src for intersection observer
                alt={recipe.title}
                className={cn(
                  "w-full h-full object-cover hw-accelerated",
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                  "transition-opacity duration-200" // Faster transition
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}
        </div>
        <div className="p-3 md:p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-base md:text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mt-auto">
            {recipe.dietary && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-recipe-green rounded-full mr-1.5"></span>
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
