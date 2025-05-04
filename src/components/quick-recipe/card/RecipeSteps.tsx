
import React, { useMemo, memo } from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { StepsList } from './steps/StepsList';
import { EmptySteps } from './steps/EmptySteps';
import type { RecipeStep } from '@/types/recipe-steps';

interface RecipeStepsProps {
  steps: string[];
  className?: string;
  compact?: boolean;
}

export const RecipeSteps = memo(function RecipeSteps({ 
  steps, 
  className,
  compact = false
}: RecipeStepsProps) {
  // Use useMemo to avoid unnecessary re-evaluations
  const hasSteps = useMemo(() => steps && steps.length > 0, [steps]);
  
  // Create formatted step objects from raw step strings
  const formattedSteps = useMemo(() => {
    if (!hasSteps) return [];
    
    return steps.map((text, index) => ({
      text,
      index,
      isCompleted: false
    } as RecipeStep));
  }, [steps, hasSteps]);
  
  return (
    <div className={className}>
      <RecipeSectionHeader title="Quick Steps" />
      {hasSteps ? (
        <StepsList steps={formattedSteps} compact={compact} />
      ) : (
        <EmptySteps />
      )}
    </div>
  );
});
