
import React, { memo } from 'react';
import { StepItem } from './StepItem';
import type { RecipeStep } from '@/types/recipe-steps';

interface StepsListProps {
  steps: RecipeStep[];
  compact?: boolean;
}

export const StepsList = memo(function StepsList({ steps, compact = false }: StepsListProps) {
  return (
    <ol className={`list-decimal pl-5 ${compact ? 'space-y-1' : 'space-y-2'}`}>
      {steps.map((step) => (
        <StepItem 
          key={step.index} 
          step={step}
          compact={compact}
        />
      ))}
    </ol>
  );
});
