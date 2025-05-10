
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { QuickRecipeGenerator } from '@/components/quick-recipe/QuickRecipeGenerator';
import { RecipeCarousel } from '@/components/landing/RecipeCarousel';
import { PageContainer } from '@/components/ui/containers';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';

export function UserDashboard() {
  const { profile } = useAuth();
  const { handleSubmit } = useQuickRecipeForm();

  const handleFormSubmission = (formData: any) => {
    // Handle form submission
    console.log('Dashboard form submitted:', formData);
    
    // Convert the formData to the expected format for the quick recipe form
    const quickRecipeFormData = {
      mainIngredient: formData.ingredients,
      cuisine: formData.cuisine,
      dietary: formData.dietary,
      servings: formData.servings
    };
    
    // Call the handleSubmit function from useQuickRecipeForm
    handleSubmit(quickRecipeFormData);
  };

  return (
    <PageContainer className="py-4 md:py-12">
      <div className="space-y-6 md:space-y-10">

        {/* Personalized Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome{profile?.username ? `, ${profile.username}` : ''}!
          </h1>
        </div>

        {/* Quick Actions Section */}
        <section>
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
            <QuickRecipeGenerator onSubmit={handleFormSubmission} />
          </div>
        </section>

        {/* Trending Recipes Carousel - Full width on mobile */}
        <section className="w-full py-2 sm:py-6 -mx-4 sm:mx-0 px-0 sm:px-4">
          <RecipeCarousel />
        </section>

      </div>
    </PageContainer>
  );
}
