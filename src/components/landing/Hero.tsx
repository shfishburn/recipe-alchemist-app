
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCarousel } from './RecipeCarousel';

const Hero = () => {
  return (
    <section className="py-12 md:py-20 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
            <h1 className="font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              Transform your meals with
              <span className="text-gradient block mt-2">AI-powered recipes</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-prose">
              Create healthy, personalized recipes tailored to your ingredients, 
              dietary preferences, and nutritional goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90">
                <Link to="/build">Create Recipe</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
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
};

export default Hero;
