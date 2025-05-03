
import React from 'react';
import { ShoppingListDepartment } from './ShoppingListDepartment';
import { ShoppingListItem } from '@/types/shopping-list';

interface ShoppingListItemsViewProps {
  groupedItems: Record<string, ShoppingListItem[]>;
  expandedDepts: Record<string, boolean>;
  onToggleDept: (dept: string) => void;
  onToggleDepartmentItems: (department: string, checked: boolean) => Promise<void>;
  onToggleItem: (index: number) => Promise<void>;
  onDeleteItem: (index: number) => Promise<void>;
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
  return (
    <div className="space-y-1.5 max-w-full overflow-hidden">
      {Object.entries(groupedItems).map(([department, items]) => {
        if (items.length === 0) return null;
        
        const isExpanded = expandedDepts[department] !== false; // Default to true
        
        return (
          <ShoppingListDepartment
            key={department}
            department={department}
            items={items}
            isExpanded={isExpanded}
            onToggleExpand={() => onToggleDept(department)}
            onToggleDepartment={onToggleDepartmentItems}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            getItemIndexInList={getItemIndex}
          />
        );
      })}
    </div>
  );
}
