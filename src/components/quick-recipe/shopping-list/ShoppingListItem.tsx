
import React from 'react';
import { ShoppingItem } from './types';
import { FormattedItem } from '@/components/common/formatted-item/FormattedItem';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Filter out water items
  if (item.item && item.item.toLowerCase().trim() === 'water') {
    return null;
  }
  
  return (
    <div 
      className="flex items-center gap-2 p-2 rounded-md touch-optimized tap-highlight hover:bg-muted/50"
      onClick={() => onToggle(index)}
    >
      <FormattedItem 
        item={item}
        options={{
          highlight: 'name',
          strikethrough: item.checked
        }}
      />
      
      {item.pantryStaple && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full ml-auto whitespace-nowrap">
          Pantry
        </span>
      )}
    </div>
  );
}
