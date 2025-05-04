
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
        const allChecked = items.every(item => item.checked);
        const someChecked = items.some(item => item.checked);
        const completedCount = items.filter(i => i.checked).length;
        
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
                    {completedCount} of {items.length} complete
                  </p>
                </div>
              </div>
              
              <Button
                variant={allChecked ? "outline" : "default"}
                size="sm"
                className={`h-9 px-3 text-sm ${allChecked ? 'bg-white text-green-700 border-green-300 hover:bg-green-50' : 'bg-green-600 hover:bg-green-700'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDepartmentItems(department, !allChecked);
                }}
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
