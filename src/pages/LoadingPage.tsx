import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Standalone loading page that displays while a recipe is being generated
 * This page replaces the entire app layout including the navbar
 */
const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    error, 
    recipe, 
    isLoading, 
    reset, 
    hasTimeoutError 
  } = useQuickRecipeStore();
  
  const [progress, setProgress] = React.useState(10);
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);
  
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

  // Get retry and cancel functions from location state if available
  const onRetry = location.state?.onRetry;
  
  // Define cancel handler that will reset state and navigate home
  const handleCancel = () => {
    reset();
    navigate('/', { replace: true });
  };

  // Handle retry attempts
  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
      // The retry function should handle setting loading state
    } else {
      // If no retry function is provided, just go back to quick recipe page
      navigate('/quick-recipe');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md p-4 sm:p-6 flex flex-col items-center">
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="h-full bg-recipe-green transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            
            {/* Timeout message */}
            {hasTimeoutError && (
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
            
            <div className="flex flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Start Over
              </Button>
              
              {onRetry && (
                <Button 
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4`} />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8 w-full">
            {/* Gift box SVG icon - keep the same from original FullScreenLoading */}
            <div className="relative animate-gift-bounce">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 120 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="30" y="45" width="60" height="60" rx="4" fill="#D1D5DB" />
                <path d="M30 49a4 4 0 014-4h52a4 4 0 014 4v10H30V49z" fill="#4CAF50" />
                <path d="M60 45V30M50 37.5C50 32.8 54.5 25 60 30c5.5 5 10 2.5 10 7.5S65 45 60 45s-10-2.8-10-7.5z" stroke="#4CAF50" strokeWidth="3" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold">Creating your recipe...</h2>
            
            {/* Progress bar with animation */}
            <Progress 
              value={progress}
              className="w-full" 
              indicatorClassName="animate-progress-pulse" 
              indicatorColor="#4CAF50" 
            />
            
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
            
            {/* Tip card - Simplified to a single tip */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 w-full">
              <h4 className="text-lg font-semibold mb-2">Chef's Tip</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
              </p>
            </div>
            
            {/* Cancel button */}
            <Button 
              variant="ghost" 
              onClick={handleCancel} 
              className="text-gray-500"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
