
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X } from 'lucide-react';
import '@/styles/loading.css';
import { cn } from '@/lib/utils';
import { MaterialLoadingAnimation } from './loading/MaterialLoadingAnimation';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
  timeoutWarning?: boolean;
  progress?: number;
  estimatedTimeRemaining?: number;
}

export function QuickRecipeLoading({ 
  onCancel, 
  timeoutWarning = false,
  progress = 65,
  estimatedTimeRemaining
}: QuickRecipeLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden">
      <div className={cn(
        "flex flex-col items-center justify-center space-y-6 p-6 w-full max-w-lg mx-auto",
        "rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border border-gray-100 dark:border-gray-800",
        "shadow-elevation-1"
      )}>
        {/* Material Design Loading Animation with dynamic progress */}
        <MaterialLoadingAnimation 
          progress={progress} 
          showChefTip={true}
          timeoutWarning={timeoutWarning}
          estimatedTimeRemaining={estimatedTimeRemaining}
        />
        
        {/* Main heading - Material typography */}
        <h2 className="text-xl font-medium">
          Creating your recipe...
        </h2>
        
        {/* Progress bar with Material Design animation and proper ARIA attributes */}
        <div className="w-full">
          <Progress 
            value={progress} 
            className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            indicatorClassName="bg-primary animate-progress-pulse"
            aria-label="Recipe creation progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        
        {/* Timeout warning - Material Design alert with proper ARIA attributes */}
        {timeoutWarning && (
          <div 
            className={cn(
              "flex items-center gap-2 w-full",
              "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400",
              "py-3 px-4 rounded-lg text-sm"
            )}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Tip card - Material Design card */}
        <div className={cn(
          "w-full rounded-lg",
          "bg-background border border-gray-100 dark:border-gray-800",
          "shadow-sm p-4"
        )}>
          <h4 className="text-base font-medium mb-2">Chef's Tip</h4>
          <p className="text-sm text-muted-foreground">
            Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
          </p>
        </div>
        
        {/* Cancel button - Material Design button with ARIA attributes */}
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className={cn(
            "text-muted-foreground hover:text-foreground mt-2",
            "relative overflow-hidden"
          )}
          aria-label="Cancel recipe generation"
        >
          <span>Cancel</span>
          {/* Material ripple effect */}
          <span className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity rounded-md" />
        </Button>
      </div>
    </div>
  );
}

export default QuickRecipeLoading;
