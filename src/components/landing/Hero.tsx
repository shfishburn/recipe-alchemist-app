
// path: src/components/landing/Hero.tsx
// file: Hero.tsx
// updated: 2025-05-09 14:15 PM

import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { NutritionPreview } from './NutritionPreview';
import { RecipeCarousel } from './RecipeCarousel';
import { Brain, ChefHat, ChartPie, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  return (
    <section className="py-6 md:py-12 lg:py-16 content-visibility-auto">
      <div className="space-y-10">
        {/* Hero Title & Actions */}
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ChefHat className="h-8 w-8 text-recipe-green" />
            <Brain className="h-8 w-8 text-recipe-blue" />
          </div>
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
              AI-Powered Recipe Creation
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us what you have in your kitchen and our <strong>AI chef</strong> will transform your ingredients into
            delicious, <strong>personalized recipes</strong> with tailored <strong>nutrition insights</strong>.
          </p>
          
          {/* Badges displayed in a horizontal row */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge icon={<Sparkles className="w-4 h-4 mr-1" />} label="AI-Powered" color="blue" />
            <Badge icon={<ChartPie className="w-4 h-4 mr-1" />} label="Personalized Nutrition" color="green" />
            <Badge label="Ready in 30 mins" color="amber" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button size="lg" onClick={openAuthDrawer} className="bg-recipe-green hover:bg-recipe-green/90">
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/how-it-works">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Recipe Generator Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-shadow hover:shadow-xl border border-gray-100">
            <QuickRecipeGenerator />
          </div>
        </div>

        {/* Nutrition Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <NutritionPreview />
          </div>
        </div>

        {/* Sample Recipes Carousel */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-recipe-green/10 rounded-full backdrop-blur-xl" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 md:w-32 md:h-32 bg-recipe-orange/10 rounded-full backdrop-blur-xl" />
            <div className="relative z-10">
              <RecipeCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
