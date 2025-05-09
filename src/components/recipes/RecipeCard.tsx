
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { NutriScoreBadge } from '@/components/recipe-detail/nutrition/NutriScoreBadge';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

function RecipeCard({ recipe, className }: RecipeCardProps) {
  // Safe URL generation - use slug if available, otherwise use ID
  const url = recipe.slug ? `/recipes/${recipe.slug}` : `/recipes/${recipe.id}`;
  
  // Calculate total time safely
  const prepTime = recipe.prep_time_min || 0;
  const cookTime = recipe.cook_time_min || 0;
  const totalTime = prepTime + cookTime;
  const timeText = totalTime > 0 ? `${totalTime} min` : '';
  
  // Collect tags safely
  const tags = [];
  if (recipe.cuisine) tags.push(recipe.cuisine);
  if (recipe.dietary) tags.push(recipe.dietary);
  
  return (
    <Card className={cn("recipe-card overflow-hidden transition-all hover:shadow-md", className)}>
      <Link to={url} className="block h-full">
        <div className="aspect-video relative overflow-hidden">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title || 'Recipe'}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          {timeText && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {timeText}
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Only render NutriScoreBadge when recipe.nutri_score exists and has a grade */}
            {recipe.nutri_score && recipe.nutri_score.grade && (
              <NutriScoreBadge 
                nutriScore={recipe.nutri_score} 
                size="sm" 
                showTooltip={false} 
              />
            )}
          </div>
          
          <h3 className="font-medium text-base line-clamp-2">
            {recipe.title || 'Untitled Recipe'}
          </h3>
          
          {recipe.tagline && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {recipe.tagline}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default RecipeCard;
