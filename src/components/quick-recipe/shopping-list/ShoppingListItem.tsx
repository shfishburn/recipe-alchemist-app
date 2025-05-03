
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
  
  // Add detailed debug information for troubleshooting quantity issues
  console.log('ShoppingListItem rendering with data:', {
    item,
    index,
    quantityType: typeof item.quantity,
    hasItem: !!item.item,
    hasText: !!item.text
  });
  
  // Enhanced quantity formatting logic
  if (item.quantity !== undefined && item.quantity !== null) {
    // Handle both numeric and string quantities
    const qtyValue = typeof item.quantity === 'number' 
      ? item.quantity 
      : (typeof item.quantity === 'string' && parseFloat(item.quantity) > 0)
        ? parseFloat(item.quantity)
        : null;
        
    if (qtyValue !== null && qtyValue > 0) {
      // Format with precision to avoid unnecessary decimal places
      formattedQuantity = (qtyValue % 1 === 0) 
        ? String(Math.round(qtyValue))  // Integer values
        : qtyValue.toString();          // Keep decimals
      
      // Add the unit if available
      if (item.unit) {
        formattedQuantity += ` ${item.unit}`;
      }
    }
  } 
  // Fallback to text-based parsing if needed (legacy format)
  else if (item.text && !item.item) {
    // Try to extract quantity and unit from text format
    const match = item.text.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
    if (match) {
      formattedQuantity = match[1];
      if (match[2]) formattedQuantity += ` ${match[2]}`;
    }
  }

  // Get the display name for the item - prioritize structured data
  const displayName = item.item || 
    (item.text && item.text.replace(/^\d+(\.\d+)?\s*[a-zA-Z]*\s+/, '')) || 
    'Unknown item';

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
