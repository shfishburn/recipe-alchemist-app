
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Check, Plus } from 'lucide-react';
import type { ShoppingListItem } from '@/types/shopping-list';
import { ShoppingListItemView } from './ShoppingListItemView';

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
  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="py-6 text-center border rounded-md bg-muted/20">
        <p className="text-base text-muted-foreground">No items in this shopping list yet.</p>
        <p className="text-sm mt-2 text-muted-foreground">
          Use the "Add New Item" button below to start adding items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {Object.entries(groupedItems).map(([department, items]) => {
        const isExpanded = expandedDepts[department] !== false;
        const allChecked = items.every(item => item.checked);
        
        return (
          <div key={department} className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-muted/30">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 h-8 w-8 p-0 rounded-full"
                  onClick={() => onToggleDept(department)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'} {department}</span>
                </Button>
                
                <div>
                  <h3 className="font-medium text-base">{department}</h3>
                  <p className="text-sm text-muted-foreground">
                    {items.filter(i => i.checked).length} of {items.length} complete
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Button
                  variant={allChecked ? "outline" : "default"}
                  size="sm"
                  className="h-8 px-3 text-sm"
                  onClick={() => onToggleDepartmentItems(department, !allChecked)}
                >
                  {allChecked ? (
                    <>
                      <Plus className="h-4 w-4 mr-1" /> 
                      <span>Uncheck All</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" /> 
                      <span>Complete All</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isExpanded && (
              <div className="p-2 space-y-1">
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
