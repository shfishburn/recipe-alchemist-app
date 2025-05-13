
import React from 'react';
import { Ingredient } from '@/hooks/use-quick-recipe';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { FormattedItem } from '@/components/common/formatted-item/FormattedItem';

interface FormatIngredientProps {
  ingredient: Ingredient;
}

export function FormatIngredient({ ingredient }: FormatIngredientProps) {
  // Use the store directly to avoid circular dependency
  const { unitSystem } = useUnitSystemStore();

  return (
    <FormattedItem 
      item={ingredient}
      options={{
        highlight: 'name',
        unitSystem
      }}
    />
  );
}
