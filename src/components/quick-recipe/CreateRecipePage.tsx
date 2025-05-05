
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { QuickRecipeForm } from './QuickRecipeForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';

export function CreateRecipePage() {
  const { handleSubmit, isLoading } = useQuickRecipeForm();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 md:py-10 container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
            Create Your Own Recipe
          </h1>
          
          <QuickRecipeForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default CreateRecipePage;
