
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
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-10 w-3/4 max-w-xl" />
        <Skeleton className="h-10 w-2/3 max-w-lg" />
        <Skeleton className="h-20 w-full max-w-md" />
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
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
