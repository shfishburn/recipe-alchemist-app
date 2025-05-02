
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ onCancel, onRetry, error }: FullScreenLoadingProps) {
  const { loadingState } = useQuickRecipeStore();
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Add proper accessibility labels */}
      <h1 className="sr-only">Recipe Generation Loading Screen</h1>
      
      <div className="w-full max-w-md mx-auto text-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            {/* Add accessible title */}
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
            {/* Add accessible title */}
            <h2 className="mb-4 text-xl font-semibold">Creating Your Recipe</h2>
            <p className="text-muted-foreground mb-8">
              Our AI chef is crafting your recipe...
            </p>
            
            {/* Animated loading indicator */}
            <div className="relative my-12">
              {/* Center spinner with colored circle animation */}
              <div className="relative mx-auto w-16 h-16">
                <div className="animate-ping absolute inset-0 rounded-full bg-recipe-green opacity-75"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-recipe-green/20">
                  <span className="block h-8 w-8 border-4 border-t-recipe-blue border-recipe-green/30 rounded-full animate-spin"></span>
                </div>
              </div>
            </div>
            
            {/* Loading status */}
            <div className="mb-6">
              <p className="text-sm font-medium">
                {loadingState?.stepDescription || "Analyzing your ingredients..."}
              </p>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                <div 
                  className="h-2 bg-recipe-green rounded-full transition-all duration-300"
                  style={{ width: `${loadingState?.percentComplete || 10}%` }}
                ></div>
              </div>
            </div>
            
            {/* Cooking tip card */}
            <div className="mt-8">
              <LoadingTipCard />
            </div>
            
            {/* Cancel button with proper aria description */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="mt-6 text-muted-foreground"
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
