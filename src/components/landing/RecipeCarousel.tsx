
import React, { Suspense, useMemo } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselProgress
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselDots } from './carousel/CarouselDots';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import type { Recipe } from '@/types/recipe';
import { useIsMobile } from '@/hooks/use-mobile';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<UseEmblaCarouselType[1] | null>(null);
  const isMobile = useIsMobile();

  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
  }, [recipes]);

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

  return (
    <div className="relative w-full">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <CookingPot className="h-5 w-5 text-recipe-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-center">
                Trending in Kitchens Like Yours
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mt-2">
              These recipes are being shared across kitchens similar to yours — find out what makes them special
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,  // Enable momentum scrolling for better touch feel
              inViewThreshold: 0.5, // More consistent slide selection on swipe
            }}
            className="w-full"
            setApi={setCarouselApi}
          >
            <CarouselContent className="swipe-horizontal hw-accelerated">
              {featuredRecipes.map((recipe) => (
                <CarouselItem key={recipe.id} className={cn(
                  isMobile ? "basis-full" : "sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
                  "hw-accelerated" // Hardware acceleration for smooth sliding
                )}>
                  <RecipeCard recipe={recipe} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={cn(
              isMobile ? "-left-1 h-10 w-10" : "-left-3 md:-left-4 lg:-left-6",
              "tap-highlight-none" // Remove tap highlight on mobile
            )} />
            <CarouselNext className={cn(
              isMobile ? "-right-1 h-10 w-10" : "-right-3 md:-right-4 lg:-right-6",
              "tap-highlight-none" // Remove tap highlight on mobile
            )} />
            
            {/* Visual progress indicator for swipe position */}
            {isMobile && <CarouselProgress className="mt-4 mb-2 max-w-[80%] mx-auto" />}
          </Carousel>
          
          {/* Pagination moved outside the carousel for better positioning */}
          <div className="w-full flex flex-col items-center mt-6">
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
    <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border content-visibility-auto-card">
      <div className="aspect-[4/3] max-h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 md:p-6">
        <Skeleton className="h-6 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

// Helper function to prevent repeated imports
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
