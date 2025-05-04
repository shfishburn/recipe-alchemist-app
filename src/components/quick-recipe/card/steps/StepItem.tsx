
import React, { memo } from 'react';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import type { RecipeStep } from '@/types/recipe-steps';

interface StepItemProps {
  step: RecipeStep;
  compact?: boolean;
  className?: string;
}

export const StepItem = memo(function StepItem({ 
  step, 
  compact = false,
  className 
}: StepItemProps) {
  const itemClasses = [
    compact ? 'py-0.5' : 'py-1',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <li className={itemClasses}>
      <FormattedIngredientText text={step.text} />
    </li>
  );
});
