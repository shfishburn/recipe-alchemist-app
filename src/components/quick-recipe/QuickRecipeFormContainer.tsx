
// path: src/components/quick-recipe/QuickRecipeFormContainer.tsx
// file: QuickRecipeFormContainer.tsx
// updated: 2025-05-10 14:02 PM

import React, { useState } from 'react';
import QuickRecipeTagForm from './QuickRecipeTagForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Cake, ChefHat, Egg } from 'lucide-react';
import { QuickRecipeFormData as TagFormData } from './QuickRecipeTagForm';
import { toast } from '@/hooks/use-toast';
// Remove FullScreenLoading import - we don't need it here as it's handled in the parent component
// import { FullScreenLoading } from './FullScreenLoading';

export function QuickRecipeFormContainer() {
  const { handleSubmit } = useQuickRecipeForm();
  const { isLoading } = useQuickRecipeStore();

  // Add state for all the required form fields
  const [ingredients, setIngredients] = useState('');
  const [selectedServings, setSelectedServings] = useState(4);
  const [selectedCuisine, setSelectedCuisine] = useState('any');
  const [selectedDietary, setSelectedDietary] = useState('any');

  // Handlers for each input type
  const handleIngredientsChange = (value: string) => {
    setIngredients(value);
  };
  const handleServingsChange = (servings: number) => {
    setSelectedServings(servings);
  };
  const handleCuisineChange = (cuisine: string) => {
    console.log('Cuisine selected:', cuisine);
    setSelectedCuisine(cuisine);
  };
  const handleDietaryChange = (dietary: string) => {
    console.log('Dietary selected:', dietary);
    setSelectedDietary(dietary);
  };

  // Handle user cancellation
  const handleCancel = () => {
    toast({
      title: 'Recipe generation cancelled',
      description: "You can try again with different ingredients.",
    });
    if (window.location.pathname === '/') {
      window.location.reload();
    }
  };

  // Create an adapter function to handle form submission
  const handleFormSubmit = (formData: TagFormData) => {
    console.log('Handling form submission:', formData);
    if (!formData.ingredients || !formData.ingredients.trim()) {
      toast({
        title: 'Missing ingredient',
        description: 'Please enter a main ingredient for your recipe.',
        variant: 'destructive',
      });
      return;
    }
    console.log('Original form values:', {
      ingredients: formData.ingredients,
      servings: formData.servings,
      cuisine: formData.cuisine,
      dietary: formData.dietary,
    });
    const adaptedFormData = {
      mainIngredient: formData.ingredients.trim(),
      cuisine: formData.cuisine === 'any' ? 'any' : formData.cuisine,
      dietary: formData.dietary === 'any' ? '' : formData.dietary,
      servings: Number(formData.servings) || 2,
    };
    console.log('Adapted form data for API:', adaptedFormData);
    handleSubmit(adaptedFormData);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Remove duplicate FullScreenLoading component - it's now handled in the parent QuickRecipePage */}
      <div className="absolute -top-8 left-0 w-20 h-20 md:w-32 md:h-32 bg-recipe-green/20 rounded-full blur-md z-0 animate-pulse" />
      <div className="absolute -bottom-10 right-0 w-24 h-24 md:w-40 md:h-40 bg-recipe-orange/20 rounded-full blur-md z-0 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-4 w-16 h-16 md:w-24 md:h-24 bg-recipe-blue/15 rounded-full blur-md z-0 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <Card className="relative z-10 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg p-5 md:p-6 rounded-xl max-w-xl mx-auto">
        <div className="text-center mb-5 md:mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="flex -space-x-2">
              <div className="bg-recipe-green/20 p-2 rounded-full">
                <ChefHat size={24} className="text-recipe-green" />
              </div>
              <div className="bg-recipe-blue/20 p-2 rounded-full">
                <Egg size={24} className="text-recipe-blue" />
              </div>
              <div className="bg-recipe-orange/20 p-2 rounded-full">
                <Cake size={24} className="text-recipe-orange" />
              </div>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
            Create Your Perfect Recipe
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Tell us what you want to make or what ingredients you have. Our AI Cooking Coach will do the rest!
          </p>
        </div>

        <QuickRecipeTagForm
          onIngredientsChange={handleIngredientsChange}
          onServingsSelect={handleServingsChange}
          onCuisineSelect={handleCuisineChange}
          onDietarySelect={handleDietaryChange}
          ingredients={ingredients}
          selectedServings={selectedServings}
          selectedCuisine={selectedCuisine}
          selectedDietary={selectedDietary}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
