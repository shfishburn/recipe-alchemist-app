
import React from 'react';
import { Button } from '@/components/ui/button';
import { RecipeLoadingAnimation } from './RecipeLoadingAnimation';
import { ProgressIndicator } from './ProgressIndicator';
import { LoadingTipCard } from './LoadingTipCard';

interface LoadingContainerProps {
  loadingState: {
    percentComplete: number;
    stepDescription: string;
    isStalled?: boolean;
  };
  showTimeout: boolean;
  showFinalAnimation: boolean;
  onCancel?: () => void;
}

export function LoadingContainer({ 
  loadingState, 
  showTimeout, 
  showFinalAnimation,
  onCancel 
}: LoadingContainerProps) {
  return (
    <>
      {/* Main loading animation */}
      <div className="flex flex-col items-center space-y-6 mb-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 w-full">
        <RecipeLoadingAnimation 
          showFinalAnimation={showFinalAnimation}
          isStalled={loadingState.isStalled} 
        />
        <ProgressIndicator 
          loadingState={loadingState} 
          showTimeout={showTimeout} 
          showFinalAnimation={showFinalAnimation} 
        />
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
  );
}
