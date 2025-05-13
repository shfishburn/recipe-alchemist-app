
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/hooks/use-quick-recipe';
import { LoadingAnimation } from '@/components/quick-recipe/loading/LoadingAnimation';
import { authStateManager } from '@/lib/auth/auth-state-manager';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cancelClicked, setCancelClicked] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [generationAttempt, setGenerationAttempt] = useState(0);
  
  // Get store state and actions
  const { 
    setRecipe, 
    setError, 
    setLoading, 
    formData, 
    loadingState,
    setHasTimeoutError,
    updateLoadingState
  } = useQuickRecipeStore();
  
  // Get navigation state
  const fromQuickRecipePage = location.state?.fromQuickRecipePage === true;
  const formDataFromState = location.state?.formData;
  const isRetrying = location.state?.isRetrying === true;
  const isResumingGeneration = location.state?.resumingGeneration === true;
  
  useEffect(() => {
    console.log("LoadingPage mounted");
    
    // First, ensure we're in loading state
    setLoading(true);
    
    // Log information to help debug
    console.log("LoadingPage mounted with state:", {
      formData,
      formDataFromState,
      fromQuickRecipePage,
      isRetrying,
      isResumingGeneration,
      locationState: location.state
    });
    
    // Check for resume data in auth state manager
    if (isResumingGeneration && !hasAttemptedLoad) {
      const resumeAction = authStateManager.getNextPendingAction();
      if (resumeAction && resumeAction.type === 'generate-recipe' && resumeAction.data.formData) {
        console.log("Found pending recipe generation in auth state manager", resumeAction.data.formData);
        // Use this form data for generation
        generateRecipeWithData(resumeAction.data.formData);
        // Mark this action as executed
        authStateManager.markActionExecuted(resumeAction.id);
        setHasAttemptedLoad(true);
        return;
      }
    }
    
    // Determine which form data to use - prioritize from state if available
    const effectiveFormData = formDataFromState || formData;
    
    if (!effectiveFormData) {
      console.error("No form data available for recipe generation");
      navigate('/', { 
        replace: true,
        state: { error: "Missing recipe information. Please try again." }
      });
      return;
    }

    // Only start generation if not already cancelled or previously attempted
    if (!cancelClicked && !hasAttemptedLoad) {
      generateRecipeWithData(effectiveFormData);
      setHasAttemptedLoad(true);
    }
    
    return () => {
      console.log("LoadingPage unmounting");
    };
  }, [isResumingGeneration]);
  
  // Function to generate recipe with specific form data
  const generateRecipeWithData = async (recipeFormData) => {
    try {
      // Simulate step progress
      const progressInterval = setInterval(() => {
        updateLoadingState({
          step: Math.min(loadingState.step + 1, 3),
          stepDescription: getStepDescription(Math.min(loadingState.step + 1, 3)),
          percentComplete: Math.min(loadingState.percentComplete + 5, 95)
        });
      }, 2000);
      
      // Generate the recipe
      console.log("Starting recipe generation with data:", recipeFormData);
      
      // Convert single string ingredient to array if needed
      const formattedData = { 
        ...recipeFormData,
        ingredients: typeof recipeFormData.ingredients === 'string' 
          ? [recipeFormData.ingredients] 
          : recipeFormData.ingredients
      };
      
      const generatedRecipe = await generateQuickRecipe(formattedData);
      
      clearInterval(progressInterval);
      
      console.log("Recipe generated successfully:", generatedRecipe);
      
      // Check if we have an error in the recipe
      if (generatedRecipe && generatedRecipe.isError) {
        console.error("Recipe generation returned error:", generatedRecipe.error_message);
        throw new Error(generatedRecipe.error_message || "Error generating recipe");
      }
      
      // Set the recipe in the store
      setRecipe(generatedRecipe);
      
      // Navigate to the recipe preview - use replace to prevent back navigation to loading
      navigate('/recipe-preview', { replace: true });
    } catch (error) {
      console.error("Error generating recipe:", error);
      
      // Check if we should retry (only once)
      if (generationAttempt === 0) {
        console.log("First attempt failed, retrying once...");
        setGenerationAttempt(1);
        
        // Small delay before retry
        setTimeout(() => {
          generateRecipeWithData(recipeFormData);
        }, 1000);
        
        return;
      }
      
      // After retry or if it's already a retry, show the error
      // Specific timeout error handling
      let errorMessage = error.message || "Failed to generate recipe";
      let isTimeout = errorMessage.toLowerCase().includes('timeout');
      
      if (isTimeout) {
        setHasTimeoutError(true);
        errorMessage = "Recipe generation timed out. Please try again with simpler ingredients.";
      }
      
      setError(errorMessage);
      
      // Show toast for better user experience
      toast({
        title: "Recipe generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Navigate back to home with error and form data for retry
      navigate('/', { 
        replace: true,
        state: { 
          error: errorMessage,
          formData: recipeFormData, // Keep form data for retry
          hasTimeoutError: isTimeout
        }
      });
    }
  };
  
  // Get description based on step number
  const getStepDescription = (step: number): string => {
    switch (step) {
      case 0:
        return "Analyzing your ingredients...";
      case 1:
        return "Crafting the perfect recipe for you...";
      case 2:
        return "Calculating nutrition information...";
      case 3:
        return "Adding final touches to your recipe...";
      default:
        return "Processing your request...";
    }
  };
  
  const handleCancel = () => {
    setCancelClicked(true);
    setLoading(false);
    
    toast({
      title: "Recipe generation cancelled",
      description: "You can try again with different ingredients"
    });
    
    // Navigate back to home
    navigate('/', { 
      replace: true,
      state: { cancelled: true }
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <LoadingAnimation 
        step={loadingState.step}
        stepDescription={loadingState.stepDescription}
        percentComplete={loadingState.percentComplete}
      />
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="px-8"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default LoadingPage;
