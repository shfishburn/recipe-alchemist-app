
import React from 'react';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Brain, ChartPie, ChefHat, Sparkles } from 'lucide-react';
import { NutritionPreview } from './NutritionPreview';

// Use React.memo to prevent unnecessary re-renders
const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 content-visibility-auto">
      <div className="container-page max-w-full px-4 md:px-8">
        {/* Hero Title Section - Enhanced Visual Hierarchy */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-recipe-green hw-accelerated" />
            <Brain className="h-6 w-6 md:h-8 md:w-8 text-recipe-blue hw-accelerated" />
          </div>
          
          <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
              AI-Powered Recipe Creation
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto mt-4 md:mt-5 px-2">
            Tell us what you have in your kitchen and our <strong>AI chef</strong> will transform your ingredients into 
            delicious, <strong>personalized recipes</strong> with tailored <strong>nutrition insights</strong>.
          </p>
          
          {/* AI Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Powered
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <ChartPie className="w-3 h-3 mr-1" /> Personalized Nutrition
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded">
              Ready in 30 mins
            </span>
          </div>
        </div>
        
        {/* Recipe Generator - Full width with improved spacing and visual design */}
        <div className="w-full mb-10 md:mb-12 flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 md:p-7 shadow-lg w-full max-w-3xl mx-auto transition-all duration-300 hover:shadow-xl border border-gray-100">
            <QuickRecipeGenerator />
          </div>
        </div>
        
        {/* Nutrition Preview Section - Centered */}
        <div className="w-full mb-10 md:mb-14 flex justify-center">
          <div className="w-full max-w-6xl">
            <NutritionPreview />
          </div>
        </div>
        
        {/* Sample Recipes Carousel - Full Width with improved spacing and centering */}
        <div className="w-full mb-6 md:mb-8 flex justify-center">
          <div className="w-full max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
            <div className="relative z-10 w-full">
              <RecipeCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
