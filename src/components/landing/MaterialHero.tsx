
import React, { memo, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { QuickRecipeGenerator } from '../quick-recipe/QuickRecipeGenerator';
import { Brain, ChefHat, ChartPie, Sparkles } from 'lucide-react';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

interface BadgeProps {
  icon?: React.ReactNode;
  label: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const MaterialBadge = ({ icon, label, color }: BadgeProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    purple: 'bg-recipe-primaryPurple bg-opacity-10 text-recipe-primaryPurple border-recipe-primaryPurple border-opacity-20'
  };

  return (
    <span className={`${colorClasses[color]} text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center border shadow-elevation-1`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
};

/**
 * Hero section for the landing page with Material Design styling
 */
const MaterialHero: React.FC = memo(() => {
  const isMobile = useIsMobile();
  const { open: openAuthDrawer } = useAuthDrawer();
  const { handleSubmit } = useQuickRecipeForm();

  // Create a memoized handler to prevent unnecessary re-renders
  const handleFormSubmit = useCallback((formData: any) => {
    console.log('MaterialHero - Form submitted:', formData);
    
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
  }, [handleSubmit]);

  return (
    <section className="py-8 md:py-16 content-visibility-auto hero-section w-full max-w-full overflow-hidden animate-fade-in">
      <div className="space-y-10 max-w-full overflow-hidden">
        {/* App Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" withText={true} />
        </div>
        
        {/* Hero Title & Actions */}
        <div className="text-center px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-recipe-green" />
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-recipe-primaryPurple" />
          </div>
          <h1 className="font-medium tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 material-headline-large">
            <span className="bg-gradient-to-r from-recipe-primaryPurple to-recipe-green bg-clip-text text-transparent">
              AI-Powered Recipe Creation
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto material-body-large">
            Tell us what you have in your kitchen and our <strong>AI chef</strong> will transform your ingredients into
            delicious, <strong>personalized recipes</strong> with tailored <strong>nutrition insights</strong>.
          </p>
          
          {/* Badges displayed in a horizontal row */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <MaterialBadge icon={<Sparkles className="w-4 h-4" />} label="AI-Powered" color="purple" />
            <MaterialBadge icon={<ChartPie className="w-4 h-4" />} label="Personalized Nutrition" color="green" />
            <MaterialBadge label="Ingredient-Based" color="amber" />
          </div>
        </div>

        {/* Recipe Generator Card */}
        <div className="flex justify-center px-4 sm:px-6 w-full">
          <Card className="w-full max-w-3xl rounded-xl p-4 sm:p-5 md:p-6 shadow-elevation-2 transition-shadow hover:shadow-elevation-3 border border-border">
            <QuickRecipeGenerator onSubmit={handleFormSubmit} />
          </Card>
        </div>
      </div>
    </section>
  );
});

MaterialHero.displayName = 'MaterialHero';

export default MaterialHero;
