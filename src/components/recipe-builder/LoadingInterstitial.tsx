
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingInterstitialProps {
  isOpen: boolean;
  onCancel?: () => void;
}

const LoadingInterstitial = ({ isOpen, onCancel }: LoadingInterstitialProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isOpen) {
      // Show timeout message after 30 seconds
      timeoutId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 30000); // 30 seconds
    } else {
      setShowTimeoutMessage(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-recipe-blue" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Creating Your Recipe</h3>
          <p className="text-muted-foreground text-sm">
            Our culinary AI is crafting your perfect recipe...
          </p>
          
          {showTimeoutMessage && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">This is taking longer than expected</span>
              </div>
              <p className="text-xs">
                The process may be taking longer due to high demand or a complex recipe.
              </p>
              {onCancel && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCancel} 
                  className="mt-2 w-full text-amber-600 border-amber-300"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingInterstitial;
