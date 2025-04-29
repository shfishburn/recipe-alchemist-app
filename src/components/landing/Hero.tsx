
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { CookingPot } from 'lucide-react';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-16">
      <div className="container-page">
        {/* Main Hero Content */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              {!isMobile ? (
                <>
                  What's in your kitchen?
                </>
              ) : (
                <>What's in your kitchen?</>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-prose">
              Tell us one ingredient you have, we'll make something delicious.
            </p>
            
            {/* Quick Recipe Generator - The main hook */}
            <div className="py-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md">
                <QuickRecipeGenerator />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:flex-1">
            <div className="relative max-w-[600px] mx-auto">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
              <RecipeCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
