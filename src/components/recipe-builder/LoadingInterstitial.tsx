
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        console.log("LoadingInterstitial timeout message triggered");
        setShowTimeoutMessage(true);
      }, 2000); // Reduced for testing
      
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

  // For debugging
  useEffect(() => {
    console.log("LoadingInterstitial mounted", { isOpen, error });
    return () => console.log("LoadingInterstitial unmounted");
  }, []);

  // Always render the dialog content, even if there's an error
  const hasExplicitError = !!error;
  
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="h-full bg-recipe-green transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 8px rgba(76, 175, 80, 0.5)`
            }}
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
          
          {/* Always render the container but conditionally show content */}
          <div className={`mt-4 p-3 ${showTimeoutMessage && !hasExplicitError ? 'bg-amber-50 dark:bg-amber-900/10' : 'hidden'} rounded-lg text-sm text-amber-700 dark:text-amber-300`}>
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
          
          {/* Always render error message container */}
          <div className={`mt-4 p-3 ${hasExplicitError ? 'bg-red-50 dark:bg-red-900/10' : 'hidden'} rounded-lg text-sm text-red-700 dark:text-red-300`}>
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
      </DialogContent>
    </Dialog>
  );
};

export default LoadingInterstitial;
