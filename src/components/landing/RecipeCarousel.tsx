
import React, { Suspense, useMemo } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { Carousel, type CarouselItem } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const isMobile = useIsMobile();
  
  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 6) || [];
  }, [recipes]);

  // Map recipes to carousel items format
  const carouselItems: CarouselItem[] = useMemo(() => {
    return featuredRecipes.map((recipe) => ({
      id: recipe.id,
      content: recipe,
    }));
  }, [featuredRecipes]);

  // Render function for carousel items
  const renderCarouselItem = (item: CarouselItem, index: number, isActive: boolean) => {
    const recipe = item.content as Recipe;
    return (
      <div className="w-full h-full px-1 sm:px-2">
        <RecipeCard 
          recipe={recipe} 
          priority={index === 0 || index === 1}
        />
      </div>
    );
  };

  // If no recipes are available, don't render the section
  if (!isLoading && featuredRecipes.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3 md:space-y-8 w-full">
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2 mb-2 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2">
              <CookingPot className="h-4 w-4 md:h-5 md:w-5 text-recipe-green" />
              <h2 className="text-base md:text-2xl font-semibold text-center">
                Trending in Kitchens Like Yours
              </h2>
            </div>
            <p className="text-xs md:text-base text-muted-foreground text-center max-w-2xl mt-1 md:mt-2 px-2">
              These recipes are being shared across kitchens similar to yours
            </p>
          </div>
          
          {/* Wrap the carousel in a ScrollArea for better touch experience */}
          <ScrollArea className="w-full max-w-5xl touch-scroll">
            <Carousel 
              items={carouselItems}
              renderItem={renderCarouselItem}
              showArrows={true}
              showDots={true}
              showCounter={false}
              itemWidthMobile="85%"
              itemWidthDesktop="33%"  
              gap="gap-2 md:gap-3"
              arrowPosition="inside"
              className="w-full max-w-5xl"
              autoScroll={!isMobile} // Only auto-scroll on desktop
              autoScrollInterval={7000} // 7 seconds between slides
            />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border content-visibility-auto-card">
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
