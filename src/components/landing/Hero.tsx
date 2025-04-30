
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Use React.memo to prevent unnecessary re-renders
const Hero = React.memo(() => {
  return (
    <section className="w-full py-6 md:py-10">
      <div className="container-page max-w-full px-4 md:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Main title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Transform your meals with<br />
            <span className="text-recipe-green">AI-powered recipes</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 md:mb-12">
            Create healthy, personalized recipes tailored to your ingredients, 
            dietary preferences, and nutritional goals.
          </p>
          
          {/* Call to action buttons */}
          <div className="w-full max-w-md space-y-4">
            <Button 
              asChild
              className="w-full bg-recipe-green hover:bg-recipe-green/90 text-white text-lg py-6"
              size="lg"
            >
              <Link to="/build">Create Recipe</Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="w-full text-lg py-6 border-2"
              size="lg"
            >
              <Link to="/recipes">Browse Recipes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
