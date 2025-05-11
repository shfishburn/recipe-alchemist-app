
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface LoadingInterstitialProps {
  isOpen: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

const LoadingInterstitial = ({ isOpen, onCancel, onRetry, error }: LoadingInterstitialProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Reset states and manage loading progress on open/close
  useEffect(() => {
    if (isOpen && !error) {
      // Show timeout warning after a few seconds (reduced for testing)
      const timeoutId = setTimeout(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log("LoadingInterstitial timeout message triggered");
        }
        setShowTimeoutMessage(true);
      }, 2000);
      
      // Progress animation
      let progressInterval: NodeJS.Timeout;
      setProgress(0);
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          // Slowly increase up to 90%
          if (prev < 90) {
            return prev + (90 - prev) / 20;
          }
          return prev;
        });
      }, 300);
      
      return () => {
        clearTimeout(timeoutId);
        clearInterval(progressInterval);
        setProgress(0);
        setShowTimeoutMessage(false);
      };
    } else {
      // Complete the loading progress when dialog closes or error occurs
      setProgress(100);
    }
  }, [isOpen, error]);

  // Always render the dialog content, even if there's an error
  const hasExplicitError = !!error;
  
  return (
    <LoadingOverlay
      isOpen={isOpen}
      onCancel={onCancel}
      isError={hasExplicitError}
    >
      <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="h-full bg-recipe-green transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 8px rgba(76, 175, 80, 0.5)`
            }}
            role="progressbar"
            aria-label="Loading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>
        
        <div className="relative">
          {hasExplicitError ? (
            <XCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {hasExplicitError 
              ? "Recipe Generation Failed" 
              : "Creating Your Recipe"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {hasExplicitError
              ? error
              : "Our culinary AI is crafting your perfect recipe..."}
          </p>
          
          {/* Timeout warning */}
          <div 
            className={`mt-4 p-3 rounded-lg text-sm ${showTimeoutMessage && !hasExplicitError ? 
              'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300' : 'hidden'}`}
            aria-live="polite"
          >
            {showTimeoutMessage && !hasExplicitError && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">This is taking longer than expected</span>
                </div>
                <p className="text-xs">
                  The process may be taking longer due to high demand or a complex recipe.
                  Please wait a few more moments...
                </p>
              </>
            )}
          </div>
          
          {/* Error message */}
          <div 
            className={`mt-4 p-3 rounded-lg text-sm ${hasExplicitError ? 
              'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300' : 'hidden'}`}
            aria-live="assertive"
          >
            {hasExplicitError && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Recipe generation failed</span>
                </div>
                <p className="text-xs">
                  We couldn't generate your recipe. Please try again with simpler ingredients or check your connection.
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
            {onCancel && (
              <Button 
                variant={hasExplicitError ? "outline" : "outline"} 
                size="sm" 
                onClick={onCancel} 
                className="w-full sm:w-auto"
              >
                {hasExplicitError ? "Close" : "Cancel"}
              </Button>
            )}
            
            {onRetry && hasExplicitError && (
              <Button 
                variant="default"
                size="sm" 
                onClick={onRetry} 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default LoadingInterstitial;
