
import React, { useMemo, memo } from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';

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
  
  // Memoize the step content to prevent recreation on each render
  const stepsContent = useMemo(() => {
    if (!hasSteps) {
      return (
        <p className="text-muted-foreground">No steps available</p>
      );
    }
    
    return (
      <ol className={`list-decimal pl-5 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        {steps.map((step, index) => (
          <li key={index} className={`${compact ? 'py-0.5' : 'py-1'}`}>
            <FormattedIngredientText text={step} />
          </li>
        ))}
      </ol>
    );
  }, [steps, hasSteps, compact]);
  
  return (
    <div className={className}>
      <RecipeSectionHeader title="Quick Steps" />
      {stepsContent}
    </div>
  );
});
