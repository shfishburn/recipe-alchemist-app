
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ShoppingListItem } from '@/types/shopping-list';
import { ShoppingListItemView } from './ShoppingListItemView';

interface ShoppingListItemsViewProps {
  groupedItems: Record<string, ShoppingListItem[]>;
  expandedDepts: Record<string, boolean>;
  onToggleDept: (dept: string) => void;
  onToggleItem: (index: number) => void;
  onDeleteItem: (index: number) => void;
  getItemIndex: (item: ShoppingListItem) => number;
}

export function ShoppingListItemsView({
  groupedItems,
  expandedDepts,
  onToggleDept,
  onToggleItem,
  onDeleteItem,
  getItemIndex
}: ShoppingListItemsViewProps) {
  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg bg-gray-50/50">
        <p className="text-base text-muted-foreground">No items in this shopping list yet.</p>
        <p className="text-sm mt-2 text-muted-foreground">
          Use the "Add New Item" button below to start adding items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(groupedItems).map(([department, items]) => {
        const isExpanded = expandedDepts[department] !== false;
        const itemCount = items.length;
        
        return (
          <div key={department} className="rounded-lg overflow-hidden border shadow-sm">
            <div 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 cursor-pointer"
              onClick={() => onToggleDept(department)}
            >
              <div className="flex items-center">
                {isExpanded ? 
                  <ChevronDown className="h-5 w-5 text-green-600 mr-2" /> : 
                  <ChevronUp className="h-5 w-5 text-green-600 mr-2" />
                }
                <div>
                  <h3 className="font-medium text-green-800">{department}</h3>
                  <p className="text-xs text-green-700">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="divide-y divide-gray-100 bg-white">
                {items.map((item) => (
                  <ShoppingListItemView 
                    key={`${item.name}-${item.unit}-${item.quantity}`}
                    item={item}
                    onToggle={() => onToggleItem(getItemIndex(item))}
                    onDelete={() => onDeleteItem(getItemIndex(item))}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
