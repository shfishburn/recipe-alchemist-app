
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeLoading } from '@/components/quick-recipe/QuickRecipeLoading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ErrorDisplay } from '@/components/ui/error-display';

const LoadingContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cancelClicked, setCancelClicked] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  const progressIntervalRef = useRef<number | null>(null);
  
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
  
  // Helper function for step description
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
        // Set up progress interval safely using ref
        progressIntervalRef.current = window.setInterval(() => {
          updateLoadingState(current => {
            const newStep = Math.min(current.step + 1, 3);
            return {
              step: newStep,
              stepDescription: getStepDescription(newStep),
              percentComplete: Math.min(current.percentComplete + 5, 95)
            };
          });
        }, 2000);
        
        // Generate the recipe
        console.log("Starting recipe generation with data:", effectiveFormData);
        const generatedRecipe = await generateQuickRecipe(effectiveFormData);
        
        // Clear interval safely
        if (progressIntervalRef.current !== null) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
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
    
    // Cleanup function
    return () => {
      console.log("LoadingPage unmounting, cleaning up intervals");
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);
  
  const handleCancel = () => {
    setCancelClicked(true);
    
    // Clean up interval
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
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
      <QuickRecipeLoading
        onCancel={handleCancel}
        timeoutWarning={hasTimeoutError}
        percentComplete={loadingState.percentComplete}
        stepDescription={loadingState.stepDescription}
      />
    </div>
  );
};

// Add error fallback UI
const ErrorFallback = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <ErrorDisplay 
        error="Something went wrong during recipe generation"
        title="Recipe Generation Error"
        onRetry={handleGoBack}
        variant="default"
        size="lg"
      />
    </div>
  );
};

// Main component with error boundary
const LoadingPage: React.FC = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <LoadingContent />
    </ErrorBoundary>
  );
};

export default LoadingPage;
