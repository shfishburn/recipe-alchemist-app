
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CookingProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function CookingProgress({ currentStep, totalSteps, completedSteps }: CookingProgressProps) {
  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="flex justify-between items-center mt-2">
      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>
      <div className="text-sm text-muted-foreground">
        {completedSteps} of {totalSteps} steps completed
      </div>
      <Progress value={progressPercentage} className="mt-2" />
    </div>
  );
}
