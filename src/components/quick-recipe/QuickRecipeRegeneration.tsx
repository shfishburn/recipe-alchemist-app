
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/hooks/use-quick-recipe';

interface QuickRecipeRegenerationProps {
  formData: QuickRecipeFormData | null;
  isLoading: boolean;
}

export function QuickRecipeRegeneration({ formData, isLoading }: QuickRecipeRegenerationProps) {
  const { navigate, reset, setLoading, setRecipe, setError, isRecipeValid } = useQuickRecipeStore();
  
  const handleRegenerate = async () => {
    if (formData && !isLoading) {
      try {
        console.log("Regenerating recipe with form data:", formData);
        
        // Reset and set loading state
        reset();
        setLoading(true);
        
        // Generate a new recipe with the same form data
        const generatedRecipe = await generateQuickRecipe(formData);
        
        // Validate the recipe structure before setting it
        if (!isRecipeValid(generatedRecipe)) {
          throw new Error("The recipe format returned from the API was invalid. Please try again.");
        }
        
        console.log("Recipe regeneration successful:", generatedRecipe);
        setRecipe(generatedRecipe);
      } catch (error: any) {
        console.error("Error regenerating recipe:", error);
        setError(error.message || "Failed to regenerate recipe. Please try again.");
      }
    }
  };
  
  const handleTryDifferent = () => {
    // Go back to the home page to start fresh
    navigate('/');
  };

  return (
    <div className="mt-6 flex justify-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleTryDifferent}
        className="text-muted-foreground hover:text-foreground"
      >
        Try a different recipe
      </Button>
      
      {formData && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRegenerate}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Regenerate recipe
        </Button>
      )}
    </div>
  );
}
