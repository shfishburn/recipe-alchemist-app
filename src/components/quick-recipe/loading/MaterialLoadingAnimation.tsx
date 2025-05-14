
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChefTipProps {
  variant?: 'primary' | 'secondary';
}

const ChefTip = ({ variant = 'primary' }: ChefTipProps) => (
  <div className={cn(
    "mt-6 p-4 rounded-lg text-sm",
    variant === 'primary' 
      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300" 
      : "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
  )}>
    <div className="flex items-start gap-3">
      <ChefHat className="h-5 w-5 text-recipe-green flex-shrink-0 mt-0.5" />
      <p>
        <span className="font-medium block mb-1">Chef's Tip</span>
        Great recipes take time to prepare. Your culinary creation is being carefully crafted with precision.
      </p>
    </div>
  </div>
);

interface MaterialLoadingAnimationProps {
  progress: number;
  showChefTip?: boolean;
  variant?: 'primary' | 'secondary';
  timeoutWarning?: boolean;
  estimatedTimeRemaining?: number;
}

export const MaterialLoadingAnimation = ({
  progress,
  showChefTip = false,
  variant = 'primary',
  timeoutWarning = false,
  estimatedTimeRemaining
}: MaterialLoadingAnimationProps) => {
  // Format progress value for display
  const formattedProgress = `${Math.round(progress)}%`;

  return (
    <div className="space-y-4 w-full">
      {/* Progress indicator */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "relative w-24 h-24 mb-4 flex items-center justify-center",
          "bg-background rounded-full shadow-elevation-1 border border-gray-100 dark:border-gray-800"
        )}>
          <div className="absolute">
            <svg className="w-20 h-20">
              <circle 
                className="text-gray-100 dark:text-gray-800" 
                strokeWidth="4" 
                stroke="currentColor" 
                fill="transparent" 
                r="36" 
                cx="40" 
                cy="40" 
              />
              <circle 
                className="text-recipe-green" 
                strokeWidth="4" 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="36" 
                cx="40" 
                cy="40" 
                strokeDasharray={`${226 * (progress / 100)} 226`} 
                transform="rotate(-90 40 40)" 
              />
            </svg>
          </div>
          <span className="text-lg font-medium">{formattedProgress}</span>
        </div>
      </div>

      {/* Progress bar with Material Design styling */}
      <Progress 
        value={progress} 
        className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
        indicatorClassName="bg-recipe-green animate-progress-pulse" 
        aria-label="Recipe generation progress"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Estimated time remaining */}
      {estimatedTimeRemaining !== undefined && (
        <div className="text-center text-sm text-muted-foreground">
          Estimated time remaining: ~{estimatedTimeRemaining} seconds
        </div>
      )}
      
      {/* Timeout warning with ARIA attributes */}
      {timeoutWarning && (
        <div 
          className={cn(
            "p-3 rounded-lg text-sm bg-amber-50 dark:bg-amber-900/20",
            "border border-amber-200 dark:border-amber-800",
            "text-amber-800 dark:text-amber-300"
          )}
          role="alert"
          aria-live="polite"
        >
          <p className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            This is taking longer than usual. Please be patient...
          </p>
        </div>
      )}

      {/* Chef's tip */}
      {showChefTip && <ChefTip variant={variant} />}
    </div>
  );
};

export default MaterialLoadingAnimation;
