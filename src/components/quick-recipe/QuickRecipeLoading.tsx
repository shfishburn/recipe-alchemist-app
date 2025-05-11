
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { RecipeLoadingAnimation } from './loading/RecipeLoadingAnimation';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
  timeoutWarning?: boolean;
}

export function QuickRecipeLoading({ onCancel, timeoutWarning = false }: QuickRecipeLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6 w-full">
        {/* Chef hat animation */}
        <div className="relative h-24 w-24" aria-hidden="true">
          <RecipeLoadingAnimation />
        </div>
        
        {/* Personalized message with animation */}
        <h2 className="text-lg font-semibold animate-fade-in">
          Creating your recipe...
        </h2>
        
        {/* Step description with animation */}
        <div aria-live="polite">
          <p className="text-sm text-muted-foreground animate-pulse">
            Analyzing your ingredients...
          </p>
        </div>
        
        {/* Simple progress indicator */}
        <Progress 
          value={65} 
          className="w-full"
          aria-hidden="true"
        />
        
        {/* Timeout warning - conditionally rendered */}
        {timeoutWarning && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg w-full animate-fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Tip card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 w-full animate-fade-in">
          <h4 className="text-base font-semibold mb-2">Chef's Tip</h4>
          <p className="text-sm text-muted-foreground">
            Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
          </p>
        </div>
        
        {/* Cancel button */}
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="text-muted-foreground hover:text-foreground animate-fade-in"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
