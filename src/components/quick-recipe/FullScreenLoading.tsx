
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { AlertCircle, ArrowLeft, Clock, RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Progress } from '@/components/ui/progress';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ onCancel, onRetry, error }: FullScreenLoadingProps) {
  const { loadingState } = useQuickRecipeStore();
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {error ? "Recipe Generation Failed" : "Recipe Generation Loading Screen"}
        </h1>
      </VisuallyHidden>
      
      <div className="w-full max-w-md mx-auto text-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            {/* Accessible title */}
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
            {/* Main loading animation */}
            <div className="flex flex-col items-center space-y-6 mb-8">
              {/* Enhanced animated cooking pot icon with chef hat */}
              <div className="relative">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-recipe-green/10 animate-pulse"></div>
                  <ChefHat className="h-12 w-12 text-recipe-green animate-cooking-pot" />
                  
                  {/* Animated 'steam' effects */}
                  <div className="absolute -top-2 left-0">
                    <div className="h-2 w-2 rounded-full bg-recipe-green/60 animate-steam"></div>
                  </div>
                  <div className="absolute -top-1 right-0">
                    <div className="h-2 w-2 rounded-full bg-recipe-green/70 animate-steam delay-150"></div>
                  </div>
                  <div className="absolute -top-3 left-2">
                    <div className="h-3 w-3 rounded-full bg-recipe-green/50 animate-steam delay-300"></div>
                  </div>
                </div>
              </div>
              
              {/* Title and description */}
              <div>
                <h2 className="text-xl font-medium mb-1">Creating Your Recipe</h2>
                <p className="text-muted-foreground text-sm">
                  Our AI chef is crafting the perfect recipe for you...
                </p>
              </div>
            </div>
            
            {/* Enhanced loading progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">
                  {loadingState?.stepDescription || "Analyzing your ingredients..."}
                </span>
                <span className="text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  <span>{Math.ceil(loadingState?.percentComplete || 0)}%</span>
                </span>
              </div>
              
              <Progress
                value={loadingState?.percentComplete || 10}
                className="h-2 bg-gray-100 glow-recipe-green"
                indicatorClassName="bg-recipe-green animate-progress-pulse transition-all duration-500"
              />
            </div>
            
            {/* Cooking tip card with animation */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-8 max-w-sm mx-auto animate-float">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button with proper aria description */}
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
}
