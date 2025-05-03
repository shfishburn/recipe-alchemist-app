
import React from 'react';
import { ShoppingItem } from './types';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Format quantity for display - use the structured data fields specifically designed for this
  let formattedQuantity = '';
  
  // Debug the quantity value to verify what we're receiving
  console.log('ShoppingListItem quantity data:', {
    qty: item.quantity,
    unit: item.unit,
    type: typeof item.quantity,
    originalItem: item
  });
  
  // Check if we have the structured quantity and unit fields
  if (item.quantity !== undefined && item.quantity !== null) {
    // Convert quantity to string regardless of whether it's a number or string
    formattedQuantity = String(item.quantity).trim();
    
    if (item.unit) {
      formattedQuantity += ` ${item.unit}`;
    }
  } 
  // Fallback to text-based parsing if needed (legacy format)
  else if (item.text && !item.item) {
    // If we only have text, we'll extract what we can
    const match = item.text.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
    if (match) {
      formattedQuantity = match[1];
      if (match[2]) formattedQuantity += ` ${match[2]}`;
    }
  }

  // Get the display name for the item
  const displayName = item.item || item.text || '';

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
        {displayName}
      </span>
      {item.pantryStaple && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded ml-auto">
          Pantry
        </span>
      )}
    </div>
  );
}
