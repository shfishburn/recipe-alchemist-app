
import React from 'react';
import { Link } from 'react-router-dom';
import { ImageLoader } from '@/components/ui/image-loader';
import { Card } from '@/components/ui/card';
import { Timer, ChartPie, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/recipe';
import { PlaceholderImage } from '@/components/recipe-detail/recipe-image/PlaceholderImage';

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  // Format cooking time
  const formatCookingTime = (minutes: number | undefined): string => {
    if (!minutes) return 'Quick prep';
    
    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes === 0
      ? `${hours} hr${hours > 1 ? 's' : ''}`
      : `${hours}h ${remainingMinutes}m`;
  };

  // Get cooking time from various possible sources
  const cookingTime = recipe.cook_time_min || recipe.prep_time_min;
  
  // Check if recipe has nutrition information
  const hasNutrition = Boolean(recipe.nutrition);
  
  // Generate URL for the recipe
  const recipeUrl = recipe.slug
    ? `/recipes/${recipe.slug}`
    : `/recipes/${recipe.id}`;
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Recipe Image */}
      <div className="relative aspect-video">
        {recipe.image_url ? (
          <ImageLoader
            src={recipe.image_url}
            alt={recipe.title}
            className="object-cover w-full h-full"
            priority={priority}
          />
        ) : (
          <PlaceholderImage 
            hasError={false} 
            variant="card" 
            title={recipe.title}
          />
        )}
        
        {/* Time Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          <Timer size={12} />
          <span>{formatCookingTime(cookingTime)}</span>
        </div>
        
        {/* Nutrition Badge - Only show if has nutrition data */}
        {hasNutrition && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-green-500/70 text-white px-2 py-1 rounded-full text-xs">
            <ChartPie size={12} />
            <span>Nutrition</span>
          </div>
        )}
      </div>
      
      {/* Recipe Content */}
      <div className="p-4">
        <h3 className="font-medium text-base line-clamp-2">
          {recipe.title}
        </h3>
        
        {recipe.cuisine && (
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Utensils size={12} className="mr-1" />
            <span>{recipe.cuisine}</span>
          </div>
        )}
      </div>
      
      <Link to={recipeUrl} className="absolute inset-0" aria-label={`View recipe: ${recipe.title}`}>
        <span className="sr-only">View {recipe.title}</span>
      </Link>
    </Card>
  );
}
