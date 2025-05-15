
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RecipeCard } from "@/components/recipe-card/RecipeCard"; // Update the import path
import { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface RecipeCarouselProps {
  recipes?: Recipe[];
  className?: string;
  title?: string;
}

export function RecipeCarousel({ recipes = [], className, title }: RecipeCarouselProps) {
  // Safety check - if recipes is not an array, use empty array
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  
  // If we have no recipes, don't render anything
  if (safeRecipes.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {safeRecipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
              <RecipeCard recipe={recipe} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
