
/**
 * DO NOT MODIFY: This is a critical component that handles loading states throughout the application.
 * Modifications may break the loading experience or cause unintended side effects.
 * 
 * This component provides a standalone loading page that completely replaces the app layout
 * during recipe generation, API calls, and other intensive operations.
 */

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { toast } from '@/hooks/use-toast';

/**
 * Standalone loading page that completely replaces the app layout
 * This page exists outside the normal layout hierarchy
 */
const LoadingPage: React.FC = () => {
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
  const [retryCount, setRetryCount] = useState(0);
  const [hasNetworkIssue, setHasNetworkIssue] = useState(false);
  const [forcedError, setForcedError] = useState<string | null>(null);
  const MAX_RETRIES = 3;
  
  // Use a single ref to store all timeout and interval IDs
  const timers = useRef<(NodeJS.Timeout | number)[]>([]);
  
  // Add a timeout/interval to the ref for tracking
  const addTimer = (id: NodeJS.Timeout | number) => {
    timers.current.push(id);
    return id;
  };
  
  // Check network status
  useEffect(() => {
    const handleNetworkChange = () => {
      setHasNetworkIssue(!navigator.onLine);
    };
    
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    
    // Initial check
    setHasNetworkIssue(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);
  
  // Add a safety fallback for state that gets stuck at high progress
  useEffect(() => {
    if (isLoading && !error && progress >= 90) {
      // If we're stuck at high progress for too long (30 seconds), show an error message
      const safetyTimeoutId = addTimer(setTimeout(() => {
        console.log("[SAFETY FALLBACK] Loading has been stuck at high progress for too long");
        setForcedError("Recipe generation is taking too long. The request may be stuck or failed silently.");
        setLoading(false); // Stop loading state to allow retry
      }, 30000)); // 30 seconds
      
      return () => clearTimeout(safetyTimeoutId);
    }
  }, [isLoading, error, progress, setLoading]);
  
  // Handle forced errors the same way as regular errors
  useEffect(() => {
    if (forcedError && !error) {
      setError(forcedError);
    }
  }, [forcedError, setError, error]);
  
  // Redirect back to quick-recipe if loading is complete or we have a recipe
  useEffect(() => {
    if (!isLoading && recipe) {
      // Loading finished with success - redirect to quick recipe page
      navigate('/quick-recipe', { state: { fromLoading: true } });
    }
  }, [isLoading, recipe, navigate]);

  // Handle timeout warning display
  useEffect(() => {
    if (isLoading && !error) {
      // Show timeout warning after 37 seconds
      const timeoutId = addTimer(setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 37000));
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, error]);

  // Consolidated progress movement with more dynamic steps
  useEffect(() => {
    if (isLoading && !error) {
      // Reset progress when loading starts
      setProgress(10);
      
      // More realistic progress steps with ref-tracked timeouts
      const progressSteps = [
        { target: 20, time: 1000 },  // Quick initial progress
        { target: 35, time: 2000 },  // Analyzing ingredients
        { target: 50, time: 3000 },  // Generating recipe
        { target: 65, time: 5000 },  // Finalizing
        { target: 80, time: 8000 }   // Waiting for response
      ];
      
      // Create a series of timeouts for each progress step
      progressSteps.forEach(step => {
        const timeoutId = addTimer(setTimeout(() => {
          setProgress(prev => Math.max(prev, step.target));
        }, step.time));
      });
      
      // Slow progress after initial steps
      const slowProgressInterval = addTimer(setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) {
            return Math.min(prev + 0.2, 93); // Very slow progress up to 93% - don't go to 100% automatically
          }
          return prev;
        });
      }, 1000));
      
      return () => {
        // Clear all stored timers on cleanup
        timers.current.forEach(id => {
          if (typeof id === 'number') {
            clearInterval(id);
          } else {
            clearTimeout(id);
          }
        });
        timers.current = [];
      };
    } else {
      // Complete the progress when loading finishes
      setProgress(100);
    }
  }, [isLoading, error]);

  // Define cancel handler that will reset state and navigate home
  const handleCancel = useCallback(() => {
    reset();
    navigate('/', { replace: true });
  }, [navigate, reset]);

  // Handle retry attempts with retry count limit
  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast({
        title: "Maximum retry limit reached",
        description: "Please try again with different ingredients or options.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData) {
      try {
        setIsRetrying(true);
        setError(null);
        setForcedError(null); // Clear any forced errors
        setLoading(true);
        setRetryCount(prev => prev + 1);
        setProgress(10); // Reset progress
        
        console.log(`[RETRY ATTEMPT ${retryCount + 1}] Retrying recipe generation with formData:`, formData);
        
        // Add network request monitoring
        const timeoutPromise = new Promise((_, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("Recipe generation timed out after 120 seconds. Please try again."));
          }, 120000); // 2 minute timeout
          
          // Store the timeout ID for cleanup
          addTimer(timeoutId);
        });
        
        try {
          // Race the recipe generation against a timeout
          await Promise.race([
            generateQuickRecipe(formData),
            timeoutPromise
          ]);
        } catch (error: any) {
          console.error("[RECIPE GENERATION ERROR]", error);
          throw error;
        }
        
        setIsRetrying(false);
      } catch (error: any) {
        console.error("Error during retry:", error);
        toast({
          title: "Recipe generation failed",
          description: error.message || "Please try again with different ingredients.",
          variant: "destructive",
        });
        setIsRetrying(false);
        setLoading(false);
      }
    } else {
      // If no form data is available, go back to quick recipe page
      navigate('/quick-recipe');
    }
  }, [formData, generateQuickRecipe, navigate, retryCount, setError, setLoading, addTimer]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <div className="w-full max-w-md p-4 sm:p-6 flex flex-col items-center">
        {error || hasNetworkIssue || forcedError ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
            <h2 className="text-xl font-semibold">
              {hasNetworkIssue ? "Network Connection Lost" : "Recipe Generation Failed"}
            </h2>
            <p className="text-muted-foreground">
              {hasNetworkIssue 
                ? "Please check your internet connection and try again."
                : error || forcedError || "An unknown error occurred"}
            </p>
            
            {/* Timeout message */}
            {hasTimeoutError && !hasNetworkIssue && (
              <div className="mt-4 p-3 rounded-lg text-sm bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">This request timed out</span>
                </div>
                <p className="text-xs">
                  Try again with a simpler recipe request or fewer ingredients.
                </p>
              </div>
            )}
            
            {/* Retry count indicator */}
            {retryCount > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </div>
            )}
            
            <div className="flex flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Start Over
              </Button>
              
              {formData && retryCount < MAX_RETRIES && !hasNetworkIssue && (
                <Button 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-8 w-full"
          >
            {/* Gift box SVG icon */}
            <div className="relative">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 120 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="drop-shadow-md"
              >
                <rect x="30" y="45" width="60" height="60" rx="4" fill="#D1D5DB" className="dark:fill-gray-700" />
                <path d="M30 49a4 4 0 014-4h52a4 4 0 014 4v10H30V49z" fill="#4CAF50" />
                <path d="M60 45V30M50 37.5C50 32.8 54.5 25 60 30c5.5 5 10 2.5 10 7.5S65 45 60 45s-10-2.8-10-7.5z" stroke="#4CAF50" strokeWidth="3" />
                
                {/* Adding sparkle effects */}
                <circle cx="40" cy="60" r="2" fill="white" className="animate-pulse" />
                <circle cx="75" cy="65" r="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="55" cy="80" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold bg-clip-text bg-gradient-to-r from-recipe-green to-recipe-blue text-transparent animate-pulse">
              Creating your recipe...
            </h2>
            
            {/* Progress bar with animation - consolidated into single Progress component */}
            <div className="w-full space-y-1">
              <Progress 
                value={progress}
                className="w-full h-2" 
                indicatorClassName="animate-progress-pulse" 
                indicatorColor="#4CAF50" 
              />
              <div className="text-xs text-muted-foreground text-right">
                {progress.toFixed(0)}%
              </div>
            </div>
            
            {/* Timeout warning */}
            {showTimeoutMessage && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 p-4 w-full">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="text-base font-medium text-amber-700 dark:text-amber-400">Taking longer than expected</h4>
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                  The recipe is taking a bit longer to create. Please be patient as our AI is working hard on your request.
                </p>
              </div>
            )}
            
            {/* Cancel button */}
            <Button 
              variant="ghost" 
              onClick={handleCancel} 
              className="text-gray-500"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
