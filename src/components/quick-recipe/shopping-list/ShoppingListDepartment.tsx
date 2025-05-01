
import React from 'react';
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
  const [isOpen, setIsOpen] = React.useState(true);
  const checkedCount = items.filter(item => item.checked).length;
  
  // Get the department icon and color
  const DepartmentIcon = getDepartmentIcon(department);
  const departmentColorClass = getDepartmentColor(department);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger 
        className={`flex items-center justify-between w-full p-2 text-sm font-medium hover:bg-muted/50 rounded-md ${departmentColorClass}`}
      >
        <div className="flex items-center">
          {isOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          {DepartmentIcon && <DepartmentIcon className="h-4 w-4 mr-2" />}
          <span>{department}</span>
        </div>
        <span className="text-xs text-muted-foreground">{checkedCount}/{items.length}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-6 space-y-1">
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
