
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import RecipeForm, { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Build = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData: RecipeFormData) => {
    try {
      setIsLoading(true);
      
      // Call Supabase edge function to generate recipe
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine,
          dietary: formData.dietary,
          flavorTags: formData.flavorTags,
          servings: formData.servings,
          maxCalories: formData.maxCalories,
          maxMinutes: formData.maxMinutes
        })
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success!",
          description: `Recipe "${data.title}" generated successfully.`,
        });
        
        // Optionally, you could navigate to a recipe view or save to database
        console.log('Generated Recipe:', data);
      }
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
