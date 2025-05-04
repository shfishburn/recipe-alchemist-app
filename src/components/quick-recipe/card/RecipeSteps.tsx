
import React, { useMemo, memo } from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';

interface RecipeStepsProps {
  steps: string[];
}

export const RecipeSteps = memo(function RecipeSteps({ steps }: RecipeStepsProps) {
  // Use useMemo to avoid unnecessary re-evaluations
  const hasSteps = useMemo(() => steps && steps.length > 0, [steps]);
  
  if (!hasSteps) {
    return (
      <div>
        <RecipeSectionHeader title="Quick Steps" />
        <p className="text-muted-foreground">No steps available</p>
      </div>
    );
  }
  
  return (
    <div>
      <RecipeSectionHeader title="Quick Steps" />
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="py-1">
            <FormattedIngredientText text={step} />
          </li>
        ))}
      </ol>
    </div>
  );
});
