
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { ShoppingListItem } from '@/types/shopping-list';

interface ShoppingListDepartmentProps {
  department: string;
  items: ShoppingListItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (itemIndex: number) => Promise<void>;
  onToggleDepartment: (department: string, checked: boolean) => Promise<void>;
  onDeleteItem: (itemIndex: number) => Promise<void>;
  getItemIndexInList: (item: ShoppingListItem) => number;
}

export function ShoppingListDepartment({
  department,
  items,
  isExpanded,
  onToggleExpand,
  onToggleItem,
  onToggleDepartment,
  onDeleteItem,
  getItemIndexInList
}: ShoppingListDepartmentProps) {
  const deptCompleted = items.every(item => item.checked);
  const deptPartial = items.some(item => item.checked) && !deptCompleted;

  return (
    <div className="border rounded-md overflow-hidden">
      <div 
        className={`px-3 py-2 flex items-center justify-between gap-2 bg-muted/30 cursor-pointer ${
          deptCompleted ? 'bg-muted/40 text-muted-foreground' : ''
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={deptCompleted}
            onCheckedChange={(checked) => {
              onToggleDepartment(department, Boolean(checked));
              event?.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <h3 className="font-medium text-sm">
            {department}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({items.filter(item => item.checked).length}/{items.length})
            </span>
          </h3>
        </div>
        <div>{isExpanded ? '▼' : '▶'}</div>
      </div>
      
      {isExpanded && (
        <div className="divide-y">
          {items.map((item, idx) => {
            const itemIndex = getItemIndexInList(item);
            
            if (itemIndex === -1) return null;
            
            return (
              <div 
                key={`${department}-${idx}`} 
                className="flex items-center gap-2 p-3 hover:bg-muted/20"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => onToggleItem(itemIndex)}
                />
                <div 
                  className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span>
                      {item.quantity} {item.unit} <strong>{item.name}</strong>
                      {item.notes && <span className="text-sm text-muted-foreground ml-1">({item.notes})</span>}
                    </span>
                    {(item.quality_indicators || item.storage_tips) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {item.quality_indicators && (
                              <p className="mb-1">{item.quality_indicators}</p>
                            )}
                            {item.storage_tips && (
                              <p className="text-sm text-muted-foreground">{item.storage_tips}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </span>
                  {item.alternatives?.length > 0 && (
                    <span className="block text-sm text-muted-foreground">
                      Alternatives: {item.alternatives.join(', ')}
                    </span>
                  )}
                  {item.pantry_staple && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
                      Pantry Staple
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteItem(itemIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
