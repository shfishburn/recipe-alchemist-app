
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgressIndicator({ 
  currentStep, 
  totalSteps,
  className 
}: StepProgressIndicatorProps) {
  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  
  return (
    <Progress 
      value={progressPercentage} 
      className={className || "mt-2"} 
    />
  );
}
