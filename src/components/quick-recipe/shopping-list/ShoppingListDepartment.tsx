
import React, { useState } from 'react';
import { ShoppingItem } from './types';
import { ShoppingListItem } from './ShoppingListItem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getDepartmentIcon, getDepartmentColor } from '@/components/shopping-list/detail/department-utils';

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
  const [isOpen, setIsOpen] = useState(true);
  const checkedCount = items.filter(item => item.checked).length;
  
  // Get the department icon and color
  const DepartmentIcon = getDepartmentIcon(department);
  const departmentColorClass = getDepartmentColor(department);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1.5">
      <CollapsibleTrigger 
        className={`flex items-center justify-between w-full p-2.5 text-sm font-medium hover:bg-muted/50 rounded-md ${departmentColorClass} touch-target transition-colors`}
      >
        <div className="flex items-center">
          {isOpen ? <ChevronDown className="h-4 w-4 mr-1.5" /> : <ChevronRight className="h-4 w-4 mr-1.5" />}
          {DepartmentIcon && <DepartmentIcon className="h-4 w-4 mr-2" />}
          <span className="truncate">{department}</span>
        </div>
        <span className="text-xs bg-white/50 px-1.5 py-0.5 rounded-full">
          {checkedCount}/{items.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="animate-accordion-down">
        <div className="pl-6 space-y-1.5 py-1">
          {items.map((item) => (
            <ShoppingListItem 
              key={itemIndices[item.text]} 
              item={item} 
              index={itemIndices[item.text]} 
              onToggle={onToggleItem} 
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
