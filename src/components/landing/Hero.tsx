
import React from 'react';
import { RecipeCarousel } from './recipes/RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Brain, ChartPie, ChefHat, Sparkles, Award } from 'lucide-react';
import { NutritionPreview } from './NutritionPreview';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';

const Hero = () => {
  const isMobile = useIsMobile();
  const { open: openAuthDrawer } = useAuthDrawer();
  
  return (
    <section className="w-full py-6 md:py-12 lg:py-16">
      <div className="container-page max-w-full px-4 md:px-8">
        {/* Hero Title Section */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            <Brain className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <Award className="h-6 w-6 md:h-8 md:w-8 text-amber-500" /> 
          </div>
          
          <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI-Powered Recipe Creation
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto mt-4 md:mt-5 px-2">
            Tell us what you have in your kitchen and our <strong>AI chef</strong> will transform your ingredients into 
            delicious, <strong>personalized recipes</strong> with <strong>detailed nutrition analysis</strong> and 
            <strong> NutriScore ratings</strong> to help you reach your health goals.
          </p>
          
          {/* AI Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Powered
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <ChartPie className="w-3 h-3 mr-1" /> Nutrition Analysis
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <Award className="w-3 h-3 mr-1" /> NutriScore Ratings
            </span>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button 
              size="lg" 
              onClick={openAuthDrawer}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Get Started for Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <Link to="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Recipe Generator */}
        <div className="w-full mb-10 md:mb-12 flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 md:p-7 shadow-lg w-full max-w-3xl mx-auto transition-all duration-300 hover:shadow-xl border border-gray-100">
            <QuickRecipeGenerator />
          </div>
        </div>
        
        {/* Nutrition Preview Section */}
        <div className="w-full mb-10 md:mb-14">
          <NutritionPreview />
        </div>
        
        {/* Sample Recipes Carousel */}
        <div className="w-full mb-6 md:mb-8">
          <div className="relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full opacity-70 z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-amber-100 rounded-full opacity-70 z-0"></div>
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
