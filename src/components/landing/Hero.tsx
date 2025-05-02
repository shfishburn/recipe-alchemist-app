
import React from 'react';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChefHat } from 'lucide-react';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 content-visibility-auto">
      <div className="container-page max-w-full px-4 md:px-8">
        {/* Hero Title Section - Enhanced Visual Hierarchy */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-2">
            <ChefHat className="h-6 w-6 md:h-10 md:w-10 text-recipe-green hw-accelerated" />
            <span className="bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
              What's in your kitchen tonight?
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto mt-4 md:mt-5 px-2">
            Share what you've got and what you're craving. Pick your flavor inspiration. 
            I'll instantly transform your ingredients into delicious, foolproof recipes—complete with 
            easy shopping tips and helpful nutrition insights to make dinner a joy.
          </p>
        </div>
        
        {/* Recipe Generator - Full width with improved spacing and visual design */}
        <div className="w-full mb-10 md:mb-12 hw-accelerated">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 md:p-7 shadow-lg w-full transition-all duration-300 hover:shadow-xl border border-gray-100">
            <QuickRecipeGenerator />
          </div>
        </div>
        
        {/* Sample Recipes Carousel - Full Width with improved spacing */}
        <div className="w-full mb-6 md:mb-8">
          <div className="w-full mx-auto relative scroll-container swipe-horizontal touch-optimized">
            <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
            <RecipeCarousel />
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
