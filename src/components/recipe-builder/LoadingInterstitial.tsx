
import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingBar from 'react-top-loading-bar';

interface LoadingInterstitialProps {
  isOpen: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

const LoadingInterstitial = ({ isOpen, onCancel, onRetry, error }: LoadingInterstitialProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const loadingRef = useRef<any>(null);
  
  // Reset states and manage loading bar on open/close
  useEffect(() => {
    if (isOpen && !error) {
      // Start the loading bar with improved reliability
      if (loadingRef.current) {
        // Start with a static value first for immediate feedback
        loadingRef.current.staticStart(30);
        
        // Then switch to continuous after a short delay
        setTimeout(() => {
          if (loadingRef.current) {
            loadingRef.current.continuousStart(0, 100);
          }
        }, 100);
      }
      
      // Show timeout warning after 20 seconds
      const timeoutId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 20000);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // Complete the loading bar when dialog closes or error occurs
      if (loadingRef.current) {
        loadingRef.current.complete();
      }
      setShowTimeoutMessage(false);
    }
  }, [isOpen, error]);

  // If there's an explicit error, show the critical error state
  const hasExplicitError = !!error;
  
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        <LoadingBar color="#4CAF50" height={3} ref={loadingRef} shadow={true} className="absolute top-0 left-0 right-0" />
        
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
          
          {showTimeoutMessage && !hasExplicitError && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">This is taking longer than expected</span>
              </div>
              <p className="text-xs">
                The process may be taking longer due to high demand or a complex recipe.
                Please wait a few more moments...
              </p>
            </div>
          )}
          
          {hasExplicitError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Recipe generation failed</span>
              </div>
              <p className="text-xs">
                We couldn't generate your recipe. Please try again with simpler ingredients or check your connection.
              </p>
            </div>
          )}
          
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
