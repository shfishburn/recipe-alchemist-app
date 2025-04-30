
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero'));

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
      </main>
    </div>
  );
};

export default Index;
