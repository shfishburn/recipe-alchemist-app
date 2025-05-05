
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import RecipeCard from '@/components/recipes/RecipeCard';
import { useRecipes } from '@/hooks/use-recipes';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

const Recipes = () => {
  const { 
    data: recipes, 
    isLoading, 
    isFetching,
    error, 
    searchTerm, 
    setSearchTerm,
    status,
  } = useRecipes();

  useEffect(() => {
    console.log('Recipes component render state:', {
      status,
      isLoading,
      isFetching,
      recipesCount: recipes?.length,
      error: error ? `${error}` : 'none'
    });
    
    if (error) {
      toast.error('Failed to load recipes. Please try again later.');
      console.error('Recipe loading error:', error);
    }
  }, [status, isLoading, isFetching, recipes, error]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Kitchen', current: true }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNav items={breadcrumbItems} />
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">My Kitchen</h1>
          <p className="text-base text-muted-foreground mb-8">
            Browse your personalized recipes, save favorites, and discover new cooking inspiration tailored to your nutritional needs.
          </p>
          
          {/* Search Input with Loading Indicator */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search recipes by name, cuisine, or diet..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isFetching && !isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && error && (
            <div className="text-center text-red-500 p-8 border border-red-200 rounded-lg">
              <p className="mb-2 font-semibold">Failed to load recipes</p>
              <p>Please try refreshing the page</p>
            </div>
          )}
          
          {!isLoading && !error && recipes && recipes.length === 0 && (
            <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
              {searchTerm 
                ? <p>No recipes found matching "<span className="font-medium">{searchTerm}</span>"</p>
                : <p>No recipes found. Start by creating your first recipe!</p>
              }
            </div>
          )}
          
          {!isLoading && !error && recipes && recipes.length > 0 && (
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
