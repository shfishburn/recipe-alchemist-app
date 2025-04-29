
import React from 'react';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChefHat } from 'lucide-react';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  return (
    <section className="py-6 md:py-12 lg:py-16">
      <div className="container-page">
        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left space-y-3 lg:space-y-4 w-full lg:max-w-xl">
            <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center lg:justify-start gap-2">
              <ChefHat className="h-8 w-8 md:h-10 md:w-10 text-recipe-green" />
              What's in your kitchen tonight?
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-prose mx-auto lg:mx-0">
              Instant recipes tailored to your ingredients and tastes.
            </p>
            
            {/* Quick Recipe Generator - Only shows on mobile and desktop */}
            <div className={`py-3 sm:py-4 ${isTablet ? 'hidden' : 'block'}`}>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
                <QuickRecipeGenerator />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-auto lg:flex-1">
            {/* Recipe carousel for desktop and tablet, Generator for tablet only */}
            {isTablet ? (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-md max-w-md mx-auto">
                <QuickRecipeGenerator />
              </div>
            ) : (
              <div className="relative max-w-[600px] mx-auto">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
                <RecipeCarousel />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
