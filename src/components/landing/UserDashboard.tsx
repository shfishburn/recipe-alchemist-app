
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

        {/* Trending Recipes Carousel - Provide more horizontal space */}
        <section className="w-full -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-6 bg-gray-50">
          <RecipeCarousel />
        </section>

      </div>
    </PageContainer>
  );
}
