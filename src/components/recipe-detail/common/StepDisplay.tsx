
import React, { memo, useCallback } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { StepReaction } from '@/hooks/use-recipe-science';
import { StepCategoryLabel, StepCategory } from './StepCategoryLabel';

export interface StepDisplayProps {
  stepNumber: number;
  stepText: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  variant?: 'cooking' | 'instruction';
  stepReaction?: StepReaction | null;
  stepCategory?: StepCategory | string;
  className?: string;
}

/**
 * Shared component for displaying recipe steps in both instruction and cooking views
 */
export const StepDisplay = memo(function StepDisplay({ 
  stepNumber,
  stepText,
  isCompleted,
  onToggleComplete,
  variant = 'instruction',
  stepReaction,
  stepCategory,
  className
}: StepDisplayProps) {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete();
  }, [onToggleComplete]);

  // Determine if we should show the category label based on its presence
  const showCategoryLabel = !!stepCategory;
  
  // Custom styles based on variant 
  const isCooking = variant === 'cooking';
  const textStyle = isCooking
    ? "text-base sm:text-lg"
    : "text-sm sm:text-base";
  
  const checkboxSize = isCooking ? "h-6 w-6" : "h-5 w-5";
  
  const stepNumberStyle = isCooking 
    ? "hidden" 
    : "text-muted-foreground font-medium mr-1.5";
    
  return (
    <div className={cn(
      "flex items-start gap-3", 
      isCompleted ? "text-muted-foreground" : "", 
      className
    )}>
      <button
        onClick={handleToggle}
        className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full"
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted ? (
          <CheckCircle2 className={cn(checkboxSize, "text-green-500")} />
        ) : (
          <Circle className={cn(checkboxSize, "text-muted-foreground")} />
        )}
      </button>
      
      <div className="flex-1">
        <div className={cn(
          "flex flex-wrap gap-2 items-start mb-1",
          textStyle
        )}>
          <span className={stepNumberStyle}>{stepNumber}.</span>
          <span className={cn(
            "flex-1", 
            isCompleted ? "line-through text-muted-foreground" : ""
          )}>
            {stepText}
          </span>
        </div>
        
        {showCategoryLabel && (
          <div className="mt-2">
            <StepCategoryLabel category={stepCategory} />
          </div>
        )}
      </div>
    </div>
  );
});

// Utility function for class name concatenation
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
