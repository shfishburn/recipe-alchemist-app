
// path: src/components/landing/UserDashboard.tsx
// file: UserDashboard.tsx
// updated: 2025-05-09 14:30 PM

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { QuickRecipeGenerator } from '@/components/quick-recipe/QuickRecipeGenerator';
import { RecipeCarousel } from '@/components/landing/RecipeCarousel';
import { PageContainer } from '@/components/ui/containers';

export function UserDashboard() {
  const { profile } = useAuth();

  return (
    <PageContainer className="py-6 md:py-12">
      <div className="space-y-10">

        {/* Personalized Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome{profile?.username ? `, ${profile.username}` : ''}!
          </h1>
        </div>

        {/* Quick Actions Section */}
        <section>
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
            <QuickRecipeGenerator />
          </div>
        </section>

        {/* Trending Recipes Carousel */}
        <section className="flex justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <RecipeCarousel />
          </div>
        </section>

      </div>
    </PageContainer>
  );
}
