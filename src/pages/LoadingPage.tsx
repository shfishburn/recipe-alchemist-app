
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/api/generate-quick-recipe';
import { PageContainer } from '@/components/ui/containers';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const messages = [
  "Analyzing your ingredients...",
  "Gathering cooking techniques...",
  "Crafting the perfect recipe...",
  "Adding a dash of magic...",
  "Finalizing your culinary masterpiece..."
];

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { 
    isLoading, 
    setLoading, 
    setError, 
    setRecipe, 
    formData, 
    reset,
    setHasTimeoutError,
    loadingState,
    updateLoadingState
  } = useQuickRecipeStore();
  
  // Ensure we have form data, either from state or session
  const hasFormData = !!formData || !!location.state?.formData;
  
  // If no form data, redirect to home page
  useEffect(() => {
    if (!hasFormData && !session) {
      console.warn("No form data available, redirecting to home");
      navigate('/');
    }
  }, [hasFormData, navigate, session]);
  
  // If not loading, redirect back to home page
  useEffect(() => {
    if (!isLoading) {
      console.warn("Not loading, redirecting to home");
      navigate('/');
    }
  }, [isLoading, navigate]);
  
  // Start recipe generation when component mounts and we have form data
  useEffect(() => {
    const generateRecipeOnMount = async () => {
      if (formData) {
        try {
          console.log("LoadingPage - Starting recipe generation with data:", formData);
          
          // Reset timeout error
          setHasTimeoutError(false);
          
          // Start the recipe generation
          const recipe = await generateQuickRecipe(formData);
          
          // If recipe generation was successful, set the recipe and navigate
          if (recipe && !recipe.isError) {
            console.log("LoadingPage - Recipe generation successful, navigating to recipe preview");
            setRecipe(recipe);
            
            // Navigate to preview page (fixed route)
            navigate('/preview', { 
              state: { 
                recipeData: recipe,
                timestamp: Date.now()
              },
              replace: true
            });
          } else {
            // If there was an error, set the error and navigate back
            console.error("LoadingPage - Recipe generation failed:", recipe?.error_message);
            setError(recipe?.error_message || "Failed to generate recipe. Please try again.");
            navigate('/', { 
              state: { 
                error: recipe?.error_message || "Failed to generate recipe. Please try again.",
                formData: formData // Keep the form data on error
              },
              replace: true
            });
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Failed to generate recipe. Please try again.";
          console.error("LoadingPage - Error during recipe generation:", e);
          setError(message);
          setLoading(false);
          
          // Navigate back to home page with error but retain form data
          navigate('/', {
            state: { 
              error: message,
              formData: formData // Keep the form data on error
            },
            replace: true
          });
        }
      } else {
        console.warn("LoadingPage - No form data available, resetting and redirecting to home");
        reset();
        navigate('/');
      }
    };
    
    // Only start generation if we're actually loading and have form data
    if (isLoading && formData) {
      generateRecipeOnMount();
    }
  }, [isLoading, setLoading, setError, setRecipe, formData, navigate, reset, setHasTimeoutError, updateLoadingState]);
  
  // Simulate loading steps with updated loading state
  useEffect(() => {
    if (isLoading) {
      const totalSteps = messages.length;
      const increment = 100 / totalSteps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          const nextStep = currentStep;
          const decrementTime = Math.floor(Math.random() * 5); // Random decrement between 0-5 seconds
          
          // Update loading state with new values
          updateLoadingState({
            step: loadingState.step + 1,
            stepDescription: messages[nextStep] || "Processing your recipe...",
            percentComplete: Math.min(100, loadingState.percentComplete + increment),
            estimatedTimeRemaining: loadingState.estimatedTimeRemaining - decrementTime
          });
          
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 5000); // Simulate each step taking 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isLoading, updateLoadingState, loadingState]);
  
  return (
    <PageContainer>
      <Card className="w-full max-w-md mx-auto bg-white/50 backdrop-blur-sm rounded-xl shadow-md animate-fadeIn">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-center">Creating Your Recipe</h2>
          <p className="text-muted-foreground text-sm text-center">
            {loadingState.stepDescription}
          </p>
          <Progress value={loadingState.percentComplete} className="h-2" />
          <p className="text-muted-foreground text-sm text-center">
            Estimated time remaining: {loadingState.estimatedTimeRemaining} seconds
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default LoadingPage;
