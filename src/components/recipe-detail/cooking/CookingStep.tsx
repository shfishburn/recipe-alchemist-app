
import React, { memo } from 'react';
import { StepDisplay } from '../common/StepDisplay';
import type { RecipeStep } from '@/types/recipe-steps';

export interface CookingStepProps {
  step: RecipeStep;
  onToggleComplete: () => void;
  className?: string;
}

export const CookingStep = memo(function CookingStep({ 
  step, 
  onToggleComplete,
  className
}: CookingStepProps) {
  return (
    <div className={cn("mb-6", className)}>
      <StepDisplay
        stepNumber={step.index + 1}
        stepText={step.text}
        isCompleted={step.isCompleted}
        onToggleComplete={onToggleComplete}
        stepReaction={step.reaction}
        variant="cooking"
        stepCategory={step.category}
      />
      
      {/* Display reaction details if available */}
      {step.reaction && step.reaction.reaction_details && step.reaction.reaction_details.length > 0 && (
        <div className="ml-8 mt-2 mb-3 text-sm">
          <div className="p-2 rounded bg-blue-50 border border-blue-100">
            {step.reaction.reaction_details[0]}
          </div>
        </div>
      )}
    </div>
  );
});

// Utility for className concatenation
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
