
import React, { useMemo } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import { ImageLoader } from '@/components/ui/image-loader';
import { Skeleton } from '@/components/ui/skeleton';
import { CookingPot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceholderImage } from '@/components/recipe-detail/recipe-image/PlaceholderImage';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/types/recipe';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/ui/carousel';

export function OptimizedRecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  
  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
  }, [recipes]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-2 md:gap-2 mb-4 md:mb-6">
          <Skeleton className="h-5 w-40 rounded mb-1" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center gap-2 md:gap-2 mb-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          <CookingPot className="h-5 w-5 md:h-5 md:w-5 text-recipe-green" />
          <h2 className="text-lg md:text-2xl font-semibold text-center">
            Trending in Kitchens Like Yours
          </h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mt-1.5 md:mt-2 px-2">
          These recipes are being shared across kitchens similar to yours — find out what makes them special
        </p>
      </div>
      
      <div className="w-full max-w-5xl">
        {/* New Optimized Carousel with Context Provider */}
        <Carousel 
          opts={{
            align: "center",
            loop: true,
            autoplay: true,
            autoplayInterval: 5000,
            breakpoints: {
              "(max-width: 640px)": {
                dragFree: true,
              }
            }
          }}
          ariaLabel="Featured recipes"
        >
          <CarouselContent>
            {featuredRecipes.map((recipe, index) => (
              <CarouselItem key={recipe.id}>
                <div className="px-2 md:px-4">
                  <OptimizedRecipeCard 
                    recipe={recipe} 
                    priority={index < 2} 
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="mt-6 flex justify-center">
            <CarouselPagination 
              variant="dots" 
              showNumbers 
              size="md" 
            />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

function OptimizedRecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const [hovered, setHovered] = React.useState(false);
  
  // Generate URL for the recipe using slug if available
  const recipeUrl = recipe.slug
    ? `/recipes/${recipe.slug}`
    : `/recipes/${recipe.id}`;
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background shadow-md transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "card-touch-optimized hw-accelerated"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 300)}
    >
      {/* Recipe Image with Aspect Ratio */}
      <div className="relative aspect-[4/3]">
        {recipe.image_url ? (
          <ImageLoader
            src={recipe.image_url}
            alt={recipe.title}
            priority={priority}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            containerClassName="w-full h-full"
          />
        ) : (
          <PlaceholderImage 
            hasError={false} 
            variant="card" 
            title={recipe.title}
          />
        )}
        
        {/* Recipe Metadata Badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium touch-target-base">
          {recipe.cook_time_min || recipe.prep_time_min ? (
            <span>{recipe.cook_time_min || recipe.prep_time_min} min</span>
          ) : (
            <span>Quick prep</span>
          )}
        </div>
      </div>
      
      {/* Recipe Content */}
      <div className="p-4">
        <h3 className="font-medium text-base md:text-lg line-clamp-2 transition-colors group-hover:text-primary">
          {recipe.title}
        </h3>
        
        {recipe.cuisine && (
          <p className="text-sm text-muted-foreground mt-2">{recipe.cuisine}</p>
        )}
      </div>
      
      <Link 
        to={recipeUrl} 
        className="absolute inset-0 z-10" 
        aria-label={`View recipe: ${recipe.title}`}
      >
        <span className="sr-only">View {recipe.title}</span>
      </Link>
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}
