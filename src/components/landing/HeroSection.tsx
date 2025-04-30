
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Intelligent Nutrition for Every Recipe
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Create delicious recipes with precise nutrition analysis powered by USDA data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link to="/recipes">Browse Recipes</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/recipes/create">Create Recipe</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
