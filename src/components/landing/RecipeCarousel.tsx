
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';
import { getRecipeDescription } from '@/utils/recipe-transformers';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

export interface RecipeCarouselProps {
  recipes?: Recipe[];
  className?: string;
  title?: string;
}

export const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ 
  recipes = [], 
  className,
  title 
}) => {
  const displayRecipes = recipes?.length ? recipes.slice(0, 5) : [];
  
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      )}

      <div className="relative w-full">
        <Carousel
          className="w-full"
          opts={{
            align: 'start'
          }}
        >
          <CarouselContent>
            {displayRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/recipes/${recipe.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <AspectRatio ratio={16/9} className="bg-muted">
                          {recipe.image_url && (
                            <img
                              src={recipe.image_url}
                              alt={recipe.title}
                              className="object-cover w-full h-full rounded-t-md"
                            />
                          )}
                        </AspectRatio>
                        <div className="p-4">
                          <h3 className="font-semibold text-md mb-1 truncate">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getRecipeDescription(recipe)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};
