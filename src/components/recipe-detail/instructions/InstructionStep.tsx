
import React, { memo } from 'react';
import { Separator } from '@/components/ui/separator';
import { StepDisplay } from '../common/StepDisplay';
import { StepReaction } from '@/hooks/use-recipe-science';
import type { StepCategory } from '../common/StepCategoryLabel';

interface InstructionStepProps {
  step: string;
  index: number;
  isCompleted: boolean;
  toggleStep: (index: number) => void;
  stepReaction: StepReaction | null;
  isLastStep: boolean;
}

// Use memo to prevent unnecessary re-renders
export const InstructionStep = memo(function InstructionStep({ 
  step, 
  index, 
  isCompleted, 
  toggleStep,
  stepReaction,
  isLastStep
}: InstructionStepProps) {
  const handleToggle = () => toggleStep(index);
  
  return (
    <li className="group">
      <StepDisplay
        stepNumber={index + 1}
        stepText={step}
        isCompleted={isCompleted}
        onToggleComplete={handleToggle}
        stepReaction={stepReaction}
        variant="instruction"
        stepCategory={stepReaction?.cooking_method as StepCategory | undefined}
      />
      
      {!isLastStep && <Separator className="my-6" />}
    </li>
  );
});
