
import React, { useState } from 'react';
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
  const [servings, setServings] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainIngredient.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please provide at least one ingredient or dish name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Construct the form data
      const formData = {
        mainIngredient,
        cuisine: cuisines,
        dietary: dietaryPreferences,
        servings
      };
      
      console.log("Submitting recipe request with data:", formData);
      
      // Pass the form data to the parent component
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting recipe request:", error);
      toast({
        title: "Error",
        description: "Failed to submit recipe request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <IngredientInput 
            value={mainIngredient}
            onChange={setMainIngredient}
            placeholder="Enter a dish name or ingredient (e.g., 'Tacos' or 'Chicken')"
          />
        </div>
        
        <CuisineSelector 
          selected={cuisines}
          onChange={setCuisines}
        />
        
        <DietarySelector 
          selected={dietaryPreferences}
          onChange={setDietaryPreferences}
        />
        
        <ServingsSelector 
          value={servings}
          onChange={setServings}
        />
      </div>
      
      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !mainIngredient.trim()}
          className="w-full sm:w-auto transition-all bg-recipe-green hover:bg-recipe-green/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Recipe...
            </>
          ) : (
            <>
              <ChefHat className="mr-2 h-4 w-4" />
              Create Recipe
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
