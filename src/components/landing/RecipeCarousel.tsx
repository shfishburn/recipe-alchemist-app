
import React, { Suspense, useMemo } from 'react';
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
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import type { Recipe } from '@/types/recipe';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<UseEmblaCarouselType[1] | null>(null);

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
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {featuredRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <RecipeCard recipe={recipe} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 md:-left-4 lg:-left-6" />
          <CarouselNext className="-right-3 md:-right-4 lg:-right-6" />
          <div className="absolute -bottom-8 w-full">
            <CarouselDots 
              totalItems={featuredRecipes.length} 
              selectedIndex={selectedIndex} 
            />
            <div className="text-center text-xs md:text-sm text-muted-foreground mt-2" aria-live="polite">
              Slide {selectedIndex + 1} of {featuredRecipes.length || 0}
            </div>
          </div>
        </Carousel>
      )}
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border">
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
