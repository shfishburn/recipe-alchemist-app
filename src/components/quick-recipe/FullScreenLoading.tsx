
import React, { useEffect, useState, memo } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { AlertCircle, ArrowLeft, RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { TopLoadingBar } from './loading/TopLoadingBar';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export const FullScreenLoading = memo(function FullScreenLoading({ 
  onCancel, 
  onRetry, 
  error 
}: FullScreenLoadingProps) {
  const { loadingState } = useQuickRecipeStore();
  const isErrorState = !!error;
  const { showTimeout, showFinalAnimation } = useLoadingProgress();
  
  // Clean up on mount/unmount
  useEffect(() => {
    // Add overflow-hidden only if loading
    if (!isErrorState) {
      document.body.classList.add('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isErrorState]);

  // Set appropriate pointer events based on loading state
  const pointerEventsClass = showFinalAnimation && !isErrorState ? 'pointer-events-none' : '';
  
  return (
    <div className={`absolute inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 z-[100] animate-fadeIn overflow-auto ${pointerEventsClass}`}>
      <TopLoadingBar showFinalAnimation={showFinalAnimation} />
      
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {isErrorState ? "Recipe Generation Failed" : "Generating Your Recipe"}
        </h1>
      </VisuallyHidden>
      
      <div className="w-full max-w-md mx-auto text-center py-12">
        {isErrorState ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 animate-scale-in">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Recipe Generation Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            
            <div className="flex flex-row space-x-3">
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex items-center gap-2 touch-ripple"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Start Over
                </Button>
              )}
              
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="flex items-center gap-2 touch-ripple"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Main loading animation */}
            <div className="flex flex-col items-center space-y-6 mb-8">
              {/* Enhanced animated cooking pot icon with chef hat */}
              <div className="relative hw-accelerated">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-recipe-green/10 animate-pulse"></div>
                  <ChefHat className="h-12 w-12 text-recipe-green animate-cooking-pot" />
                  
                  {/* Animated 'steam' effects - simplified for better performance */}
                  <div className="absolute -top-2 left-0 opacity-60">
                    <div className="h-2 w-2 rounded-full bg-recipe-green animate-steam"></div>
                  </div>
                  <div className="absolute -top-1 right-0 opacity-70">
                    <div className="h-2 w-2 rounded-full bg-recipe-green animate-steam delay-150"></div>
                  </div>
                </div>
              </div>
              
              {/* Title and description with gradient text */}
              <div className="animate-fade-in">
                <h2 className="text-xl font-medium mb-1 text-gradient animate-gradient-x" 
                    style={{backgroundImage: "linear-gradient(90deg, #4caf50, #2196f3, #4caf50)"}}>
                  Creating Your Recipe
                </h2>
                <p className="text-muted-foreground text-sm">
                  Our AI chef is crafting the perfect recipe for you...
                </p>
              </div>
            </div>
            
            {/* Progress indicator section */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">
                  {loadingState?.stepDescription || "Analyzing your ingredients..."}
                </span>
              </div>
              
              {/* Simple progress bar */}
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-recipe-green transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${loadingState.percentComplete}%` }}
                />
              </div>
              
              {/* Timeout warning */}
              {showTimeout && !showFinalAnimation && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>This is taking longer than usual. Please be patient...</span>
                </div>
              )}
            </div>
            
            {/* Cooking tip card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-8 max-w-sm mx-auto">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button with proper aria description */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-muted-foreground hover:text-foreground animate-fade-in"
                aria-label="Cancel recipe generation"
              >
                Cancel
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default FullScreenLoading;
