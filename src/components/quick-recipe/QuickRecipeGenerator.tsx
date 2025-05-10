
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ChefHat } from 'lucide-react';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { toast } from '@/hooks/use-toast';
import { QuickRecipeFormData } from '@/types/quick-recipe';
import { IngredientInput } from './form-components/IngredientInput';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';

export function QuickRecipeGenerator({ onSubmit }: { onSubmit: (formData: any) => void }) {
  const [mainIngredient, setMainIngredient] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [dietary, setDietary] = useState('');
  const [servings, setServings] = useState(4); // Updated default value from 2 to 4
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        cuisine: cuisine,
        dietary: dietary,
        servings: servings
      };

      // Submit the form data
      onSubmit(formData);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to generate recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
            value={cuisine} 
            onChange={setCuisine} 
          />
        </div>
        
        {/* Dietary Selector */}
        <div>
          <DietarySelector 
            value={dietary} 
            onChange={setDietary} 
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <Button 
          type="submit" 
          size="lg"
          disabled={isSubmitting || !mainIngredient.trim()}
          className="w-full md:w-auto bg-recipe-green hover:bg-recipe-green/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ChefHat className="mr-2 h-4 w-4" />
              Create My Recipe
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
