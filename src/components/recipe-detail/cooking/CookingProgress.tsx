
import React from 'react';
import { StepProgressIndicator } from './StepProgressIndicator';

interface CookingProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function CookingProgress({ currentStep, totalSteps, completedSteps }: CookingProgressProps) {
  const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className="text-sm text-muted-foreground">
          {completedSteps} of {totalSteps} steps completed
        </div>
      </div>
      <StepProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
    </div>
  );
}
