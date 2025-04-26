
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import RecipeCard from '@/components/recipes/RecipeCard';
import { useRecipes } from '@/hooks/use-recipes';
import { Loader } from 'lucide-react';

const Recipes = () => {
  const { 
    data: recipes, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm 
  } = useRecipes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Browse Recipes</h1>
          
          {/* Search Input */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search recipes by name, cuisine, or diet..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
              {searchTerm 
                ? `No recipes found matching "${searchTerm}"`
                : "No recipes found. Start by creating your first recipe!"}
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
