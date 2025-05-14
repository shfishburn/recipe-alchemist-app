
import React from 'react';
import { MaterialRecipeCard } from './MaterialRecipeCard';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/recipe';

interface MaterialRecipeGridProps {
  recipes: Recipe[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export function MaterialRecipeGrid({ 
  recipes = [], 
  className,
  emptyMessage = "No recipes found",
  loading = false
}: MaterialRecipeGridProps) {
  // Handle empty state
  if (!loading && (!recipes || recipes.length === 0)) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
      className
    )}>
      {loading ? (
        // Skeleton loading state with Material Design
        Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`skeleton-${i}`} 
            className="animate-pulse bg-muted rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-muted-foreground/20" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/10 rounded w-1/2" />
            </div>
          </div>
        ))
      ) : (
        recipes.map((recipe, index) => (
          <MaterialRecipeCard 
            key={recipe.id || index} 
            recipe={recipe} 
            priority={index < 4} 
          />
        ))
      )}
    </div>
  );
}
