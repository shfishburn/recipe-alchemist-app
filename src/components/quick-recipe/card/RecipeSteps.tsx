
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';

interface RecipeStepsProps {
  steps: string[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Quick Steps" />
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index}>
            <FormattedIngredientText text={step} />
          </li>
        ))}
      </ol>
    </div>
  );
}
