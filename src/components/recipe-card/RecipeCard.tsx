
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { RecipeCardActions } from './RecipeCardActions';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { NutriScoreBadge } from '../recipe-detail/nutrition/NutriScoreBadge';
import { useNutriScore } from '@/hooks/use-nutri-score';

interface RecipeCardProps {
  id: string;
  slug?: string;
  title: string;
  image?: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  cuisine?: string;
  className?: string;
}

export function RecipeCard({
  id,
  slug,
  title,
  image,
  description,
  prepTime,
  cookTime,
  cuisine,
  className,
}: RecipeCardProps) {
  // Load the full recipe to get nutrition data
  const { data: recipe } = useRecipeDetail(id);
  const { grade, hasData } = useNutriScore(recipe);
  
  // Determine the URL for the recipe
  const recipeUrl = slug ? `/recipe/${slug}` : `/recipes/${id}`;

  return (
    <Card className={className}>
      <div className="relative">
        {/* Recipe image */}
        <Link to={recipeUrl} className="block">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            
            {/* Nutri-Score badge */}
            {hasData && (
              <div className="absolute right-2 top-2">
                <NutriScoreBadge grade={grade} size="sm" />
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="p-4">
        {/* Recipe title */}
        <Link to={recipeUrl} className="block">
          <h3 className="line-clamp-2 text-lg font-medium hover:underline">{title}</h3>
        </Link>

        {/* Recipe description */}
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}

        {/* Meta information */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {prepTime && <span>Prep: {prepTime} min</span>}
          {cookTime && <span>Cook: {cookTime} min</span>}
          {cuisine && <span>Cuisine: {cuisine}</span>}
        </div>

        {/* Actions */}
        <div className="mt-4">
          <RecipeCardActions recipe={recipe || { id, title }} />
        </div>
      </div>
    </Card>
  );
}
