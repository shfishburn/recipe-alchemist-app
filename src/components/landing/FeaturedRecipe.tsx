
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Recipe } from '@/types/recipe';
import { Link } from 'react-router-dom';
import { formatCookingTime } from '@/utils/recipe-utils';
import { cn } from '@/lib/utils';

interface FeaturedRecipeProps {
  recipe: Recipe;
  className?: string;
}

export function FeaturedRecipe({ recipe, className }: FeaturedRecipeProps) {
  // Safely get the total time (prep + cook)
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
  
  // Get description from tagline (new schema) or fallback
  const description = recipe.tagline || '';
  
  return (
    <div className={cn("rounded-xl border overflow-hidden shadow-sm bg-white", className)}>
      <div className="grid md:grid-cols-2">
        <div className="p-6 flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatCookingTime(totalTime)}</span>
                </div>
              )}
              
              {recipe.cuisine && (
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{recipe.cuisine}</span>
                </div>
              )}
            </div>
            
            <p className="line-clamp-3 text-muted-foreground mb-6">
              {description}
            </p>
          </div>
          
          <Link to={`/recipe/${recipe.id}`}>
            <Button>View Recipe</Button>
          </Link>
        </div>
        
        <div className="relative">
          <AspectRatio ratio={16/9}>
            {recipe.image_url ? (
              <img 
                src={recipe.image_url} 
                alt={recipe.title} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
