
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingItem } from './types';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  return (
    <div className="flex items-start gap-2 p-2 bg-muted/40 rounded-md">
      <Checkbox 
        id={`item-${index}`}
        checked={item.checked}
        onCheckedChange={() => onToggle(index)}
      />
      <label 
        htmlFor={`item-${index}`}
        className={`text-sm flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
      >
        {item.text}
        {item.pantryStaple && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
            Pantry Staple
          </span>
        )}
      </label>
    </div>
  );
}
