
// path: src/components/quick-recipe/QuickRecipeFormContainer.tsx
// file: QuickRecipeFormContainer.tsx

import React from 'react';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { Card } from '@/components/ui/card';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { ChefHat } from 'lucide-react';
import { QuickRecipeGenerator } from './QuickRecipeGenerator';
import { toast } from '@/hooks/use-toast';
import { useNetworkStatus } from '@/hooks/use-network-status';

export function QuickRecipeFormContainer() {
  const { handleSubmit } = useQuickRecipeForm();
  const { isLoading } = useQuickRecipeStore();
  const { isOnline } = useNetworkStatus();

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
  const handleFormSubmit = (formData: any) => {
    console.log('QuickRecipeFormContainer - Handling form submission:', formData);
    
    // Check network status before submitting
    if (!isOnline) {
      toast({
        title: 'No internet connection',
        description: 'Please check your network connection and try again.',
        variant: 'destructive',
      });
      return;
    }
    
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
      // Handle both array and string formats for cuisine and dietary
      cuisine: Array.isArray(formData.cuisine) ? formData.cuisine : [formData.cuisine].filter(Boolean),
      dietary: Array.isArray(formData.dietary) ? formData.dietary : formData.dietary ? [formData.dietary] : [],
      servings: Number(formData.servings) || 4, // Default to 4 instead of 2
    };
    
    console.log('Adapted form data:', adaptedFormData);
    handleSubmit(adaptedFormData);
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 shadow-md p-4 sm:p-6 transition-all">
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-recipe-green/10 text-recipe-green dark:bg-recipe-green/20">
          <ChefHat className="h-5 w-5 mr-2" />
          <span className="font-medium">Quick Recipe Creator</span>
        </div>
      </div>
      
      <QuickRecipeGenerator onSubmit={handleFormSubmit} />
      
      {/* Network status warning */}
      {!isOnline && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 text-sm text-center">
          You appear to be offline. Please check your internet connection.
        </div>
      )}
    </Card>
  );
}
