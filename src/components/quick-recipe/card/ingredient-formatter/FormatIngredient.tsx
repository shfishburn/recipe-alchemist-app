
import React from 'react';
import { Ingredient } from '@/types/quick-recipe';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { FormattedItem } from '@/components/common/formatted-item/FormattedItem';

interface FormatIngredientProps {
  ingredient: Ingredient;
}

export function FormatIngredient({ ingredient }: FormatIngredientProps) {
  // Use the store directly to avoid circular dependency
  const { unitSystem } = useUnitSystemStore();
  
  // Handle invalid/malformed ingredient data
  if (!ingredient) {
    return <span className="text-red-500">Missing ingredient</span>;
  }
  
  // Improved type checking - handle arrays and other non-object types
  if (!ingredient || typeof ingredient !== 'object' || Array.isArray(ingredient)) {
    return <span>{String(ingredient)}</span>;
  }

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
