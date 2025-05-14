
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChefHat } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { IngredientInput } from './form-components/IngredientInput';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { SubmitButton } from './form-components/SubmitButton';

export function QuickRecipeGenerator({ onSubmit }: { onSubmit: (formData: any) => void }) {
  const [mainIngredient, setMainIngredient] = useState('');
  const [cuisines, setCuisines] = useState<string[]>(['any']); // Default to 'any'
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
        cuisine: cuisines.length > 0 ? cuisines : ['any'], // Ensure we have an array
        dietary: dietaryPreferences, // Already an array
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
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Ingredient Input */}
      <div className="space-y-3">
        <IngredientInput 
          value={mainIngredient}
          onChange={setMainIngredient}
          error={inputError}
        />
      </div>
      
      {/* Additional Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Servings Selector */}
        <div>
          <ServingsSelector 
            selectedServings={servings} 
            onServingsChange={setServings} 
          />
        </div>
        
        {/* Cuisine Selector */}
        <div>
          <CuisineSelector 
            value={cuisines} 
            onChange={setCuisines} 
          />
        </div>
        
        {/* Dietary Selector */}
        <div>
          <DietarySelector 
            value={dietaryPreferences} 
            onChange={setDietaryPreferences} 
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <SubmitButton 
          isLoading={isSubmitting}
          disabled={!mainIngredient.trim()}
        />
      </div>
    </form>
  );
}
