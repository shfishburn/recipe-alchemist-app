
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { QuickRecipe } from '@/types/quick-recipe';
import { ingredientToReactNode } from '@/utils/react-node-helpers';

interface FeaturedRecipeProps {
  recipe: QuickRecipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const { title, description, prepTime, cookTime, servings, ingredients } = recipe;

  // Calculate total time
  const totalTime = (prepTime || 0) + (cookTime || 0);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mx-auto">
      <div className="md:flex">
        <div className="md:w-1/3 bg-cover bg-center h-56 md:h-auto" style={{ 
          backgroundImage: recipe.image_url ? `url(${recipe.image_url})` : 'url(/images/placeholder-recipe.jpg)' 
        }}>
          {/* Image container */}
          <div className="w-full h-full bg-gradient-to-tr from-black/40 to-transparent p-8">
            <span className="bg-recipe-green text-white px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        </div>
        <div className="p-6 md:p-8 md:w-2/3">
          <div className="uppercase tracking-wide text-sm text-recipe-green font-semibold">
            {recipe.cuisine || "Specialty Recipe"}
          </div>
          <h2 className="mt-1 text-2xl font-bold leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-gray-500">
            {description || "A delicious recipe prepared with care."}
          </p>

          <div className="mt-4 flex flex-wrap gap-y-2">
            <div className="flex items-center text-sm text-gray-500 mr-6">
              <Clock className="h-4 w-4 mr-1" />
              <span>{totalTime} mins</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{servings} servings</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Main Ingredients</h3>
            <ul className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-x-2">
              {ingredients.slice(0, 4).map((ingredient, index) => (
                <li key={index} className="truncate">
                  {/* Use our utility function to convert to a valid ReactNode */}
                  {ingredientToReactNode(ingredient.item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Link to={`/recipe/${recipe.id}`}>
              <Button className="bg-recipe-green hover:bg-recipe-green/90">
                View Recipe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
