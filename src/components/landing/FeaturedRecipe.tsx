
import React from 'react';
import { Recipe } from '@/types/recipe';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const recipeCreatedAt = recipe.created_at ? new Date(recipe.created_at) : null;

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      {recipe.image_url && (
        <Link to={`/recipes/${recipe.slug}`}>
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-48 object-cover transition-transform transform hover:scale-105"
          />
        </Link>
      )}

      <CardContent className="p-6 flex-grow">
        <div className="mb-4">
          <Link to={`/recipes/${recipe.slug}`}>
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
              {recipe.title}
            </h3>
          </Link>
          <p className="text-gray-500 mt-1">{recipe.tagline}</p>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          {recipe.cuisine_category && recipe.cuisine_category.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{recipe.prep_time_min || 0}m Prep</span>
          </div>
          <div className="flex items-center space-x-1">
            <UsersIcon className="h-4 w-4" />
            <span>{recipe.servings} Servings</span>
          </div>
          {recipeCreatedAt && (
            <div className="text-sm text-gray-500">
              {format(recipeCreatedAt, 'MMM d, yyyy')}
            </div>
          )}
        </div>

        <ul className="list-disc pl-5 text-gray-700 mb-4">
          {recipe.instructions.slice(0, 3).map((step, index) => (
            <li key={index} className="mb-4">
              {typeof step === 'string' 
                ? step 
                : typeof step === 'object' && 'step' in step 
                  ? step.step 
                  : String(step)
              }
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 border-t border-gray-200">
        <Button variant="outline" asChild>
          <Link to={`/recipes/${recipe.slug}`} className="w-full text-center">
            View Recipe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
