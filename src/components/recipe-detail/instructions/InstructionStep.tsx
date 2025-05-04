
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { StepDisplay } from '../common/StepDisplay';
import { StepReaction } from '@/hooks/use-recipe-science';

interface InstructionStepProps {
  step: string;
  index: number;
  isCompleted: boolean;
  toggleStep: (index: number) => void;
  stepReaction: StepReaction | null;
  isLastStep: boolean;
}

export function InstructionStep({ 
  step, 
  index, 
  isCompleted, 
  toggleStep,
  stepReaction,
  isLastStep
}: InstructionStepProps) {
  const handleToggleComplete = React.useCallback(() => {
    toggleStep(index);
  }, [toggleStep, index]);
  
  return (
    <li key={index} className="group">
      <StepDisplay
        stepNumber={index + 1}
        stepText={step}
        isCompleted={isCompleted}
        onToggleComplete={handleToggleComplete}
        stepReaction={stepReaction}
        variant="instruction"
      />
      
      {!isLastStep && (
        <Separator className="my-6" />
      )}
    </li>
  );
}
