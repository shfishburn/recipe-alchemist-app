
import React from 'react';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChefHat } from 'lucide-react';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="w-full py-6 md:py-10 mb-8">
      <div className="container-page max-w-full px-4 md:px-8">
        {/* Hero Title Section */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2">
            <ChefHat className="h-8 w-8 md:h-10 md:w-10 text-recipe-green" />
            What's in your kitchen tonight?
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto mt-3 md:mt-4">
            Share what you've got and what you're craving. Pick your flavor inspiration. 
            I'll instantly transform your ingredients into delicious, foolproof recipes—complete with 
            easy shopping tips and helpful nutrition insights to make dinner a joy.
          </p>
        </div>
        
        {/* Recipe Generator - Full width */}
        <div className="w-full mb-10 md:mb-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md w-full">
            <QuickRecipeGenerator />
          </div>
        </div>
        
        {/* Sample Recipes Carousel - Full Width */}
        <div className="w-full mb-8">
          <div className="w-full mx-auto relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
            <RecipeCarousel />
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
