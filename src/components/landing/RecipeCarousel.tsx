
import React, { Suspense, useMemo, useState, useRef, useEffect } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselDots } from './carousel/CarouselDots';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import type { Recipe } from '@/types/recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn as classnames } from '@/lib/utils';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<UseEmblaCarouselType[1] | null>(null);
  const isMobile = useIsMobile();
  
  // Add touch state tracking
  const [isTouching, setIsTouching] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
  }, [recipes]);

  // Optimize carousel options with correct TypeScript types
  const carouselOptions = useMemo(() => ({
    align: "center" as const, // Specify literal type and center the items
    loop: true,
    dragFree: true, // Enable for all devices
    inViewThreshold: 0.6,
    dragThreshold: 10, // Lower threshold for touch
    speed: 15, // Faster animation for responsiveness
  }), []);

  React.useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    onSelect();

    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Add touch event handling with passive listeners
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    
    const touchStartHandler = () => setIsTouching(true);
    const touchEndHandler = () => setIsTouching(false);
    
    element.addEventListener('touchstart', touchStartHandler, { passive: true });
    element.addEventListener('touchend', touchEndHandler, { passive: true });
    element.addEventListener('touchcancel', touchEndHandler, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', touchStartHandler);
      element.removeEventListener('touchend', touchEndHandler);
      element.removeEventListener('touchcancel', touchEndHandler);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center" ref={carouselRef}>
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
          
          <div className="w-full flex justify-center">
            <Carousel
              opts={carouselOptions}
              className="w-full no-touch-delay max-w-5xl"
              setApi={setCarouselApi}
            >
              <CarouselContent className="swipe-horizontal hw-accelerated -ml-2 md:-ml-4 flex items-center">
                {featuredRecipes.map((recipe) => (
                  <CarouselItem key={recipe.id} className={classnames(
                    isMobile ? "basis-full pl-2" : "sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4",
                    "hw-accelerated touch-optimized" // Add optimizations
                  )}>
                    <div className="flex justify-center">
                      <RecipeCard recipe={recipe} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Update arrows for better touch targets */}
              <CarouselPrevious className={classnames(
                "hidden md:flex touch-target",
                isMobile ? "left-0 h-8 w-8" : "-left-3 md:-left-4 lg:-left-6",
                "touch-feedback tap-highlight-none z-10" // Add touch feedback
              )} />
              <CarouselNext className={classnames(
                "hidden md:flex touch-target",
                isMobile ? "right-0 h-8 w-8" : "-right-3 md:-right-4 lg:-right-6",
                "touch-feedback tap-highlight-none z-10" // Add touch feedback
              )} />
            </Carousel>
          </div>
          
          {/* Pagination moved outside the carousel for better positioning */}
          <div className="w-full flex flex-col items-center mt-4 md:mt-6">
            {/* Only show dots on desktop */}
            {!isMobile && (
              <CarouselDots 
                totalItems={featuredRecipes.length} 
                selectedIndex={selectedIndex} 
              />
            )}
            <div 
              className="text-center text-xs md:text-sm text-muted-foreground mt-2" 
              aria-live="polite"
            >
              Slide {selectedIndex + 1} of {featuredRecipes.length || 0}
            </div>
          </div>
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
