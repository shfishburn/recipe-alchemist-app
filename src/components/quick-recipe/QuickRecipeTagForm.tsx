
import React, { useState } from 'react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { ServingsSelector } from './form-components/ServingsSelector';
import { IngredientInput } from './form-components/IngredientInput';
import { SubmitButton } from './form-components/SubmitButton';

interface QuickRecipeTagFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeTagForm({ onSubmit, isLoading }: QuickRecipeTagFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: [],
    dietary: [],
    mainIngredient: '',
    servings: 2, // Default to 2 servings
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainIngredient.trim()) {
      // Use a random ingredient based on selected cuisines or default to chicken
      let randomIngredient = 'chicken';
      if (formData.cuisine.length > 0) {
        // Select a relevant ingredient based on the first selected cuisine
        const primaryCuisine = formData.cuisine[0];
        randomIngredient = primaryCuisine === 'italian' ? 'pasta' :
                           primaryCuisine === 'mexican' ? 'beans' :
                           primaryCuisine === 'asian' ? 'rice' :
                           primaryCuisine === 'mediterranean' ? 'olive oil' : 'chicken';
      }
      onSubmit({...formData, mainIngredient: randomIngredient});
    } else {
      onSubmit(formData);
    }
  };

  const toggleCuisine = (value: string) => {
    setFormData(prev => {
      // If the cuisine is already selected, remove it
      if (prev.cuisine.includes(value)) {
        return { ...prev, cuisine: prev.cuisine.filter(c => c !== value) };
      }
      // Add it to the selection
      else {
        return { ...prev, cuisine: [...prev.cuisine, value] };
      }
    });
  };

  const toggleDietary = (value: string) => {
    setFormData(prev => {
      // If the dietary option is already selected, remove it
      if (prev.dietary.includes(value)) {
        return { ...prev, dietary: prev.dietary.filter(d => d !== value) };
      }
      // Add it to the selection
      else {
        return { ...prev, dietary: [...prev.dietary, value] };
      }
    });
  };

  const setServings = (servings: number) => {
    setFormData(prev => ({
      ...prev,
      servings
    }));
  };

  const setMainIngredient = (value: string) => {
    setFormData(prev => ({
      ...prev,
      mainIngredient: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full mx-auto">
      <div className="space-y-4">
        <IngredientInput 
          value={formData.mainIngredient}
          onChange={setMainIngredient}
        />
        
        <ServingsSelector
          selectedServings={formData.servings}
          onServingsSelect={setServings}
        />

        <CuisineSelector
          selectedCuisines={formData.cuisine}
          onCuisineToggle={toggleCuisine}
        />

        <DietarySelector
          selectedDietary={formData.dietary}
          onDietaryToggle={toggleDietary}
        />
      </div>

      <SubmitButton isLoading={isLoading} />
    </form>
  );
}
