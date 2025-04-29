
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/ui/footer';

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
