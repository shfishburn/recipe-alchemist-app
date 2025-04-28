
import React from 'react';
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

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<UseEmblaCarouselType[1] | null>(null);

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

  if (isLoading) {
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

  const featuredRecipes = recipes?.slice(0, 3) || [];

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative w-full"
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {featuredRecipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:basis-full">
              <RecipeCard recipe={recipe} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 md:-left-4 lg:-left-6" />
        <CarouselNext className="-right-3 md:-right-4 lg:-right-6" />
      </Carousel>
      
      <div className="absolute -bottom-8 w-full">
        <CarouselDots 
          totalItems={featuredRecipes.length} 
          selectedIndex={selectedIndex} 
        />
        <div className="text-center text-xs md:text-sm text-muted-foreground mt-2" aria-live="polite">
          Slide {selectedIndex + 1} of {featuredRecipes.length}
        </div>
      </div>
    </div>
  );
}
