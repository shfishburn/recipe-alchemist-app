/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeLoading } from '@/components/quick-recipe/QuickRecipeLoading';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cancelClicked, setCancelClicked] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  
  // Get store state and actions
  const { 
    setRecipe, 
    setError, 
    setLoading, 
    formData, 
    isLoading, 
    setHasTimeoutError,
    hasTimeoutError,
    loadingState,
    updateLoadingState
  } = useQuickRecipeStore();
  
  // Get navigation state
  const fromQuickRecipePage = location.state?.fromQuickRecipePage === true;
  const timestamp = location.state?.timestamp || Date.now();
  const formDataFromState = location.state?.formData;
  const isRetrying = location.state?.isRetrying === true;
  
  useEffect(() => {
    // First, ensure we're in loading state
    setLoading(true);
    
    console.log("LoadingPage mounted with state:", {
      formData,
      formDataFromState,
      fromQuickRecipePage,
      isRetrying,
      timestamp
    });
    
    const effectiveFormData = formDataFromState || formData;
    
    if (!effectiveFormData) {
      console.error("No form data available for recipe generation");
      navigate('/', { 
        replace: true,
        state: { error: "Missing recipe information. Please try again." }
      });
      return;
    }

    // Start generating the recipe
    const generateRecipe = async () => {
      try {
        // Simulate step progress
        const progressInterval = setInterval(() => {
          // read current state fresh to avoid stale closure
          const current = useQuickRecipeStore.getState().loadingState;
          const newStep = Math.min(current.step + 1, 3);
          updateLoadingState({
            step: newStep,
            stepDescription: getStepDescription(newStep),
            percentComplete: Math.min(current.percentComplete + 5, 95)
          });
        }, 2000);
        
        // Generate the recipe
        console.log("Starting recipe generation with data:", effectiveFormData);
        const generatedRecipe = await generateQuickRecipe(effectiveFormData);
        
        clearInterval(progressInterval);
        
        console.log("Recipe generated successfully:", generatedRecipe);
        
        // Check if we have an error in the recipe
        if (generatedRecipe && generatedRecipe.isError) {
          console.error("Recipe generation returned error:", generatedRecipe.error_message);
          throw new Error(generatedRecipe.error_message || "Error generating recipe");
        }
        
        // Set the recipe
        setRecipe(generatedRecipe);
        
        // Navigate to the recipe preview
        navigate('/recipe-preview', { replace: true });
      } catch (error: unknown) {
        console.error("Error generating recipe:", error);
        // Ensure error is an Error instance
        const err = error instanceof Error ? error : new Error(String(error));
        
        // Specific timeout error handling
        let errorMessage = err.message || "Failed to generate recipe";
        const isTimeout = errorMessage.toLowerCase().includes('timeout');
        
        if (isTimeout) {
          setHasTimeoutError(true);
          errorMessage = "Recipe generation timed out. Please try again with simpler ingredients.";
        }
        
        setError(errorMessage);
        
        // Navigate back to home with error and form data for retry
        navigate('/', { 
          replace: true,
          state: { 
            error: errorMessage,
            formData: effectiveFormData, // Keep form data for retry
            hasTimeoutError: isTimeout
          }
        });
      }
    };

    // Only start generation if not already cancelled
    if (!cancelClicked) {
      generateRecipe();
    }
    
    return () => {
      // Cleanup function
      console.log("LoadingPage unmounting");
    };
  }, []);
  
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
      {/* single animated loader with built-in cancel button */}
      <QuickRecipeLoading
        onCancel={handleCancel}
        timeoutWarning={hasTimeoutError}
        percentComplete={loadingState.percentComplete}
        stepDescription={loadingState.stepDescription}
      />
    </div>
  );
};

export default LoadingPage;
