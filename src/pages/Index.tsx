
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero'));
const Features = lazy(() => import('@/components/landing/Features'));

// Create loading placeholders for better UX
const HeroSkeleton = () => (
  <section className="py-12 md:py-20 lg:py-32">
    <div className="container-page">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="w-full md:w-auto md:flex-1">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSkeleton = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-900">
    <div className="container-page">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-16 w-full mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </section>
);

// Example recipes to inspire users
const EXAMPLE_RECIPES = [
  {
    title: "15-Minute Pasta Primavera",
    description: "Quick weeknight dinner with fresh vegetables",
    image: "/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png"
  },
  {
    title: "Protein-Packed Breakfast Bowl",
    description: "Start your day with energy and nutrients",
    image: "/lovable-uploads/dd187ce5-d58f-409c-8336-492a718094d9.png"
  },
  {
    title: "Mediterranean Quinoa Salad",
    description: "Healthy lunch option with rich flavors",
    image: "/lovable-uploads/f61a783a-6a28-4230-ab6e-a3ade73c13b0.png"
  }
];

// User testimonials for social proof
const TESTIMONIALS = [
  {
    name: "Sarah K.",
    text: "This app has completely changed how I cook! I used to struggle finding recipes for my dietary needs, but now I get perfect suggestions every time.",
    rating: 5
  },
  {
    name: "Michael T.",
    text: "As someone who's always short on time, the quick recipe feature is a lifesaver. I just type what I have and get amazing recipes in seconds.",
    rating: 5
  },
  {
    name: "Jamie L.",
    text: "The personalized nutrition tracking has helped me stay on track with my fitness goals while still enjoying delicious food.",
    rating: 4
  }
];

const Index = () => {
  console.log('Rendering Index page');
  // Use our scroll restoration hook
  useScrollRestoration();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
        
        {/* Example Recipes Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-page">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Recipes</h2>
              <p className="text-muted-foreground">Get inspired with these community favorites</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EXAMPLE_RECIPES.map((recipe, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1">{recipe.title}</h3>
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container-page">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Users Say</h2>
              <p className="text-muted-foreground">Join thousands of happy home cooks</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {TESTIMONIALS.map((testimonial, index) => (
                <Card key={index} className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-recipe-orange fill-recipe-orange" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <p className="italic text-sm mb-4">"{testimonial.text}"</p>
                    <p className="text-sm font-medium">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <Suspense fallback={<FeaturesSkeleton />}>
          <Features />
        </Suspense>
        
        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-recipe-blue/5">
          <div className="container-page">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to transform your cooking?</h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Start creating personalized recipes tailored to your preferences today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90 w-full sm:w-auto">
                  <Link to="/build">Create Your First Recipe</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
