
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { RecipeCard } from "../recipes/RecipeCard";
import { useRecipes } from '@/hooks/use-recipes';
// Import with an alias to avoid name conflict
import { transformRecipeData as transformData } from '@/utils/recipe-transformers';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function RecipeCarousel() {
  const { data: recipes } = useRecipes();

  const displayRecipes = React.useMemo(() => {
    if (!recipes || !Array.isArray(recipes)) return [];
    return recipes.slice(0, 6);
  }, [recipes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6">Recently Added Recipes</h3>
        <Link to="/recipes">
          <Button variant="ghost" size="sm" className="text-sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="relative">
        {displayRecipes.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {displayRecipes.map(recipe => (
                <CarouselItem key={recipe.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <RecipeCard recipe={recipe} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {displayRecipes.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        ) : (
          <Card className="p-6 text-center text-gray-500">
            No recipes available. Create your first recipe to see it here!
          </Card>
        )}
      </div>
    </div>
  );
}
