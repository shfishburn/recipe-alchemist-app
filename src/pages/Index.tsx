
import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';
import '@/styles/touch-optimizations.css';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero').then(module => ({ default: module.default })));
const Features = lazy(() => import('@/components/landing/Features'));

// Create loading placeholders for better UX
const HeroSkeleton = () => (
  <section className="py-6 md:py-12 lg:py-20">
    <div className="container-page">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
        <div className="flex-1 space-y-3 md:space-y-6">
          <Skeleton className="h-8 w-3/4 md:h-10" />
          <Skeleton className="h-8 w-1/2 md:h-10" />
          <Skeleton className="h-16 w-full md:h-20" />
          <div className="flex gap-2 md:gap-4">
            <Skeleton className="h-8 w-24 md:h-10 md:w-32" />
            <Skeleton className="h-8 w-24 md:h-10 md:w-32" />
          </div>
        </div>
        <div className="w-full md:w-auto md:flex-1">
          <Skeleton className="w-full aspect-video rounded-lg md:rounded-xl" />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSkeleton = () => (
  <section className="py-12">
    <div className="container-page">
      <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  console.log('Rendering Index page');
  // Use our scroll restoration hook
  useScrollRestoration();
  
  // Add touch detection
  const [isTouch, setIsTouch] = useState(false);
  
  // Detect touch capability
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0;
      
    setIsTouch(isTouchDevice);
    
    // Add touch class to body for global CSS targeting
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    }
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${isTouch ? 'touch-optimized' : ''}`}>
      <Navbar />
      <main className="flex-1 animate-fadeIn pb-8 md:pb-12 touch-scroll">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<FeaturesSkeleton />}>
          <Features />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
