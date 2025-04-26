
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import BuildHeader from '@/components/recipe-builder/BuildHeader';
import { useRecipeGenerator } from '@/hooks/use-recipe-generator';

const Build = () => {
  const navigate = useNavigate();
  const { generateRecipe, isLoading } = useRecipeGenerator();

  const handleSubmit = async (formData: RecipeFormData) => {
    const recipe = await generateRecipe(formData);
    if (recipe) {
      // Optionally navigate to recipe view or save to database
      console.log('Generated Recipe:', recipe);
    }
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
