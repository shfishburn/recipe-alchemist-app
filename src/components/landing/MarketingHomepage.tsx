
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { NutritionPreview } from './NutritionPreview';

// Lazy load non-critical components
const Hero = lazy(() => import('@/components/landing/Hero'));
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

const NutritionSkeleton = () => (
  <section className="py-12">
    <div className="container-page">
      <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-8" />
      <Skeleton className="h-64 w-full rounded-lg max-w-4xl mx-auto" />
    </div>
  </section>
);

export function MarketingHomepage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<FeaturesSkeleton />}>
        <Features />
      </Suspense>
      <Suspense fallback={<NutritionSkeleton />}>
        <NutritionPreview />
      </Suspense>
    </>
  );
}

// Add default export to support lazy loading
export default MarketingHomepage;
