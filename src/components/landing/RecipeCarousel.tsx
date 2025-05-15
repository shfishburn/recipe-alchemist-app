
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/recipe';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselItemType
} from "@/components/ui/carousel";

interface RecipeCarouselProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
}

export function RecipeCarousel({ recipes = [], onRecipeClick, className }: RecipeCarouselProps) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Transform recipes into carousel items
  const carouselItems: CarouselItemType[] = recipes.map((recipe, index) => ({
    id: recipe.id || `recipe-${index}`,
    content: recipe
  }));

  // Render function for recipe items
  const renderRecipeItem = (item: CarouselItemType, index: number, isActive: boolean) => {
    const recipe = item.content as Recipe;
    
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all h-full"
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
    );
  };

  return (
    <Carousel
      className={cn("w-full", className)}
      items={carouselItems}
      renderItem={renderRecipeItem}
      showArrows={true}
      showDots={true}
      itemWidthMobile="85%"
      itemWidthDesktop="33%"
      gap="gap-4"
    />
  );
}

export default RecipeCarousel;
