
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { generateQuickRecipe } from '@/api/generate-quick-recipe';
import { PageContainer } from '@/components/ui/containers';
import { LoadingAnimation } from '@/components/quick-recipe/loading/LoadingAnimation';
import { useAuth } from '@/hooks/use-auth';

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
  
  // Track whether generation has been attempted
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  
  // Ensure we have form data, either from state or session
  const hasFormData = !!formData || !!location.state?.formData;
  
  // Debug log for tracing loading page behavior
  useEffect(() => {
    console.log("LoadingPage mounted with state:", {
      isLoading,
      hasFormData,
      formDataExists: !!formData,
      locationState: location.state
    });
    
    // If not loading, we shouldn't be on this page
    if (!isLoading && hasAttemptedGeneration) {
      console.warn("LoadingPage - Not loading after generation attempt, redirecting to home");
      navigate('/');
    }
  }, [isLoading, navigate, hasFormData, formData, location.state, hasAttemptedGeneration]);
  
  // If no form data, redirect to home page
  useEffect(() => {
    if (!hasFormData && !session) {
      console.warn("LoadingPage - No form data available, redirecting to home");
      navigate('/');
    }
  }, [hasFormData, navigate, session]);
  
  // Handler for successful recipe generation
  const handleSuccessfulGeneration = useCallback((recipe) => {
    console.log("LoadingPage - Recipe generation successful, navigating to preview page");
    
    // Navigate to preview page (with consistent route)
    navigate('/preview', { 
      state: { 
        recipeData: recipe,
        timestamp: Date.now(),
        fromLoading: true
      },
      replace: true
    });
  }, [navigate]);
  
  // Start recipe generation when component mounts and we have form data
  useEffect(() => {
    const generateRecipeOnMount = async () => {
      if (formData) {
        try {
          setHasAttemptedGeneration(true);
          console.log("LoadingPage - Starting recipe generation with data:", formData);
          
          // Reset timeout error
          setHasTimeoutError(false);
          
          // Start the recipe generation
          const recipe = await generateQuickRecipe(formData);
          
          // If recipe generation was successful, set the recipe and navigate
          if (recipe && !recipe.isError) {
            console.log("LoadingPage - Recipe generation successful, navigating to recipe preview");
            setRecipe(recipe);
            
            handleSuccessfulGeneration(recipe);
          } else {
            // If there was an error, set the error and navigate back
            console.error("LoadingPage - Recipe generation failed:", recipe?.error_message);
            setError(recipe?.error_message || "Failed to generate recipe. Please try again.");
            setLoading(false);
            
            navigate('/', { 
              state: { 
                error: recipe?.error_message || "Failed to generate recipe. Please try again.",
                formData: formData // Keep the form data on error
              },
              replace: true
            });
          }
        } catch (e) {
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
    if (isLoading && formData && !hasAttemptedGeneration) {
      generateRecipeOnMount();
    }
  }, [isLoading, setLoading, setError, setRecipe, formData, navigate, reset, 
      setHasTimeoutError, hasAttemptedGeneration, setHasAttemptedGeneration, handleSuccessfulGeneration]);
  
  return (
    <PageContainer className="min-h-screen flex items-center justify-center">
      <LoadingAnimation 
        step={loadingState.step}
        stepDescription={loadingState.stepDescription}
        percentComplete={loadingState.percentComplete}
        estimatedTimeRemaining={loadingState.estimatedTimeRemaining}
      />
    </PageContainer>
  );
};

// Default export needed for dynamic import
export default LoadingPage;
