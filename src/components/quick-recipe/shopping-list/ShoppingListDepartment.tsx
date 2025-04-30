
import React from 'react';
import { ShoppingItem } from './types';
import { ShoppingListItem } from './ShoppingListItem';

interface ShoppingListDepartmentProps {
  department: string;
  items: ShoppingItem[];
  onToggleItem: (index: number) => void;
  itemIndices: Record<string, number>;
}

export function ShoppingListDepartment({ 
  department, 
  items, 
  onToggleItem,
  itemIndices
}: ShoppingListDepartmentProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">{department}</h3>
      {items.map((item) => (
        <ShoppingListItem 
          key={itemIndices[item.text]} 
          item={item} 
          index={itemIndices[item.text]} 
          onToggle={onToggleItem} 
        />
      ))}
    </div>
  );
}
