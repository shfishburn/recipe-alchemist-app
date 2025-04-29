
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-16 lg:py-20">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              {!isMobile ? (
                <>
                  Transform your meals with
                  <span className="text-gradient block mt-2">AI-powered recipes</span>
                </>
              ) : (
                <span className="text-gradient">AI-powered recipes</span>
              )}
            </h1>
            
            {!isMobile && (
              <p className="text-lg text-muted-foreground max-w-prose">
                Create healthy, personalized recipes tailored to your ingredients, 
                dietary preferences, and nutritional goals.
              </p>
            )}
            
            {/* Quick Recipe Generator */}
            <div className="py-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-2 md:mb-4">Create a Quick Recipe</h2>
                <QuickRecipeGenerator />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button asChild size={isMobile ? "default" : "lg"} className="bg-recipe-blue hover:bg-recipe-blue/90">
                <Link to="/build">Create Advanced Recipe</Link>
              </Button>
              <Button asChild size={isMobile ? "default" : "lg"} variant="outline">
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          </div>
          
          {!isMobile && (
            <div className="w-full md:w-auto md:flex-1 hidden md:block">
              <div className="relative max-w-[600px] mx-auto">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
                <RecipeCarousel />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
