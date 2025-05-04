
import React, { memo } from 'react';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import type { RecipeStep } from '@/types/recipe-steps';

interface StepItemProps {
  step: RecipeStep;
  compact?: boolean;
}

export const StepItem = memo(function StepItem({ step, compact = false }: StepItemProps) {
  return (
    <li className={`${compact ? 'py-0.5' : 'py-1'}`}>
      <FormattedIngredientText text={step.text} />
    </li>
  );
});
