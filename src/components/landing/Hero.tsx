
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecipeCarousel } from './RecipeCarousel';

const Hero = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 space-y-6 md:pr-12">
            <h1 className="font-bold tracking-tight">
              Transform your meals with
              <span className="text-gradient block">AI-powered recipes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Create healthy, personalized recipes tailored to your ingredients, 
              dietary preferences, and nutritional goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90">
                <Link to="/build">Create Recipe</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-12 md:mt-0 w-full md:w-auto">
            <div className="relative">
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
