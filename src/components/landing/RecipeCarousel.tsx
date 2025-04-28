
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '@/hooks/use-recipes';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { type Recipe } from '@/types/recipe';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

const CarouselDots = ({ 
  recipes, 
  selectedIndex 
}: { 
  recipes: Recipe[], 
  selectedIndex: number 
}) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {recipes.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-colors ${
            index === selectedIndex
              ? 'bg-recipe-blue'
              : 'bg-recipe-blue/30'
          }`}
          aria-label={`Slide ${index + 1} of ${recipes.length}`}
        />
      ))}
    </div>
  );
};

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
    
    // Call once to set initial value
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
              <Link to={`/recipes/${recipe.id}`}>
                <div className="relative z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border transition-all">
                  <div className="aspect-[4/3] max-h-[300px] bg-gray-100">
                    {recipe.image_url ? (
                      <img 
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-medium text-base md:text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      {recipe.dietary && (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-recipe-green rounded-full mr-2"></span>
                          {recipe.dietary}
                        </span>
                      )}
                      {recipe.cook_time_min && (
                        <span>{recipe.cook_time_min} minutes</span>
                      )}
                      {typeof recipe.nutrition === 'object' && 
                       recipe.nutrition && 
                       'calories' in recipe.nutrition && (
                        <span>
                          {recipe.nutrition.calories !== null ? 
                            `${recipe.nutrition.calories} calories` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 md:-left-4 lg:-left-6" />
        <CarouselNext className="-right-3 md:-right-4 lg:-right-6" />
      </Carousel>
      
      <div className="absolute -bottom-8 w-full">
        <CarouselDots 
          recipes={featuredRecipes} 
          selectedIndex={selectedIndex} 
        />
        <div className="text-center text-xs md:text-sm text-muted-foreground mt-2" aria-live="polite">
          Slide {selectedIndex + 1} of {featuredRecipes.length}
        </div>
      </div>
    </div>
  );
}
