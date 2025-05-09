
import React, { Suspense, useMemo } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { Carousel, type CarouselItem } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  
  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
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
      <div className="w-full h-full px-2">
        <RecipeCard 
          recipe={recipe} 
          priority={index === 0 || index === 1}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      ) : (
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
          
          {/* Using our updated Carousel component with appropriate settings */}
          <Carousel 
            items={carouselItems}
            renderItem={renderCarouselItem}
            showArrows={true}
            showDots={true}
            showCounter={false}
            itemWidthMobile="80%"
            itemWidthDesktop="33%"
            gap="gap-3"
            arrowPosition="outside"
            className="w-full max-w-5xl"
            autoScroll={false}
          />
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
