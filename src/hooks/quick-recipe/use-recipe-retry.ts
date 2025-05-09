
import { useState, useCallback } from 'react';
import { generateQuickRecipe } from '@/hooks/use-quick-recipe';
import { toast } from '@/hooks/use-toast';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeFormData } from '@/types/quick-recipe';

export function useRecipeRetry() {
  const [isRetrying, setIsRetrying] = useState(false);
  const { setError, setLoading } = useQuickRecipeStore();

  const handleRetry = useCallback(async (
    formData: QuickRecipeFormData | null, 
    createAbortController: () => AbortController
  ) => {
    if (!formData) {
      console.error("Can't retry without formData");
      toast({
        title: "Cannot retry",
        description: "Missing recipe data. Please try starting a new recipe.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRetrying(true);
      console.log("Retrying recipe generation with formData:", formData);
      
      // Clear any existing errors
      setError(null);
      
      // Start the recipe generation with proper loading state
      setLoading(true);
      
      toast({
        title: "Retrying recipe generation",
        description: "We're attempting to generate your recipe again...",
      });
      
      // Create a new abort controller for this request
      const controller = createAbortController();
      
      // Add a timeout to prevent UI lockup
      setTimeout(async () => {
        try {
          // Start the recipe generation immediately with abort signal and reduced timeout
          await generateQuickRecipe(formData, { signal: controller.signal, timeout: 40000 });
        } catch (err: any) {
          // Don't show error if aborted
          if (err.name === 'AbortError') {
            console.log("Recipe generation retry aborted");
            return;
          }
          
          console.error("Error retrying recipe generation:", err);
          setError(err.message || "Recipe generation failed. Please try again.");
          toast({
            title: "Recipe generation failed",
            description: err.message || "Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsRetrying(false);
        }
      }, 100);
    } catch (err: any) {
      setIsRetrying(false);
      console.error("Error setting up retry:", err);
      toast({
        title: "Retry failed",
        description: "Failed to start recipe generation. Please try again.",
        variant: "destructive",
      });
    }
  }, [setError, setLoading]);

  return {
    isRetrying,
    setIsRetrying,
    handleRetry
  };
}
