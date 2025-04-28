
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRecipes } from '@/hooks/use-recipes';
import { Skeleton } from '@/components/ui/skeleton';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();

  if (isLoading) {
    return (
      <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border">
        <div className="aspect-[4/3]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-2/3 mb-4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  const featuredRecipes = recipes?.slice(0, 3) || [];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="relative w-full"
    >
      <CarouselContent>
        {featuredRecipes.map((recipe) => (
          <CarouselItem key={recipe.id} className="md:basis-full">
            <Link to={`/recipes/${recipe.id}`}>
              <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gray-100">
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
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{recipe.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {recipe.dietary && (
                      <>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-recipe-green rounded-full mr-2"></span>
                          {recipe.dietary}
                        </span>
                        <span className="mx-2">•</span>
                      </>
                    )}
                    {recipe.cook_time_min && (
                      <>
                        <span>{recipe.cook_time_min} minutes</span>
                        <span className="mx-2">•</span>
                      </>
                    )}
                    {recipe.nutrition?.calories && (
                      <span>{recipe.nutrition.calories} calories</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-4" />
      <CarouselNext className="hidden md:flex -right-4" />
    </Carousel>
  );
}
