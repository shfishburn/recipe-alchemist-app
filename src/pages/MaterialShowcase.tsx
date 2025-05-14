
import React from 'react';
import { MaterialRecipeGrid } from '@/components/recipe-card/MaterialRecipeGrid';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Recipe } from '@/types/recipe';
import '@/styles/material-animations.css';

// Sample recipe data for demonstration with complete Nutrition objects
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Mushroom Pasta',
    tagline: 'A rich and flavorful pasta dish with earthy mushrooms',
    image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80',
    prep_time_min: 15,
    cook_time_min: 20,
    cuisine: 'Italian',
    nutrition: { 
      calories: 450,
      protein: 12,
      carbs: 65,
      fat: 15,
      fiber: 3,
      sugar: 2,
      sodium: 620
    },
    ingredients: [],
    instructions: [],
    science_notes: [],
  },
  {
    id: '2',
    title: 'Spicy Thai Curry',
    tagline: 'Aromatic and spicy curry with coconut milk',
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=2671&q=80',
    prep_time_min: 20,
    cook_time_min: 30,
    cuisine: 'Thai',
    nutrition: { 
      calories: 380,
      protein: 18,
      carbs: 42,
      fat: 20,
      fiber: 4,
      sugar: 8,
      sodium: 850
    },
    ingredients: [],
    instructions: [],
    science_notes: [],
    flavor_tags: ['spicy', 'aromatic', 'AI generated']
  },
  {
    id: '3',
    title: 'Classic Margherita Pizza',
    tagline: 'Simple yet delicious with fresh basil and mozzarella',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=2669&q=80',
    prep_time_min: 30,
    cook_time_min: 15,
    cuisine: 'Italian',
    nutrition: { 
      calories: 320,
      protein: 14,
      carbs: 40,
      fat: 12,
      fiber: 2,
      sugar: 4,
      sodium: 720
    },
    ingredients: [],
    instructions: [],
    science_notes: [],
  },
  {
    id: '4',
    title: 'Beef Stir Fry',
    tagline: 'Quick and delicious weeknight dinner option',
    image_url: 'https://images.unsplash.com/photo-1605474503660-0ac5c1d50d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80',
    prep_time_min: 10,
    cook_time_min: 15,
    cuisine: 'Asian Fusion',
    nutrition: { 
      calories: 380,
      protein: 25,
      carbs: 28,
      fat: 18,
      fiber: 4,
      sugar: 6,
      sodium: 800
    },
    ingredients: [],
    instructions: [],
    science_notes: [],
    flavor_tags: ['savory', 'quick', 'AI generated']
  },
];

export default function MaterialShowcase() {
  useScrollRestoration();
  
  return (
    <PageContainer 
      className="material-fade-in"
      variant="default"
      withNavbar={true}
    >
      <header className="mb-8 md:mb-12">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/recipe-alchemy-logo.png" 
              alt="Recipe Alchemy Logo" 
              className="h-14 md:h-16 material-scale-in"
              style={{ animationDelay: '100ms' }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-medium mb-4 material-title-large material-slide-up">
            Material Design Showcase
          </h1>
          <p className="text-muted-foreground mb-6 material-body-large material-slide-up" style={{ animationDelay: '100ms' }}>
            Explore our recipes with a modern Material Design aesthetic
          </p>
          <div className="flex flex-wrap gap-4 justify-center material-slide-up" style={{ animationDelay: '200ms' }}>
            <Button variant="filled" size="lg" className="material-elevation-transition">
              Explore Recipes
            </Button>
            <Button variant="tonal" size="lg" className="material-elevation-transition">
              Learn More
            </Button>
          </div>
        </div>
      </header>

      <section className="mb-12 px-4">
        <h2 className="material-headline-medium mb-6 text-center">Featured Recipes</h2>
        <MaterialRecipeGrid recipes={sampleRecipes} />
      </section>

      <section className="mb-12 py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="material-headline-medium mb-6 text-center">Material Design Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Button Variants */}
            <div className="bg-card p-6 rounded-lg shadow-elevation-1">
              <h3 className="material-title-large mb-4">Button Variants</h3>
              <div className="flex flex-col gap-4">
                <Button variant="filled" className="w-full">Filled Button</Button>
                <Button variant="tonal" className="w-full">Tonal Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="text" className="w-full">Text Button</Button>
                <Button variant="elevated" className="w-full">Elevated Button</Button>
              </div>
            </div>
            
            {/* Typography */}
            <div className="bg-card p-6 rounded-lg shadow-elevation-1">
              <h3 className="material-title-large mb-4">Typography</h3>
              <div className="space-y-4">
                <p className="material-headline-large">Headline Large</p>
                <p className="material-headline-medium">Headline Medium</p>
                <p className="material-headline-small">Headline Small</p>
                <p className="material-title-large">Title Large</p>
                <p className="material-title-medium">Title Medium</p>
                <p className="material-body-large">Body Large text with longer content example that might wrap to multiple lines on smaller screens.</p>
                <p className="material-body-medium">Body Medium text example.</p>
              </div>
            </div>
            
            {/* Elevation */}
            <div className="bg-card p-6 rounded-lg shadow-elevation-1">
              <h3 className="material-title-large mb-4">Elevation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg shadow-elevation-1 text-center">
                  Elevation 1
                </div>
                <div className="bg-background p-4 rounded-lg shadow-elevation-2 text-center">
                  Elevation 2
                </div>
                <div className="bg-background p-4 rounded-lg shadow-elevation-3 text-center">
                  Elevation 3
                </div>
                <div className="bg-background p-4 rounded-lg shadow-elevation-4 text-center">
                  Elevation 4
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
