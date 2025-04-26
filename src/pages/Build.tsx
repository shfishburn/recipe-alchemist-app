
import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import { useToast } from '@/hooks/use-toast';

// This would be replaced by actual API call in a real implementation
const mockGenerateRecipe = (data: RecipeFormData): Promise<any> => {
  return new Promise((resolve) => {
    console.log('Generating recipe with data:', data);
    // Simulate API delay
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Recipe generated successfully'
      });
    }, 2000);
  });
};

const Build = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: RecipeFormData) => {
    try {
      setIsLoading(true);
      const result = await mockGenerateRecipe(formData);
      toast({
        title: "Success!",
        description: "Your recipe has been generated successfully.",
      });
      // In a real app, we would redirect to the new recipe page
      console.log('Recipe generated:', result);
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Something went wrong.",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-bold mb-2">Create Your Recipe</h1>
              <p className="text-muted-foreground">
                Customize your preferences and let our AI create a personalized recipe for you.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Build;
