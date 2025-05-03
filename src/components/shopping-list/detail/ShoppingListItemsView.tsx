
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ShoppingBag, Check, Circle } from 'lucide-react';
import type { ShoppingListItem } from '@/types/shopping-list';
import { ShoppingItemComponent } from './ShoppingListItem';

interface ShoppingListItemsViewProps {
  groupedItems: Record<string, ShoppingListItem[]>;
  expandedDepts: Record<string, boolean>;
  onToggleDept: (dept: string) => void;
  onToggleDepartmentItems: (dept: string, checked: boolean) => void;
  onToggleItem: (index: number) => void;
  onDeleteItem: (index: number) => void;
  getItemIndex: (item: ShoppingListItem) => number;
}

export function ShoppingListItemsView({
  groupedItems,
  expandedDepts,
  onToggleDept,
  onToggleDepartmentItems,
  onToggleItem,
  onDeleteItem,
  getItemIndex
}: ShoppingListItemsViewProps) {
  // Check if there are any items
  const hasItems = Object.keys(groupedItems).length > 0;
  
  if (!hasItems) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-3">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No items in this shopping list.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add items using the form below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([department, items]) => {
        const isExpanded = expandedDepts[department];
        const allChecked = items.every(item => item.checked);
        const someChecked = items.some(item => item.checked);
        
        return (
          <div key={department} className="border rounded-md">
            {/* Department header */}
            <div className="flex items-center justify-between p-2 bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleDept(department)}
                className="p-1 h-auto hover:bg-transparent text-left flex-1 flex justify-between items-center"
              >
                <span className="font-medium">{department} ({items.length})</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-1 h-8 w-8"
                onClick={() => onToggleDepartmentItems(department, !allChecked)}
              >
                {allChecked ? (
                  <Check className="h-4 w-4" />
                ) : someChecked ? (
                  <div className="h-4 w-4 border-2 rounded-sm bg-primary/30"></div>
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Department items */}
            {isExpanded && (
              <div className="p-2 space-y-1">
                {items.map((item) => (
                  <ShoppingItemComponent
                    key={`${item.name}-${item.unit}-${getItemIndex(item)}`}
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
