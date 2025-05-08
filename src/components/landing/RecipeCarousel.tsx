
import React, { Suspense, useMemo, useState, useRef, useEffect } from 'react';
import { useRecipes } from '@/hooks/use-recipes';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './carousel/RecipeCard';
import { CookingPot } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn as classnames } from '@/lib/utils';

export function RecipeCarousel() {
  const { data: recipes, isLoading } = useRecipes();
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Memoize featured recipes to prevent unnecessary re-renders
  const featuredRecipes = useMemo(() => {
    return recipes?.slice(0, 5) || [];
  }, [recipes]);

  // Handle scroll events to update active dot
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      if (!scrollContainer) return;
      
      const scrollPosition = scrollContainer.scrollLeft;
      const itemWidth = scrollContainer.clientWidth * (isMobile ? 0.85 : 0.45);
      const newIndex = Math.round(scrollPosition / itemWidth);
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < featuredRecipes.length) {
        setActiveIndex(newIndex);
      }
    };
    
    // Detect user interaction to stop auto-scrolling
    const stopAutoScroll = () => {
      setUserInteracted(true);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('touchstart', stopAutoScroll, { passive: true });
    scrollContainer.addEventListener('mousedown', stopAutoScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('touchstart', stopAutoScroll);
      scrollContainer.removeEventListener('mousedown', stopAutoScroll);
    };
  }, [activeIndex, featuredRecipes.length, isMobile]);

  // Scroll to item when user clicks on a dot
  const scrollToItem = (index: number) => {
    setUserInteracted(true);
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    scrollContainer.classList.add('user-scrolling');
    
    const itemWidth = scrollContainer.clientWidth * (isMobile ? 0.85 : 0.45);
    scrollContainer.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    });
    setActiveIndex(index);
    
    // Remove class after animation completes
    setTimeout(() => {
      if (scrollContainer) {
        scrollContainer.classList.remove('user-scrolling');
      }
    }, 500);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <RecipeCarouselSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-5 md:space-y-8 w-full">
          <div className="flex flex-col items-center justify-center gap-2 md:gap-2 mb-4 md:mb-6">
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
          
          {/* Updated carousel with standardized classes and fixes */}
          <div 
            className="carousel-container carousel-container-with-indicators"
            role="region" 
            aria-label="Recipe carousel"
          >
            <div 
              ref={scrollRef}
              className="carousel-scroll-area" 
              tabIndex={0}
              aria-live="polite"
            >
              {featuredRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className={classnames(
                    "carousel-item",
                    isMobile ? "carousel-item-mobile" : "carousel-item-desktop"
                  )}
                  aria-hidden={activeIndex !== index}
                >
                  <div className="w-full h-full">
                    <RecipeCard 
                      recipe={recipe} 
                      priority={index === 0 || index === 1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination dots with fixed styling */}
          <div className="carousel-pagination" role="tablist">
            {featuredRecipes.map((_, index) => (
              <button
                key={index}
                className={classnames(
                  "carousel-pagination-dot touch-target-base",
                  activeIndex === index ? "carousel-pagination-dot-active" : ""
                )}
                onClick={() => scrollToItem(index)}
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={activeIndex === index ? 0 : -1}
              />
            ))}
          </div>
          
          {/* A11y slide counter */}
          <div 
            className="text-center text-xs md:text-sm text-muted-foreground mt-1" 
            aria-live="polite"
          >
            Slide {activeIndex + 1} of {featuredRecipes.length || 0}
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeCarouselSkeleton() {
  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border content-visibility-auto-card">
      <div className="aspect-[4/3] max-h-[200px] md:max-h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 md:p-6">
        <Skeleton className="h-5 md:h-6 w-2/3 mb-2 md:mb-4" />
        <Skeleton className="h-3 md:h-4 w-full" />
      </div>
    </div>
  );
}
