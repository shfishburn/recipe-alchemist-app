
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  loadingState: {
    percentComplete: number;
    stepDescription: string;
  };
  showTimeout: boolean;
  showFinalAnimation: boolean;
}

export function ProgressIndicator({ loadingState, showTimeout, showFinalAnimation }: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold animate-fade-in">
        {showFinalAnimation ? "Recipe ready!" : "Creating Your Recipe"}
      </h2>
      
      <p className="text-sm text-muted-foreground">
        {showFinalAnimation 
          ? "Your recipe has been created." 
          : loadingState.stepDescription || "Processing your request..."}
      </p>
      
      {/* Enhanced progress indicator with gradient */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-recipe-green to-recipe-blue transition-all duration-300 ease-out rounded-full"
          style={{ width: `${loadingState.percentComplete || 10}%` }}
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
  );
}
