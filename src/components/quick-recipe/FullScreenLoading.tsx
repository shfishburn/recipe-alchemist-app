
import React, { useEffect } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { AlertCircle, ArrowLeft, RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { TopLoadingBar } from './loading/TopLoadingBar';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { cn } from '@/lib/utils';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export const FullScreenLoading = React.memo(function FullScreenLoading({ 
  onCancel, 
  onRetry, 
  error 
}: FullScreenLoadingProps) {
  const { loadingState } = useQuickRecipeStore();
  const isErrorState = !!error;
  const { showTimeout, showFinalAnimation } = useLoadingProgress();
  
  // Enhanced body overflow control with cleanup
  useEffect(() => {
    // Add overflow-hidden only if loading, not in error state
    if (!isErrorState) {
      document.body.classList.add('overflow-hidden');
      
      // Add a loading-trigger marker to help with cleanup detection
      const loadingTrigger = document.createElement('div');
      loadingTrigger.classList.add('loading-trigger');
      loadingTrigger.style.display = 'none';
      document.body.appendChild(loadingTrigger);
    }
    
    return () => {
      // Ensure we clean up properly on unmount
      document.body.classList.remove('overflow-hidden');
      
      // Remove any loading triggers we created
      const loadingTriggers = document.querySelectorAll('.loading-trigger');
      loadingTriggers.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [isErrorState]);
  
  return (
    <div 
      className={cn(
        "loading-overlay fixed inset-0 flex flex-col items-center justify-center p-4 z-[9999]",
        "animate-fadeIn touch-action-none hw-accelerated",
        isErrorState ? "bg-gray-900/60" : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
      )}
      aria-modal="true"
      role="dialog"
    >
      <TopLoadingBar showFinalAnimation={showFinalAnimation} />
      
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {isErrorState ? "Recipe Generation Failed" : "Generating Your Recipe"}
        </h1>
      </VisuallyHidden>
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-12">
        {isErrorState ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 animate-scale-in bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Recipe Generation Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            
            <div className="flex flex-row space-x-3">
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Start Over
                </Button>
              )}
              
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="flex items-center gap-2 bg-recipe-green hover:bg-recipe-green/90"
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
            <div className="flex flex-col items-center space-y-6 mb-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 w-full">
              <div className="relative transform-gpu">
                {showFinalAnimation ? (
                  <LoadingAnimation showFinalAnimation={true} />
                ) : (
                  <div className="relative">
                    <ChefHat className="h-12 w-12 text-recipe-green animate-float" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-green rounded-full animate-pulse" />
                    <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0.2s" }}></div>
                    <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0.8s", left: "12px" }}></div>
                  </div>
                )}
              </div>
              
              <h2 className="text-lg sm:text-xl font-semibold animate-fade-in">
                {showFinalAnimation ? "Recipe ready!" : "Creating Your Recipe"}
              </h2>
              
              <p className="text-sm text-muted-foreground">
                {showFinalAnimation ? "Your recipe has been created." : loadingState.stepDescription}
              </p>
              
              {/* Enhanced progress indicator with gradient */}
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-recipe-green to-recipe-blue transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${loadingState.percentComplete}%` }}
                />
              </div>
              
              {/* Timeout warning */}
              {showTimeout && !showFinalAnimation && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2 w-full animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <span>This is taking longer than usual. Please be patient...</span>
                </div>
              )}
            </div>
            
            {/* Cooking tip card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-8 max-w-sm mx-auto w-full">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button */}
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
