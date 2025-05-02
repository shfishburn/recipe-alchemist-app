
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
  
  useEffect(() => {
    let timeoutWarningId: NodeJS.Timeout;
    let timeoutErrorId: NodeJS.Timeout;
    
    if (isOpen) {
      // Show timeout warning after 30 seconds
      timeoutWarningId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 30000); // 30 seconds
      
      // Show error message after 45 seconds
      timeoutErrorId = setTimeout(() => {
        setShowErrorMessage(true);
      }, 45000); // 45 seconds
    } else {
      setShowTimeoutMessage(false);
      setShowErrorMessage(false);
    }
    
    return () => {
      clearTimeout(timeoutWarningId);
      clearTimeout(timeoutErrorId);
    };
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        <div className="relative">
          {showErrorMessage ? (
            <XCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
          )}
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {showErrorMessage ? "Recipe Generation Issue" : "Creating Your Recipe"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {showErrorMessage
              ? "The recipe is taking longer than expected to create."
              : "Our culinary AI is crafting your perfect recipe..."}
          </p>
          
          {showTimeoutMessage && !showErrorMessage && (
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
          
          {showErrorMessage && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Recipe generation may have issues</span>
              </div>
              <p className="text-xs">
                We're still working on your recipe, but it's taking longer than usual.
                You can continue waiting or cancel and try again.
              </p>
            </div>
          )}
          
          {onCancel && (
            <Button 
              variant={showErrorMessage ? "default" : "outline"} 
              size="sm" 
              onClick={onCancel} 
              className={`mt-2 w-full ${showErrorMessage ? "bg-primary text-primary-foreground" : "text-amber-600 border-amber-300"}`}
            >
              {showErrorMessage ? "Cancel and Try Again" : "Cancel"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingInterstitial;
