
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, XCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
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
  const [hasNetworkIssue, setHasNetworkIssue] = useState(false);
  const [forcedError, setForcedError] = useState<string | null>(null);
  
  // Check network status
  useEffect(() => {
    const checkNetworkStatus = () => {
      setHasNetworkIssue(!navigator.onLine);
    };
    
    // Listen to online/offline events
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    // Initial check
    checkNetworkStatus();
    
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);
  
  // Add a safety timeout for stuck loading states
  useEffect(() => {
    let safetyTimeoutId: NodeJS.Timeout | null = null;
    
    if (isOpen && !error && progress >= 90) {
      safetyTimeoutId = setTimeout(() => {
        console.log("LoadingInterstitial safety timeout triggered - loading stuck at high progress");
        setForcedError("Recipe generation is taking too long. The request may be stuck.");
      }, 30000); // 30 seconds timeout at high progress
    }
    
    return () => {
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
    };
  }, [isOpen, error, progress]);
  
  // Reset states and manage loading progress on open/close
  useEffect(() => {
    if (isOpen && !error && !hasNetworkIssue) {
      // Show timeout warning after 37 seconds
      const timeoutId = setTimeout(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log("LoadingInterstitial timeout message triggered");
        }
        setShowTimeoutMessage(true);
      }, 37000);
      
      // Progress animation
      let progressInterval: NodeJS.Timeout;
      setProgress(0);
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          // Slowly increase up to 90% but never reach 100% automatically
          if (prev < 90) {
            return Math.min(prev + 5, 90); // Faster initial progress
          }
          return prev;
        });
      }, 800);
      
      return () => {
        clearTimeout(timeoutId);
        clearInterval(progressInterval);
        setShowTimeoutMessage(false);
      };
    } else if (error || hasNetworkIssue || !isOpen) {
      // Complete the loading progress when dialog closes or error occurs
      setProgress(100);
    }
  }, [isOpen, error, hasNetworkIssue]);

  // Show different errors based on conditions
  const displayError = error || forcedError;
  const hasError = !!displayError || hasNetworkIssue;
  
  return (
    <LoadingOverlay
      isOpen={isOpen}
      onCancel={onCancel}
      isError={hasError}
      className="overflow-x-hidden"
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
          {hasNetworkIssue ? (
            <WifiOff className="h-12 w-12 text-amber-500" />
          ) : hasError ? (
            <XCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {hasNetworkIssue 
              ? "Network Connection Issue"
              : hasError 
                ? "Recipe Generation Failed" 
                : "Creating Your Recipe"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {hasNetworkIssue
              ? "Please check your internet connection and try again."
              : hasError
                ? displayError
                : "Our culinary AI is crafting your perfect recipe..."}
          </p>
          
          {/* Timeout warning */}
          <div 
            className={`mt-4 p-3 rounded-lg text-sm ${showTimeoutMessage && !hasError ? 
              'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300' : 'hidden'}`}
            aria-live="polite"
          >
            {showTimeoutMessage && !hasError && (
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
            className={`mt-4 p-3 rounded-lg text-sm ${hasError ? 
              'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300' : 'hidden'}`}
            aria-live="assertive"
          >
            {hasError && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  {hasNetworkIssue ? (
                    <>
                      <WifiOff className="h-4 w-4" />
                      <span className="font-medium">Network connection issue</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Recipe generation failed</span>
                    </>
                  )}
                </div>
                <p className="text-xs">
                  {hasNetworkIssue
                    ? "We couldn't connect to our servers. Please check your internet connection and try again."
                    : "We couldn't generate your recipe. Please try again with simpler ingredients or check your connection."}
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
            {onCancel && (
              <Button 
                variant={hasError ? "outline" : "outline"} 
                size="sm" 
                onClick={onCancel} 
                className="w-full sm:w-auto"
              >
                {hasError ? "Close" : "Cancel"}
              </Button>
            )}
            
            {onRetry && hasError && (
              <Button 
                variant="default"
                size="sm" 
                onClick={onRetry} 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                {hasNetworkIssue ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    Try Again
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default LoadingInterstitial;
