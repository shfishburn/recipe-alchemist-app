
import React from 'react';
import { Clock, Users, BookOpen, ChefHat, Utensils } from 'lucide-react';
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
      <div className="mb-2 flex flex-wrap gap-2">
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
      
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.tagline && (
        <p className="text-lg text-muted-foreground italic mb-4">{recipe.tagline}</p>
      )}
      
      <RecipeImage recipe={recipe} />
      
      {/* Recipe Overview Card */}
      <Card className="mt-6 mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-recipe-blue" /> Recipe Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recipe.servings && (
              <div className="flex flex-col items-center text-center p-2 border rounded-md">
                <Users className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="font-medium">{recipe.servings}</span>
                <span className="text-sm text-muted-foreground">Servings</span>
              </div>
            )}
            {recipe.prep_time_min && (
              <div className="flex flex-col items-center text-center p-2 border rounded-md">
                <Utensils className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="font-medium">{recipe.prep_time_min} min</span>
                <span className="text-sm text-muted-foreground">Prep Time</span>
              </div>
            )}
            {recipe.cook_time_min && (
              <div className="flex flex-col items-center text-center p-2 border rounded-md">
                <ChefHat className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="font-medium">{recipe.cook_time_min} min</span>
                <span className="text-sm text-muted-foreground">Cook Time</span>
              </div>
            )}
            {recipe.prep_time_min && recipe.cook_time_min && (
              <div className="flex flex-col items-center text-center p-2 border rounded-md">
                <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="font-medium">{recipe.prep_time_min + recipe.cook_time_min} min</span>
                <span className="text-sm text-muted-foreground">Total Time</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {(recipe.reasoning || recipe.original_request) && (
        <Card className="mb-6 bg-recipe-blue/5 border-recipe-blue/20">
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
    </div>
  );
}
