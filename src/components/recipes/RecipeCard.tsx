import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Recipe } from '@/types/recipe';

interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  recipe: Recipe;
}

export function RecipeCard({ recipe, className, ...props }: RecipeCardProps) {
  // Generate title for URL slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with dashes
      .replace(/-+/g, '-');     // Remove duplicate dashes
  };

  return (
    <Link 
      to={`/recipes/${recipe.id}/${generateSlug(recipe.title)}`}
      className={cn(
        "group block relative transition-all duration-300 no-underline",
        className
      )}
      {...props}
    >
      <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        {recipe.image_url ? (
          <AspectRatio ratio={16 / 9}>
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="rounded-md object-cover transition-all duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <div className="bg-secondary rounded-md flex items-center justify-center text-secondary-foreground text-sm">
              No Image
            </div>
          </AspectRatio>
        )}
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description || 'No description available'}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4">
          {recipe.cuisine && (
            <Badge variant="secondary" className="text-xs">
              {recipe.cuisine}
            </Badge>
          )}
          {recipe.prep_time_min && recipe.cook_time_min && (
            <div className="text-xs text-muted-foreground">
              {recipe.prep_time_min + recipe.cook_time_min} min
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
