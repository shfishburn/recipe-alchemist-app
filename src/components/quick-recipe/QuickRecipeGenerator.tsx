
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChefHat } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { IngredientInput } from './form-components/IngredientInput';
import { SimplifiedServingsSelector } from './form-components/SimplifiedServingsSelector';
import { SimplifiedCuisineSelector } from './form-components/SimplifiedCuisineSelector';
import { SimplifiedDietarySelector } from './form-components/SimplifiedDietarySelector';
import { SubmitButton } from './form-components/SubmitButton';
import { cn } from '@/lib/utils';

export function QuickRecipeGenerator({ onSubmit }: { onSubmit: (formData: any) => void }) {
  const [mainIngredient, setMainIngredient] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [servings, setServings] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');

  // Debug effect to ensure the component is mounting properly
  useEffect(() => {
    console.log('QuickRecipeGenerator mounted');
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', { mainIngredient, cuisines, dietaryPreferences, servings });

    if (!mainIngredient.trim()) {
      setInputError('Please enter an ingredient');
      toast({
        title: 'Please enter an ingredient',
        description: 'Tell us what you have in your kitchen',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setInputError('');
      
      // Create form data with all fields
      const formData = {
        ingredients: mainIngredient.trim(),
        cuisine: cuisines, // Already ensured to be an array
        dietary: dietaryPreferences, // Already ensured to be an array
        servings: servings
      };

      console.log('QuickRecipeGenerator - Submitting form data:', formData);
      
      // Submit the form data
      onSubmit(formData);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to generate recipe. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false); // Reset submit state on error
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Section Title - Material Design typography */}
      <h3 className="text-xl font-medium text-foreground">Create a Recipe</h3>
      
      {/* Ingredient Input with proper Material spacing */}
      <div className="space-y-4">
        <IngredientInput 
          value={mainIngredient}
          onChange={setMainIngredient}
          error={inputError}
        />
      </div>
      
      {/* Options Container - Material Card styling */}
      <div className={cn(
        "rounded-lg bg-background/80 backdrop-blur-sm p-4",
        "border border-border/50 shadow-elevation-1"
      )}>
        <h4 className="text-sm font-medium text-foreground mb-4">Customize Your Recipe</h4>
        
        {/* Material Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Simplified Servings Selector */}
          <div>
            <SimplifiedServingsSelector 
              value={servings} 
              onChange={setServings} 
            />
          </div>
          
          {/* Simplified Cuisine Selector */}
          <div>
            <SimplifiedCuisineSelector 
              selected={cuisines} 
              onChange={setCuisines} 
            />
          </div>
          
          {/* Simplified Dietary Selector */}
          <div>
            <SimplifiedDietarySelector 
              selected={dietaryPreferences} 
              onChange={setDietaryPreferences} 
            />
          </div>
        </div>
      </div>
      
      {/* Submit Button with proper spacing */}
      <div className="pt-2">
        <SubmitButton 
          isLoading={isSubmitting}
          disabled={!mainIngredient.trim()}
        />
      </div>
    </form>
  );
}
