
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { NutriScoreBadge } from '@/components/recipe-detail/nutrition/NutriScoreBadge';
import { Badge } from '@/components/ui/badge';
import { Clock, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  
  return (
    <Card className={cn(
      "recipe-card overflow-hidden transition-all relative group",
      "hover:-translate-y-1 hover:shadow-elevation-2 active:shadow-elevation-1 active:translate-y-0",
      "transform duration-200 ease-in-out",
      className
    )}>
      <Link to={url} className="block h-full" aria-label={`View recipe: ${recipe.title || 'Untitled Recipe'}`}>
        {/* Material Design 16:9 aspect ratio for images */}
        <AspectRatio ratio={16/9} className="w-full">
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
          
          {/* Material scrim overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Time indicator with Material icon */}
          {timeText && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              <Clock className="h-3 w-3" />
              <span>{timeText}</span>
            </div>
          )}
        </AspectRatio>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2 flex-wrap">
              {recipe.cuisine && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Utensils className="h-3 w-3" />
                  {recipe.cuisine}
                </Badge>
              )}
              
              {recipe.dietary && (
                <Badge variant="outline" className="text-xs">
                  {recipe.dietary}
                </Badge>
              )}
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
          
          <h3 className="material-title-medium line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title || 'Untitled Recipe'}
          </h3>
          
          {recipe.tagline && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 material-body-medium">
              {recipe.tagline}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default RecipeCard;
