
import React from 'react';
import Navbar from '@/components/ui/navbar';
import RecipeCard from '@/components/recipes/RecipeCard';
import { useRecipes } from '@/hooks/use-recipes';
import { Loader } from 'lucide-react';

const Recipes = () => {
  const { data: recipes, isLoading, error } = useRecipes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Browse Recipes</h1>
          
          {isLoading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500">
              Failed to load recipes. Please try again later.
            </div>
          )}
          
          {recipes && recipes.length === 0 && (
            <div className="text-center text-muted-foreground">
              No recipes found. Start by creating your first recipe!
            </div>
          )}
          
          {recipes && recipes.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Recipes;
