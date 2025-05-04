
import React, { memo } from 'react';
import { StepDisplay, type StepDisplayProps } from '../common/StepDisplay';
import { StepReaction } from '@/hooks/use-recipe-science';
import type { StepCategory } from '../common/StepCategoryLabel';

export interface CookingStepProps {
  stepNumber: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  stepReaction?: StepReaction | null;
  stepCategory?: StepCategory | string;
  className?: string;
}

export const CookingStep = memo(function CookingStep({ 
  stepNumber, 
  instruction, 
  isCompleted, 
  onToggleComplete,
  stepReaction,
  stepCategory,
  className
}: CookingStepProps) {
  // We derive stepCategory from stepReaction if it's not explicitly provided
  const effectiveStepCategory = stepCategory || (stepReaction?.cooking_method as StepCategory | undefined);
  
  return (
    <div className={cn("mb-6", className)}>
      <StepDisplay
        stepNumber={stepNumber}
        stepText={instruction}
        isCompleted={isCompleted}
        onToggleComplete={onToggleComplete}
        stepReaction={stepReaction}
        variant="cooking"
        stepCategory={effectiveStepCategory}
      />
    </div>
  );
});

// Utility for className concatenation
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
