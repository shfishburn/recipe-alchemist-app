
import React from 'react';
import { ShoppingItem } from './types';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Format quantity for display 
  const formatQuantityWithUnit = (item: ShoppingItem): string => {
    // Handle cases where quantity is missing
    if (item.quantity === undefined || item.quantity === null) {
      return '';
    }
    
    // Convert to number if it's a string
    const qtyValue = typeof item.quantity === 'number' 
      ? item.quantity 
      : parseFloat(item.quantity);
      
    // Check if it's a valid number
    if (isNaN(qtyValue) || qtyValue === 0) {
      return '';
    }
    
    // Format with precision: whole numbers as integers, decimals with 1 decimal place
    const formattedQty = Number.isInteger(qtyValue) ? qtyValue.toString() : qtyValue.toFixed(1);
    
    // Add the unit if available
    return item.unit ? `${formattedQty} ${item.unit}` : formattedQty;
  };
  
  // Get formatted quantity
  const formattedQuantity = formatQuantityWithUnit(item);
  
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
      <span className={`${item.checked ? 'line-through text-muted-foreground' : ''} break-words`}>
        {formattedQuantity && <strong className="mr-1">{formattedQuantity}</strong>}
        {displayName}
        {item.notes && <span className="text-sm text-muted-foreground ml-1 break-words">({item.notes})</span>}
      </span>
      {item.pantryStaple && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full ml-auto whitespace-nowrap">
          Pantry
        </span>
      )}
    </div>
  );
}
