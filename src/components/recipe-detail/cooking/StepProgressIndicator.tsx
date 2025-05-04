
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  completedPercentage?: number;
}

export function StepProgressIndicator({ 
  currentStep, 
  totalSteps,
  className,
  completedPercentage
}: StepProgressIndicatorProps) {
  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  
  // Determine color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage < 33) return 'bg-blue-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const indicatorColor = getProgressColor(progressPercentage);
  
  return (
    <Progress 
      value={completedPercentage ?? progressPercentage}
      className={className || "mt-2"} 
      indicatorClassName={indicatorColor}
    />
  );
}
