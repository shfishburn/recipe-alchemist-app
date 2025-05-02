
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageLoader } from '@/components/ui/image-loader';
import { Card } from '@/components/ui/card';
import { Timer, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const [hovered, setHovered] = useState(false);
  
  // Format cooking time (e.g., "30 mins", "1 hr 15 mins")
  const formatCookingTime = (minutes: number | undefined): string => {
    if (!minutes) return 'Quick prep';
    
    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };

  // Determine difficulty badge color
  const getDifficultyColor = (difficulty: string | undefined): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Get cooking time from various possible sources, safely
  const cookingTime = recipe.cook_time_min || recipe.prep_time_min;
  
  // Safely access the difficulty property (which might not exist in Recipe type)
  const recipeDifficulty = (recipe as any).difficulty;
  
  return (
    <Link 
      to={`/recipes/${recipe.id}`}
      className="block no-underline group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Touch optimization
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 300)}
    >
      <Card className={cn(
        "overflow-hidden relative z-10 h-full transition-all duration-300 card-touch-optimized",
        "border border-gray-100 dark:border-gray-800",
        "hover:shadow-lg hover:-translate-y-1",
        hovered ? "shadow-md -translate-y-0.5" : "shadow"
      )}>
        {/* Recipe Image with Aspect Ratio */}
        <div className="relative aspect-video overflow-hidden">
          <ImageLoader
            src={recipe.image_url || '/placeholder.svg'}
            alt={recipe.title}
            className="object-cover w-full h-full"
            priority={priority}
            containerClassName="w-full h-full"
          />
          
          {/* Overlay for easier readability of badges */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          
          {/* Time Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Timer size={12} className="inline-block" />
            <span>{formatCookingTime(cookingTime)}</span>
          </div>
          
          {/* Difficulty Badge - Only show if difficulty exists */}
          {recipeDifficulty && (
            <div className={cn(
              "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
              getDifficultyColor(recipeDifficulty)
            )}>
              {recipeDifficulty}
            </div>
          )}
        </div>
        
        {/* Recipe Content */}
        <div className="p-3 md:p-4">
          <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-recipe-blue transition-colors">
            {recipe.title}
          </h3>
          
          {/* Recipe Metadata */}
          <div className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
            <div className="flex items-center">
              <Utensils size={12} className="mr-1" />
              <span>{recipe.cuisine || 'Various'}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
