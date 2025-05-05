
import React from 'react';
import { Recipe } from '@/types/recipe';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClockIcon, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNutriScore } from '@/hooks/use-nutri-score';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const recipeCreatedAt = recipe.created_at ? new Date(recipe.created_at) : null;
  const { grade, hasData } = useNutriScore(recipe);
  
  const renderStep = (step: string | { step: string; group?: string }) => {
    if (typeof step === 'string') {
      return step;
    } else if (typeof step === 'object' && 'step' in step) {
      return step.step;
    } else {
      return String(step);
    }
  };

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      {recipe.image_url && (
        <Link to={`/recipes/${recipe.slug}`} className="relative">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-48 object-cover transition-transform transform hover:scale-105"
          />
          
          {/* Only show badge when we have a valid grade */}
          {hasData && grade !== null && (
            <div className="absolute right-2 top-2">
              <Badge 
                className={`font-bold ${
                  grade === 'A' ? 'bg-green-500 text-white' :
                  grade === 'B' ? 'bg-green-400 text-white' :
                  grade === 'C' ? 'bg-yellow-500 text-black' :
                  grade === 'D' ? 'bg-orange-500 text-white' :
                  grade === 'E' ? 'bg-red-500 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                {grade || '?'}
              </Badge>
            </div>
          )}
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
            <span>{(recipe.prep_time_min || recipe.prep_time || 0)}m Prep</span>
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
              {renderStep(step)}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 border-t border-gray-200">
        <Button variant="outline" asChild className="w-full">
          <Link to={`/recipes/${recipe.slug}`}>
            View Recipe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
