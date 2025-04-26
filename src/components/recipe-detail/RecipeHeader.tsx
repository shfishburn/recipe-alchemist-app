import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeImage } from './RecipeImage';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="mb-8">
      <RecipeImage recipe={recipe} />
      
      {(recipe.reasoning || recipe.original_request) && (
        <Card className="mb-8 bg-recipe-blue/5 border-recipe-blue/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-recipe-blue mt-1" />
              <div className="space-y-2">
                {recipe.original_request && (
                  <p className="text-sm text-muted-foreground">
                    Original request: <span className="font-medium text-foreground">{recipe.original_request}</span>
                  </p>
                )}
                {recipe.reasoning && (
                  <p className="text-sm text-muted-foreground">{recipe.reasoning}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.tagline && (
        <p className="text-lg text-muted-foreground italic mb-4">{recipe.tagline}</p>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.cuisine && (
          <Badge variant="outline" className="bg-recipe-blue/10 text-recipe-blue">
            {recipe.cuisine}
          </Badge>
        )}
        {recipe.dietary && (
          <Badge variant="outline" className="bg-green-500/10 text-green-700">
            {recipe.dietary}
          </Badge>
        )}
        {recipe.flavor_tags?.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-gray-100">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {recipe.servings && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
        {recipe.prep_time_min && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Prep: {recipe.prep_time_min} min</span>
          </div>
        )}
        {recipe.cook_time_min && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Cook: {recipe.cook_time_min} min</span>
          </div>
        )}
        {recipe.prep_time_min && recipe.cook_time_min && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Total: {recipe.prep_time_min + recipe.cook_time_min} min</span>
          </div>
        )}
      </div>
    </div>
  );
}
