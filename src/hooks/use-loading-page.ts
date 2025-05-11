
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';

export function useLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    error, 
    recipe, 
    isLoading, 
    formData,
    reset, 
    hasTimeoutError,
    setLoading,
    setError,
  } = useQuickRecipeStore();
  
  const { generateQuickRecipe } = useQuickRecipe();
  
  const [progress, setProgress] = useState(10);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [animateExit, setAnimateExit] = useState(false);
  
  // Redirect back to quick-recipe if loading is complete or we have a recipe
  useEffect(() => {
    if (!isLoading && recipe) {
      // Set animateExit to true to trigger exit animation
      setAnimateExit(true);
      
      // Delay navigation to allow for exit animation
      const timeout = setTimeout(() => {
        navigate('/quick-recipe', { state: { fromLoading: true } });
      }, 200); // Match this to transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, recipe, navigate]);

  // Handle timeout warning display
  useEffect(() => {
    if (isLoading && !error) {
      // Show timeout warning after 15 seconds
      const timeoutId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 15000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, error]);

  // Simulate progress movement
  useEffect(() => {
    if (isLoading && !error) {
      // Reset progress when loading starts
      setProgress(10);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          // Progress moves quickly to 60%, then slows down
          if (prev < 60) {
            return Math.min(prev + 5, 60);
          } else {
            return Math.min(prev + 0.5, 95); // Never quite reaches 100%
          }
        });
      }, 750);
      
      return () => clearInterval(interval);
    } else {
      // Complete the progress when loading finishes
      setProgress(100);
    }
  }, [isLoading, error]);

  // Define cancel handler that will reset state and navigate home
  const handleCancel = () => {
    reset();
    // Set animateExit to true to trigger exit animation
    setAnimateExit(true);
    
    // Delay navigation to allow for exit animation
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 200); // Match this to transition duration
  };

  // Handle retry attempts
  const handleRetry = async () => {
    if (formData) {
      try {
        setIsRetrying(true);
        setError(null);
        setLoading(true);
        
        console.log("Retrying recipe generation with formData:", formData);
        
        // Start a new generation with the existing form data
        await generateQuickRecipe(formData);
        
        setIsRetrying(false);
      } catch (error: any) {
        console.error("Error during retry:", error);
        setIsRetrying(false);
      }
    } else {
      // If no form data is available, go back to quick recipe page
      setAnimateExit(true);
      setTimeout(() => {
        navigate('/quick-recipe');
      }, 200);
    }
  };

  return {
    error,
    progress, 
    showTimeoutMessage,
    isLoading,
    recipe,
    formData,
    hasTimeoutError,
    isRetrying,
    animateExit,
    handleCancel,
    handleRetry,
    setAnimateExit
  };
}
