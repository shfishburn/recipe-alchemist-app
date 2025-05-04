
import React, { memo, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { StepDisplay } from '../common/StepDisplay';
import type { RecipeStep, StepToggleHandler } from '@/types/recipe-steps';

interface InstructionStepProps {
  step: RecipeStep;
  isLastStep: boolean;
  toggleStep: StepToggleHandler;
  className?: string;
}

// Use memo to prevent unnecessary re-renders
export const InstructionStep = memo(function InstructionStep({ 
  step, 
  isLastStep,
  toggleStep,
  className
}: InstructionStepProps) {
  // Memoize the toggle handler to prevent recreation on each render
  const handleToggle = useCallback(() => toggleStep(step.index), [toggleStep, step.index]);
  
  return (
    <li className={cn("group", className)}>
      <StepDisplay
        stepNumber={step.index + 1}
        stepText={step.text}
        isCompleted={step.isCompleted}
        onToggleComplete={handleToggle}
        stepReaction={step.reaction}
        variant="instruction"
        stepCategory={step.category}
      />
      
      {!isLastStep && <Separator className="my-6" />}
    </li>
  );
});

// Import cn utility
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
