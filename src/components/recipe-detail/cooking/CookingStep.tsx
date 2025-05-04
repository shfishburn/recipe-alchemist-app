
import React from 'react';
import { StepDisplay } from '../common/StepDisplay';
import { StepReaction } from '@/hooks/use-recipe-science';
import type { StepCategory } from '../common/StepCategoryLabel';

interface CookingStepProps {
  stepNumber: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  stepReaction?: StepReaction | null;
  stepCategory?: StepCategory | string;
}

export function CookingStep({ 
  stepNumber, 
  instruction, 
  isCompleted, 
  onToggleComplete,
  stepReaction,
  stepCategory
}: CookingStepProps) {
  return (
    <div className="mb-6">
      <StepDisplay
        stepNumber={stepNumber}
        stepText={instruction}
        isCompleted={isCompleted}
        onToggleComplete={onToggleComplete}
        stepReaction={stepReaction}
        variant="cooking"
        stepCategory={stepCategory || stepReaction?.cooking_method}
      />
    </div>
  );
}
