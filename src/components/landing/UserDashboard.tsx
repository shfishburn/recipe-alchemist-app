
// path: src/components/landing/UserDashboard.tsx
// file: UserDashboard.tsx

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { QuickRecipeGenerator } from '@/components/quick-recipe/QuickRecipeGenerator';
import { RecipeCarousel } from '@/components/landing/RecipeCarousel';
import { PageContainer } from '@/components/ui/containers';

export function UserDashboard() {
  const { profile } = useAuth();

  return (
    <PageContainer className="py-4 md:py-12">
      <div className="space-y-8 md:space-y-10">

        {/* Personalized Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome{profile?.username ? `, ${profile.username}` : ''}!
          </h1>
        </div>

        {/* Quick Actions Section */}
        <section>
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
            <QuickRecipeGenerator />
          </div>
        </section>

        {/* Trending Recipes Carousel - Full width on mobile */}
        <section className="w-full py-2 sm:py-4 -mx-4 sm:mx-0 px-0 sm:px-4">
          <RecipeCarousel />
        </section>

      </div>
    </PageContainer>
  );
}
