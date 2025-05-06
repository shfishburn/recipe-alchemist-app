
import React, { useState, useEffect } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPagination
} from '@/components/ui/carousel';
import { RecipeCard } from './RecipeCard';
import { CookingPot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [api, setApi] = useState<any>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-scroll effect
  useEffect(() => {
    if (!api || isPaused) return;
    
    const interval = setInterval(() => {
      api.slideNext();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [api, isPaused]);
  
  // Debug API initialization - with safety checks
  useEffect(() => {
    if (api && api.slides) {
      console.log('Recipe Carousel API initialized:', api);
      console.log('Total slides:', api.slides.length);
    }
  }, [api]);
  
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
      
      <div 
        className="relative px-2 md:px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Carousel
          opts={{
            loop: true,
            spaceBetween: 16,
            slidesPerView: 1,
            breakpoints: {
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 }
            },
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {featuredRecipes.map((recipe, index) => (
              <CarouselItem key={recipe.id} className="pl-4 md:pl-6">
                <RecipeCard 
                  recipe={recipe} 
                  priority={index < 2} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className={cn(
            "hidden md:flex left-0 md:-left-3 lg:-left-6"
          )} />
          <CarouselNext className={cn(
            "hidden md:flex right-0 md:-right-3 lg:-right-6"
          )} />
          
          <div className="mt-4 pb-2">
            <CarouselPagination showNumbers />
          </div>
        </Carousel>
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
