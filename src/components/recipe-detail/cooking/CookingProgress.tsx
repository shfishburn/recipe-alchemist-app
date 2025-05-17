
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CookingProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function CookingProgress({ currentStep = 0, totalSteps = 1, completedSteps = 0 }: CookingProgressProps) {
  // Ensure all values are valid numbers
  const safeCurrentStep = typeof currentStep === 'number' && !isNaN(currentStep) ? Math.max(0, currentStep) : 0;
  const safeTotalSteps = typeof totalSteps === 'number' && !isNaN(totalSteps) && totalSteps > 0 ? totalSteps : 1;
  const safeCompletedSteps = typeof completedSteps === 'number' && !isNaN(completedSteps) ? 
    Math.max(0, Math.min(safeTotalSteps, completedSteps)) : 0;
  
  // Calculate percentages safely
  const progressPercentage = (safeCurrentStep + 1) / safeTotalSteps * 100;
  const completionPercentage = safeCompletedSteps / safeTotalSteps * 100;

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Step {safeCurrentStep + 1} of {safeTotalSteps}</div>
        <div>{safeCompletedSteps} of {safeTotalSteps} steps completed</div>
      </div>
      <Progress 
        value={progressPercentage} 
        className="w-full" 
        aria-label={`Step ${safeCurrentStep + 1} of ${safeTotalSteps}`}
      />
    </div>
  );
}
