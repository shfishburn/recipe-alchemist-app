
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero'));

// Create loading placeholders for better UX
const HeroSkeleton = () => (
  <section className="py-6 md:py-20 lg:py-32">
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

const Index = () => {
  console.log('Rendering Index page');
  // Use our scroll restoration hook
  useScrollRestoration();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 animate-fadeIn pb-6 md:pb-0">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
