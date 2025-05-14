
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { NutritionPreview } from './NutritionPreview';

// Lazy load non-critical components
const MaterialHero = lazy(() => import('@/components/landing/MaterialHero'));
const Features = lazy(() => import('@/components/landing/Features'));

// Create loading placeholders for better UX
const HeroSkeleton = () => (
  <section className="py-8 md:py-16">
    <div className="container-page">
      <div className="flex justify-center mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
        <div className="flex-1 space-y-4 md:space-y-6 text-center">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full md:w-3/4 mx-auto" />
          <div className="flex flex-wrap justify-center gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />
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
          <Skeleton key={i} className="h-48 rounded-lg shadow-elevation-1" />
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
      <Skeleton className="h-64 w-full rounded-lg max-w-4xl mx-auto shadow-elevation-1" />
    </div>
  </section>
);

export function MaterialHomepage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <MaterialHero />
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
export default MaterialHomepage;
