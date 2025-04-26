
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 space-y-6 md:pr-12">
            <h1 className="font-bold tracking-tight">
              Transform your meals with
              <span className="text-gradient block"> AI-powered recipes</span>
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
                <Link to="#">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl z-0"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl z-0"></div>
              <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border">
                <div className="aspect-[4/3] bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
                    alt="Healthy colorful meal" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">Mediterranean Quinoa Bowl</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-recipe-green rounded-full mr-2"></span>
                      Vegetarian
                    </span>
                    <span className="mx-2">•</span>
                    <span>25 minutes</span>
                    <span className="mx-2">•</span>
                    <span>420 calories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
