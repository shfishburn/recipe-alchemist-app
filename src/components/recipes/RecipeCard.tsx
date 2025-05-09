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
  const url = recipe.slug ? `/recipes/${recipe.slug}` : `/recipes/${recipe.id}`;
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
  const timeText = totalTime > 0 ? `${totalTime} min` : '';
  
  const tags = [];
  if (recipe.cuisine) tags.push(recipe.cuisine);
  if (recipe.dietary) tags.push(recipe.dietary);
  
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <Link to={url} className="block h-full">
        <div className="aspect-video relative overflow-hidden">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="object-cover w-full h-full"
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
            <NutriScoreBadge nutriScore={recipe.nutri_score} size="sm" showTooltip={false} />
          </div>
          
          <h3 className="font-medium text-base line-clamp-2">{recipe.title}</h3>
          
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
