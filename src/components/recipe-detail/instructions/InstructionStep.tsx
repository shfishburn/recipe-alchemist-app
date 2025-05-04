
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
      
      {/* Display science notes if available */}
      {step.scienceNotes && step.scienceNotes.length > 0 && (
        <div className="ml-8 mt-2 mb-3">
          {step.scienceNotes.map((note, i) => (
            <div 
              key={i} 
              className="text-sm text-recipe-blue bg-blue-50 p-2 rounded border border-blue-100 mb-1"
            >
              {note}
            </div>
          ))}
        </div>
      )}
      
      {/* Display reaction details if available */}
      {step.reaction && step.reaction.reaction_details && step.reaction.reaction_details.length > 0 && (
        <div className="ml-8 mt-2 mb-3 text-sm text-muted-foreground">
          <div className="p-2 rounded bg-gray-50 border border-gray-100">
            {step.reaction.reaction_details[0]}
          </div>
        </div>
      )}
      
      {!isLastStep && <Separator className="my-6" />}
    </li>
  );
});

// Import cn utility
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
