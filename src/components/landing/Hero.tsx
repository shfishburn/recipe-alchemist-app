
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCarousel } from './RecipeCarousel';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { CookingPot } from 'lucide-react';

// Success metrics to show social proof
const SUCCESS_METRICS = [
  { label: "Recipes Created", value: "10,000+" },
  { label: "Happy Cooks", value: "5,400+" },
  { label: "Avg. Rating", value: "4.8/5" }
];

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-16">
      <div className="container-page">
        {/* Success metrics banner */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            {SUCCESS_METRICS.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-recipe-blue">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Hero Content */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              {!isMobile ? (
                <>
                  Create delicious meals<br/>
                  <span className="text-gradient">in seconds</span>
                </>
              ) : (
                <>Create delicious meals <span className="text-gradient">in seconds</span></>
              )}
            </h1>
            
            {!isMobile && (
              <p className="text-lg text-muted-foreground max-w-prose">
                Tell us what you have in your kitchen, and we'll create a perfect recipe for you.
              </p>
            )}
            
            {/* Quick Recipe Generator - The main hook */}
            <div className="py-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CookingPot className="h-5 w-5 text-recipe-green" />
                  <h2 className="text-xl font-medium">Quick Recipe Generator</h2>
                </div>
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
