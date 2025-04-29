
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Brain, TestTube, HeartPulse } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero'));
const Features = lazy(() => import('@/components/landing/Features'));
const NutritionPreview = lazy(() => 
  import('@/components/landing/NutritionPreview').then(module => ({
    default: module.NutritionPreview
  }))
);

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
        
        <Suspense fallback={<FeaturesSkeleton />}>
          <Features />
        </Suspense>
        
        <Suspense fallback={
          <div className="py-12 md:py-20 bg-muted/30">
            <div className="container-page">
              <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
              <Skeleton className="h-4 w-1/2 mx-auto mb-8" />
              <Skeleton className="h-72 w-full max-w-4xl mx-auto rounded-xl" />
            </div>
          </div>
        }>
          <NutritionPreview />
        </Suspense>
        
        {/* AI and Science Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-page">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-bold text-2xl md:text-3xl mb-4">
                Where AI Meets Nutritional Science
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover how we combine cutting-edge AI technology with evidence-based nutritional science
                to create recipes that are both delicious and healthy.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-recipe-blue/10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-recipe-blue" />
                </div>
                <h3 className="font-semibold text-lg">AI-Powered Recipes</h3>
                <p className="text-muted-foreground">
                  Our AI understands your preferences and dietary needs to create 
                  personalized recipes just for you.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-recipe-green/10 rounded-full flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-recipe-green" />
                </div>
                <h3 className="font-semibold text-lg">Scientific Approach</h3>
                <p className="text-muted-foreground">
                  Every recipe is backed by nutritional science to ensure optimal 
                  macro and micronutrient balance.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-recipe-orange/10 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-recipe-orange" />
                </div>
                <h3 className="font-semibold text-lg">Health-Focused</h3>
                <p className="text-muted-foreground">
                  We prioritize your health goals while never compromising on taste 
                  and enjoyment.
                </p>
              </div>
            </div>
          </div>
        </section>
        
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
      </main>
    </div>
  );
};

export default Index;
