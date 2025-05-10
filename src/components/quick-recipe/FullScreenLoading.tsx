
import React, { useEffect } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { AlertCircle, ArrowLeft, RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { TopLoadingBar } from './loading/TopLoadingBar';
import { LoadingAnimation } from './loading/LoadingAnimation';

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
  
  // Improved body class management
  useEffect(() => {
    // Add overflow-hidden only if loading
    if (!isErrorState) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden'); // Ensure html element is also locked
    }
    
    return () => {
      // Cleanup body classes on unmount
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [isErrorState]);
  
  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-gray-950/95 hw-accelerated overflow-auto touch-none z-[100]">
      {/* Better fallback for backdrop-filter with solid background */}
      <div className="absolute inset-0 loading-overlay z-[100]"></div>
      
      <TopLoadingBar showFinalAnimation={showFinalAnimation} />
      
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {isErrorState ? "Recipe Generation Failed" : "Generating Your Recipe"}
        </h1>
      </VisuallyHidden>
      
      <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-4 sm:p-6">
        {isErrorState ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-4 sm:p-6 animate-scale-in bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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
            {/* Main loading animation - mobile optimized */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 mb-4 sm:mb-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100 dark:border-gray-700 w-full max-w-md">
              <div className="relative transform-gpu">
                {showFinalAnimation ? (
                  <LoadingAnimation showFinalAnimation={true} />
                ) : (
                  <div className="relative">
                    <ChefHat className="h-12 w-12 text-recipe-green animate-float" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-green rounded-full animate-pulse" />
                    <div className="steam animate-steam" style={{ animationDelay: "0.2s" }}></div>
                    <div className="steam animate-steam" style={{ animationDelay: "0.8s", left: "12px" }}></div>
                  </div>
                )}
              </div>
              
              <h2 className="text-lg sm:text-xl font-semibold">
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
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg w-full">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>This is taking longer than usual. Please be patient...</span>
                </div>
              )}
            </div>
            
            {/* Cooking tip card - better mobile spacing */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4 sm:mb-8 max-w-sm mx-auto w-full">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button - better touch target */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-muted-foreground hover:text-foreground animate-fade-in h-12 sm:h-10 min-w-[120px]"
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
