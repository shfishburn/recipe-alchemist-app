
import React from 'react';
import { ShoppingItem } from './types';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Format quantity for display
  const quantityText = item.quantity ? `${item.quantity}` : '';
  const unitText = item.unit ? `${item.unit}` : '';
  const formattedQuantity = [quantityText, unitText].filter(Boolean).join(' ');

  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded-md touch-optimized tap-highlight ${
        item.checked ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-muted/50'
      }`}
      onClick={() => onToggle(index)}
    >
      <div className="flex-none w-5 h-5 flex items-center justify-center">
        <div className={`w-4 h-4 rounded border ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
          {item.checked && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
        {formattedQuantity && <strong className="mr-1">{formattedQuantity}</strong>}
        {item.item || item.text}
      </span>
      {item.pantryStaple && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded ml-auto">
          Pantry
        </span>
      )}
    </div>
  );
}
