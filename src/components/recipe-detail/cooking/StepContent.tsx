
import React from 'react';
import { CookingStep } from './CookingStep';
import { Timer } from './Timer';
import type { RecipeStep } from '@/types/recipe-steps';

interface StepContentProps {
  currentStep: RecipeStep | null;
  timeRemaining: number | null;
  onToggleComplete: () => void;
  onStartTimer: (minutes: number) => void;
  onCancelTimer: () => void;
}

export function StepContent({ 
  currentStep, 
  timeRemaining, 
  onToggleComplete,
  onStartTimer,
  onCancelTimer
}: StepContentProps) {
  return (
    <div className="px-4 py-8">
      {currentStep && (
        <CookingStep
          step={currentStep}
          onToggleComplete={onToggleComplete}
        />
      )}
      
      <Timer
        timeRemaining={timeRemaining}
        onStart={onStartTimer}
        onCancel={onCancelTimer}
      />
    </div>
  );
}
