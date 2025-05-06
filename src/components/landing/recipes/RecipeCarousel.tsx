
import React from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination
} from '@/components/ui/carousel';
import { RecipeCard } from './RecipeCard';
import { CookingPot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  
  if (isLoading) {
    return <RecipeCarouselSkeleton />;
  }

  const featuredRecipes = recipes?.slice(0, 6) || [];
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CookingPot className="h-5 w-5 text-recipe-green" />
          <h2 className="text-xl md:text-2xl font-semibold">
            Trending in Kitchens Like Yours
          </h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          These recipes are being shared across kitchens similar to yours — find out what makes them special
        </p>
      </div>
      
      <div className="relative px-2 md:px-4">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-4 min-w-[100%] sm:min-w-[80%] md:min-w-[50%] lg:min-w-[33%]">
                <RecipeCard recipe={recipe} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="mt-4 pb-2">
            <CarouselPagination showNumbers />
          </div>
        </Carousel>
        
        <div className="text-xs text-center text-muted-foreground mt-1">
          Swipe to see more
        </div>
      </div>
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden border shadow-sm">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
