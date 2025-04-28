
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { NutritionPreview } from '@/components/landing/NutritionPreview';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';

const Index = () => {
  console.log('Rendering Index page');
  // Use our scroll restoration hook
  useScrollRestoration();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <Hero />
        <Features />
        <NutritionPreview />
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container-page">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-bold">Ready to transform your cooking?</h2>
              <p className="text-xl text-muted-foreground">
                Start creating personalized recipes tailored to your preferences today.
              </p>
              <div>
                <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90">
                  <Link to="/build">Create Your First Recipe</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Note: Footer is now a global component in App.tsx, so we removed it from here */}
      </main>
    </div>
  );
};

export default Index;
