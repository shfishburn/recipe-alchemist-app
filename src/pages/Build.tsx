
import React from 'react';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import BuildHeader from '@/components/recipe-builder/BuildHeader';
import { useRecipeGenerator } from '@/hooks/use-recipe-generator';
import { useToast } from '@/hooks/use-toast';

const Build = () => {
  const { generateRecipe, isLoading } = useRecipeGenerator();
  const { toast } = useToast();

  const handleSubmit = async (formData: RecipeFormData) => {
    // Validate minimum requirements
    if (!formData.cuisine) {
      toast({
        title: "Missing information",
        description: "Please select a cuisine type.",
        variant: "destructive",
      });
      return;
    }

    // Generate the recipe (saving and navigation are handled in the hook)
    await generateRecipe(formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <BuildHeader />
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
