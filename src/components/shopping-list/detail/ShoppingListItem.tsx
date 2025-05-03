
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/shopping-list';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  index: number;
  onToggle: (index: number) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}

export function ShoppingListItem({ item, index, onToggle, onDelete }: ShoppingListItemProps) {
  // Format quantities for display
  const displayQuantity = formatQuantityForDisplay(item.quantity, item.unit);
  const displayShopQuantity = item.shop_size_qty 
    ? formatQuantityForDisplay(item.shop_size_qty, item.shop_size_unit)
    : null;
  
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
      <div 
        className="flex-1 flex items-start gap-2 cursor-pointer"
        onClick={() => onToggle(index)}
      >
        <div className="flex-none pt-1">
          <div 
            className={`w-5 h-5 rounded-sm border ${
              item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
            } flex items-center justify-center`}
          >
            {item.checked && (
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        
        <div className={`flex-1 ${item.checked ? 'text-gray-400 line-through' : ''}`}>
          {/* If we have shop size quantity, show it as primary */}
          {displayShopQuantity ? (
            <>
              <div>
                <span className="font-medium">{displayShopQuantity}</span> {item.name}
                {item.notes && <span className="text-gray-500 text-sm"> ({item.notes})</span>}
              </div>
              {/* Show original recipe amount as a note */}
              <div className="text-xs text-gray-500">
                Recipe calls for: {displayQuantity}
              </div>
            </>
          ) : (
            <>
              <span className="font-medium">{displayQuantity}</span> {item.name}
              {item.notes && <span className="text-gray-500 text-sm"> ({item.notes})</span>}
            </>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
        onClick={() => onDelete(index)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  );
}

// Helper function to format quantity with unit for display
function formatQuantityForDisplay(quantity: number, unit: string): string {
  if (!quantity || quantity === 0) return '';
  
  // Format fractions nicely
  let formattedQty = '';
  if (Number.isInteger(quantity)) {
    formattedQty = quantity.toString();
  } else {
    // Round to 2 decimal places
    formattedQty = (Math.round(quantity * 100) / 100).toString();
  }
  
  return unit ? `${formattedQty} ${unit}` : formattedQty;
}
