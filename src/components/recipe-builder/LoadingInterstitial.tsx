
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingInterstitialProps {
  isOpen: boolean;
  onCancel?: () => void;
}

const LoadingInterstitial = ({ isOpen, onCancel }: LoadingInterstitialProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showCriticalError, setShowCriticalError] = useState(false);
  
  useEffect(() => {
    let timeoutWarningId: NodeJS.Timeout;
    let timeoutErrorId: NodeJS.Timeout;
    let criticalErrorId: NodeJS.Timeout;
    
    if (isOpen) {
      // Show timeout warning after 20 seconds
      timeoutWarningId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 20000); // 20 seconds
      
      // Show error message after 35 seconds
      timeoutErrorId = setTimeout(() => {
        setShowErrorMessage(true);
      }, 35000); // 35 seconds
      
      // Show critical error after 50 seconds
      criticalErrorId = setTimeout(() => {
        setShowCriticalError(true);
      }, 50000); // 50 seconds
    } else {
      setShowTimeoutMessage(false);
      setShowErrorMessage(false);
      setShowCriticalError(false);
    }
    
    return () => {
      clearTimeout(timeoutWarningId);
      clearTimeout(timeoutErrorId);
      clearTimeout(criticalErrorId);
    };
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        <div className="relative">
          {showCriticalError ? (
            <XCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
          )}
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {showCriticalError 
              ? "Recipe Generation Failed" 
              : showErrorMessage 
                ? "Recipe Generation Issue" 
                : "Creating Your Recipe"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {showCriticalError
              ? "We couldn't create your recipe. Please try again with a different request."
              : showErrorMessage
                ? "The recipe is taking longer than expected to create."
                : "Our culinary AI is crafting your perfect recipe..."}
          </p>
          
          {showTimeoutMessage && !showErrorMessage && !showCriticalError && (
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
          
          {showErrorMessage && !showCriticalError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Recipe generation may have issues</span>
              </div>
              <p className="text-xs">
                We're still working on your recipe, but it's taking longer than usual.
                You can continue waiting or cancel and try again with a simpler recipe.
              </p>
            </div>
          )}
          
          {showCriticalError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Recipe generation failed</span>
              </div>
              <p className="text-xs">
                We couldn't generate your recipe. This could be due to:
                <ul className="list-disc list-inside mt-2">
                  <li>Complex or unusual ingredient combinations</li>
                  <li>High system demand</li>
                  <li>Temporary service interruption</li>
                </ul>
              </p>
            </div>
          )}
          
          {onCancel && (
            <Button 
              variant={showCriticalError ? "default" : showErrorMessage ? "destructive" : "outline"} 
              size="sm" 
              onClick={onCancel} 
              className={`mt-2 w-full ${showCriticalError ? "bg-primary text-primary-foreground" : showErrorMessage ? "bg-destructive text-destructive-foreground" : "text-amber-600 border-amber-300"}`}
            >
              {showCriticalError ? "Try Again" : showErrorMessage ? "Cancel and Try Again" : "Cancel"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingInterstitial;
