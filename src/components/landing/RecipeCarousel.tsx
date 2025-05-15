
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RecipeCarouselProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
}

export function RecipeCarousel({ recipes, onRecipeClick, className }: RecipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent>
        {recipes.map((recipe, index) => (
          <CarouselItem key={recipe.id || index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onRecipeClick?.(recipe)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-md mb-3">
                    {recipe.image_url ? (
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.title} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="bg-muted w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium line-clamp-2 text-lg">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {recipe.tagline || "A delicious recipe waiting to be explored."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
