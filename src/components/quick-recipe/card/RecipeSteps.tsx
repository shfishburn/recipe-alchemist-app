
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';

interface RecipeStepsProps {
  steps: string[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Quick Steps" />
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
