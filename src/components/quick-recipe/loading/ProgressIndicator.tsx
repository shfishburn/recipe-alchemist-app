
import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface ProgressIndicatorProps {
  loadingState: {
    percentComplete: number;
    stepDescription: string;
    isStalled?: boolean;
  };
  showTimeout: boolean;
  showFinalAnimation: boolean;
}

export function ProgressIndicator({ loadingState, showTimeout, showFinalAnimation }: ProgressIndicatorProps) {
  const isStalled = loadingState.isStalled || false;
  
  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold animate-fade-in">
        {showFinalAnimation ? "Recipe ready!" : "Creating Your Recipe"}
      </h2>
      
      <p className="text-sm text-muted-foreground">
        {showFinalAnimation 
          ? "Your recipe has been created." 
          : isStalled 
            ? "Generating complex recipe details..." 
            : loadingState.stepDescription || "Processing your request..."}
      </p>
      
      {/* Enhanced progress indicator with gradient and stalled state */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ease-out rounded-full
            ${isStalled 
              ? 'bg-amber-400 animate-pulse w-2/3'
              : 'bg-gradient-to-r from-recipe-green to-recipe-blue animate-progress-pulse'}`}
          style={{ width: isStalled ? undefined : `${loadingState.percentComplete || 10}%` }}
        />
      </div>
      
      {/* Stalled state indicator */}
      {isStalled && !showFinalAnimation && (
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-sm py-1 px-2 rounded-lg animate-fade-in">
          <Clock className="h-4 w-4 animate-spin-slow" />
          <span>Our AI is working hard on your recipe...</span>
        </div>
      )}
      
      {/* Timeout warning */}
      {showTimeout && !showFinalAnimation && (
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2 w-full animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <span>This is taking longer than usual. Please be patient...</span>
        </div>
      )}
    </div>
  );
}
