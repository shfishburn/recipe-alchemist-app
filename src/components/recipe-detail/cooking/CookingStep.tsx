
import React from 'react';
import { StepDisplay } from '../common/StepDisplay';
import { StepReaction } from '@/hooks/use-recipe-science';

interface CookingStepProps {
  stepNumber: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  stepReaction?: StepReaction | null;
}

export function CookingStep({ 
  stepNumber, 
  instruction, 
  isCompleted, 
  onToggleComplete,
  stepReaction
}: CookingStepProps) {
  return (
    <div className="mb-4">
      <StepDisplay
        stepNumber={stepNumber}
        stepText={instruction}
        isCompleted={isCompleted}
        onToggleComplete={onToggleComplete}
        stepReaction={stepReaction}
        variant="cooking"
      />
    </div>
  );
}
