
import React, { useMemo } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useOptimizedCarousel } from '@/hooks/use-optimized-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import { CarouselPagination } from '@/components/ui/carousel-pagination';
import { cn } from '@/lib/utils';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const { 
    api, 
    setApi, 
    activeIndex, 
    touchHandlers,
    getCarouselOptions,
    isMobile
  } = useOptimizedCarousel();

  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
  }, [recipes]);
  
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-2 md:gap-2 mb-4 md:mb-6">
          <Skeleton className="h-5 w-40 rounded mb-1" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center space-y-5 md:space-y-8 w-full">
        <div className="flex flex-col items-center justify-center gap-2 md:gap-2 mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 md:gap-2">
            <CookingPot className="h-5 w-5 md:h-5 md:w-5 text-recipe-green" />
            <h2 className="text-lg md:text-2xl font-semibold text-center">
              Trending in Kitchens Like Yours
            </h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mt-1.5 md:mt-2 px-2">
            These recipes are being shared across kitchens similar to yours — find out what makes them special
          </p>
        </div>
        
        <div className="w-full flex flex-col items-center">
          <div 
            className="w-full"
            {...touchHandlers}
          >
            <Carousel
              opts={getCarouselOptions()}
              className="w-full max-w-5xl"
              setApi={setApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredRecipes.map((recipe, index) => (
                  <CarouselItem key={recipe.id} className={cn(
                    isMobile ? "basis-full pl-2" : "basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4",
                    "hw-accelerated"
                  )}>
                    <div className="flex justify-center h-full">
                      <RecipeCard 
                        recipe={recipe} 
                        priority={index < 2} // Prioritize first two recipes for loading
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="hidden md:flex -left-3 md:-left-4 lg:-left-6" />
              <CarouselNext className="hidden md:flex -right-3 md:-right-4 lg:-right-6" />
            </Carousel>
          </div>
          
          {/* Better pagination for mobile */}
          <div className="mt-4 md:mt-6 w-full flex flex-col items-center">
            <CarouselPagination
              totalItems={featuredRecipes.length}
              activeIndex={activeIndex}
              onSelect={(index) => api?.scrollTo(index)}
              variant="dots"
              size={isMobile ? "sm" : "md"}
              showArrows={!isMobile}
              showNumbers
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border h-full">
      <div className="aspect-[4/3] max-h-[200px] md:max-h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 md:p-6">
        <Skeleton className="h-5 md:h-6 w-2/3 mb-2 md:mb-4" />
        <Skeleton className="h-3 md:h-4 w-full" />
      </div>
    </div>
  );
}
