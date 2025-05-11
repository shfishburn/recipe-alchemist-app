
// path: src/components/landing/Hero.tsx
// file: Hero.tsx
// updated: 2025-05-10

import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { NutritionPreview } from './NutritionPreview';
import { RecipeCarousel } from './RecipeCarousel';
import { Brain, ChefHat, ChartPie, Sparkles } from 'lucide-react';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { toast } from '@/hooks/use-toast';

interface BadgeProps {
  icon?: React.ReactNode;
  label: string;
  color: 'blue' | 'green' | 'amber';
}

const Badge: React.FC<BadgeProps> = ({ icon, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800'
  };

  return (
    <span className={`${colorClasses[color]} text-xs font-medium px-2.5 py-1 rounded flex items-center`}>
      {icon}
      {label}
    </span>
  );
};

/**
 * Hero section for the landing page. Displays title, call-to-action,
 * recipe generator, nutrition preview, and sample carousel.
 */
const Hero: React.FC = memo(() => {
  const isMobile = useIsMobile();
  const { open: openAuthDrawer } = useAuthDrawer();
  const { handleSubmit } = useQuickRecipeForm();

  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    
    // Validate the form data before submitting
    if (!formData.ingredients || !formData.ingredients.trim()) {
      toast({
        title: "Missing ingredient",
        description: "Please enter at least one main ingredient",
        variant: "destructive",
      });
      return;
    }
    
    // Format the data expected by the recipe generation function
    const recipeFormData = {
      mainIngredient: formData.ingredients.trim(),
      cuisine: Array.isArray(formData.cuisine) ? formData.cuisine : [formData.cuisine].filter(Boolean),
      dietary: Array.isArray(formData.dietary) ? formData.dietary : formData.dietary ? [formData.dietary] : [],
      servings: Number(formData.servings) || 4
    };
    
    // Call the recipe generation function
    handleSubmit(recipeFormData);
  };

  return (
    <section className="py-6 md:py-12 lg:py-16 content-visibility-auto hero-section w-full max-w-full overflow-hidden">
      <div className="space-y-10 max-w-full overflow-hidden">
        {/* Hero Title & Actions */}
        <div className="text-center animate-fade-in px-2 sm:px-4 w-full">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-recipe-green" />
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-recipe-blue" />
          </div>
          <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
              AI-Powered Recipe Creation
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us what you have in your kitchen and our <strong>AI chef</strong> will transform your ingredients into
            delicious, <strong>personalized recipes</strong> with tailored <strong>nutrition insights</strong>.
          </p>
          
          {/* Badges displayed in a horizontal row */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge icon={<Sparkles className="w-4 h-4 mr-1" />} label="AI-Powered" color="blue" />
            <Badge icon={<ChartPie className="w-4 h-4 mr-1" />} label="Personalized Nutrition" color="green" />
            <Badge label="Ingredient-Based" color="amber" />
          </div>
        </div>

        {/* Recipe Generator Card */}
        <div className="flex justify-center px-2 sm:px-4 w-full">
          <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 shadow-lg transition-shadow hover:shadow-xl border border-gray-100">
            <QuickRecipeGenerator onSubmit={handleFormSubmit} />
          </div>
        </div>

        {/* Nutrition Preview */}
        <div className="flex justify-center w-full overflow-hidden">
          <div className="w-full max-w-3xl">
            <NutritionPreview />
          </div>
        </div>

        {/* Sample Recipes Carousel */}
        <div className="flex justify-center w-full overflow-hidden">
          <div className="w-full max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl" />
            <div className="relative z-10 px-2 sm:px-4">
              <RecipeCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
