
import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { AlertCircle, ArrowLeft, RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Progress } from '@/components/ui/progress';

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
  const { loadingState, updateLoadingState } = useQuickRecipeStore();
  const isErrorState = !!error;
  const [completedLoading, setCompletedLoading] = useState(false);
  
  const progressTimerRef = useRef<number | null>(null);
  
  // Clean up on unmount with a more efficient approach
  useEffect(() => {
    if (!isErrorState) {
      document.body.classList.add('overflow-hidden');
    }
    
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      document.body.classList.remove('overflow-hidden');
    };
  }, [isErrorState]);
  
  // Optimize progress simulation with fewer updates
  const simulateProgress = useCallback(() => {
    if (isErrorState || progressTimerRef.current) return;
    
    const steps = [
      "Analyzing your ingredients...",
      "Crafting the perfect recipe...",
      "Adding scientific details...",
      "Calculating nutrition information...",
      "Finalizing your recipe..."
    ];
    
    let currentStep = 0;
    let progress = 0;
    
    // Update less frequently (400ms instead of 300ms)
    progressTimerRef.current = window.setInterval(() => {
      progress += 1.5; // Larger increment, fewer updates
      
      // Change step description at certain progress points
      if (progress >= 20 && currentStep === 0) {
        currentStep = 1;
      } else if (progress >= 40 && currentStep === 1) {
        currentStep = 2;
      } else if (progress >= 60 && currentStep === 2) {
        currentStep = 3;
      } else if (progress >= 80 && currentStep === 3) {
        currentStep = 4;
      }
      
      // Batch state updates with requestAnimationFrame
      window.requestAnimationFrame(() => {
        updateLoadingState({
          step: currentStep,
          stepDescription: steps[currentStep],
          percentComplete: progress,
          estimatedTimeRemaining: Math.max(30 - progress/3, 0)
        });
      });
      
      if (progress >= 100) {
        if (progressTimerRef.current) {
          window.clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
        // Mark loading as completed to enable pointer events
        setCompletedLoading(true);
      }
    }, 400); // Increased interval for better performance
  }, [isErrorState, updateLoadingState]);
  
  // Start progress simulation on mount with debounce
  useEffect(() => {
    const timer = setTimeout(simulateProgress, 50);
    return () => clearTimeout(timer);
  }, [simulateProgress]);

  // Set appropriate pointer events based on loading state
  const pointerEventsClass = completedLoading && !isErrorState ? 'pointer-events-none' : '';
  
  return (
    <div className={`absolute inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 z-[100] ${pointerEventsClass}`} 
         style={{willChange: 'opacity'}}>
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {isErrorState ? "Recipe Generation Failed" : "Generating Your Recipe"}
        </h1>
      </VisuallyHidden>
      
      <div className="w-full max-w-md mx-auto text-center py-12">
        {isErrorState ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
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
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Main loading animation - simplified for performance */}
            <div className="flex flex-col items-center space-y-6 mb-8">
              <div className="relative">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-recipe-green/10 animate-pulse"></div>
                  <ChefHat className="h-12 w-12 text-recipe-green animate-pulse" />
                </div>
              </div>
              
              {/* Title and description - simplified gradient */}
              <div>
                <h2 className="text-xl font-medium mb-1 bg-clip-text text-transparent bg-gradient-to-r from-recipe-primary to-recipe-green">
                  Creating Your Recipe
                </h2>
                <p className="text-muted-foreground text-sm">
                  Our AI chef is crafting the perfect recipe for you...
                </p>
              </div>
            </div>
            
            {/* Loading progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">
                  {loadingState?.stepDescription || "Analyzing your ingredients..."}
                </span>
                <span className="text-muted-foreground">
                  {Math.ceil(loadingState?.percentComplete || 0)}%
                </span>
              </div>
              
              <Progress
                value={loadingState?.percentComplete || 10}
                className="h-2 bg-gray-100"
                indicatorClassName="bg-recipe-green"
                aria-label="Recipe generation progress"
              />
            </div>
            
            {/* Cooking tip card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-8 max-w-sm mx-auto">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-muted-foreground hover:text-foreground"
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
