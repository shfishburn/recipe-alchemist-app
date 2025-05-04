
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
  
  // Function to capitalize first letter of each word
  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get formatted quantity
  const formattedQuantity = formatQuantityWithUnit(item);
  
  // Get the display name for the item - prioritize structured data
  const rawDisplayName = item.item || 
    (item.text && item.text.replace(/^\d+(\.\d+)?\s*[a-zA-Z]*\s+/, '')) || 
    'Unknown item';
    
  // Filter out water items
  if (rawDisplayName.toLowerCase().trim() === 'water') {
    return null;
  }
  
  // Capitalize each word in the display name
  const displayName = capitalizeWords(rawDisplayName);

  return (
    <div 
      className="flex items-center gap-2 p-2 rounded-md touch-optimized tap-highlight hover:bg-muted/50"
      onClick={() => onToggle(index)}
    >
      <span className="break-words">
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
