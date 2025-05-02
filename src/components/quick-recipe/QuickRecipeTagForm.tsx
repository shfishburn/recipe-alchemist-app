
import React, { useState } from 'react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { ServingsSelector } from './form-components/ServingsSelector';
import { IngredientInput } from './form-components/IngredientInput';
import { SubmitButton } from './form-components/SubmitButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface QuickRecipeTagFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeTagForm({ onSubmit, isLoading }: QuickRecipeTagFormProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: [],
    dietary: [],
    mainIngredient: '',
    servings: 2, // Default to 2 servings
  });
  
  // Add basic form validation
  const [touchedFields, setTouchedFields] = useState<{
    mainIngredient: boolean;
  }>({
    mainIngredient: false,
  });

  // Check if form is valid
  const isValid = formData.mainIngredient.trim().length > 0 || 
                (formData.cuisine.length > 0 && formData.servings > 0);
  
  // Validation errors
  const errors = {
    mainIngredient: touchedFields.mainIngredient && !formData.mainIngredient.trim() && formData.cuisine.length === 0
      ? 'Please enter an ingredient or select a cuisine'
      : ''
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) {
      console.log("Form submission blocked - already loading");
      return;
    }
    
    console.log("Form submission started with data:", formData);
    
    // Mark fields as touched
    setTouchedFields({
      mainIngredient: true,
    });
    
    // Stop if form is invalid
    if (!isValid) {
      toast({
        title: "Please fill in required fields",
        description: "Tell us what ingredients you'd like to cook with",
        variant: "destructive",
      });
      return;
    }
    
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
      
      console.log("Using random ingredient:", randomIngredient);
      onSubmit({...formData, mainIngredient: randomIngredient});
    } else {
      console.log("Submitting form with user-provided ingredient:", formData.mainIngredient);
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
    
    // Mark as touched when user enters something
    if (!touchedFields.mainIngredient) {
      setTouchedFields(prev => ({
        ...prev,
        mainIngredient: true
      }));
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "w-full mx-auto",
        isMobile ? "space-y-6" : "space-y-5"
      )}
    >
      <div className={cn(
        isMobile ? "space-y-5" : "space-y-4"
      )}>
        <IngredientInput 
          value={formData.mainIngredient}
          onChange={setMainIngredient}
          error={errors.mainIngredient}
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

      <SubmitButton 
        isLoading={isLoading} 
        disabled={!isValid || isLoading}
      />
    </form>
  );
}
