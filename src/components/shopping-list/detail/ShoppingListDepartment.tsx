
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Info, ChevronDown, ChevronRight, Check, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { ShoppingListItem } from '@/types/shopping-list';
import { getDepartmentIcon, getDepartmentColor } from './department-utils';

interface ShoppingListDepartmentProps {
  department: string;
  items: ShoppingListItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (itemIndex: number) => Promise<void>;
  onToggleDepartment: (department: string, checked: boolean) => Promise<void>;
  onDeleteItem: (index: number) => Promise<void>;
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
  const [loadingItems, setLoadingItems] = useState<Record<number, boolean>>({});
  
  // Get the department icon and color
  const DepartmentIcon = getDepartmentIcon(department);
  const departmentColorClass = getDepartmentColor(department);

  // Handle item toggle with optimistic updates and loading state
  const handleItemToggle = async (itemIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically update UI
    setLoadingItems(prev => ({ ...prev, [itemIndex]: true }));
    
    try {
      await onToggleItem(itemIndex);
    } catch (error) {
      console.error('Error toggling item:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemIndex]: false }));
    }
  };

  // Format quantity with units for display
  const formatQuantityWithUnit = (item: ShoppingListItem): string => {
    // Handle cases where quantity might be missing or invalid
    if (item.quantity === undefined || item.quantity === null) {
      return '';
    }

    // Convert to number if it's a string
    const qty = typeof item.quantity === 'string' 
      ? parseFloat(item.quantity) 
      : item.quantity;
    
    // Check for valid number
    if (isNaN(qty) || qty === 0) {
      return '';
    }
    
    // Format number: whole numbers as integers, decimals with 1 decimal place
    const formattedQty = Number.isInteger(qty) ? qty.toString() : qty.toFixed(1);
    
    // Trim trailing zeros after decimal point
    const trimmedQty = formattedQty.replace(/\.0$/, '');
    
    // Add unit if available
    return item.unit ? `${trimmedQty} ${item.unit}` : trimmedQty;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div 
        className={`px-2 py-2 flex items-center justify-between gap-1 cursor-pointer
          ${departmentColorClass} 
          ${deptCompleted ? 'text-muted-foreground' : ''}`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-1">
          {DepartmentIcon && (
            <DepartmentIcon className="h-4 w-4" />
          )}
          <h3 className="font-medium text-sm">
            {department}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({items.filter(item => item.checked).length}/{items.length})
            </span>
          </h3>
        </div>
        <div>{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</div>
      </div>
      
      {isExpanded && (
        <div className="divide-y">
          {items.map((item, idx) => {
            const itemIndex = getItemIndexInList(item);
            
            if (itemIndex === -1) return null;
            const isLoading = !!loadingItems[itemIndex];
            
            // Format quantity for display
            const quantityText = formatQuantityWithUnit(item);
            
            return (
              <div 
                key={`${department}-${idx}`} 
                className={`flex items-center px-2 py-2 touch-optimized tap-highlight relative
                  ${item.checked 
                    ? 'bg-green-50 hover:bg-green-100' 
                    : 'hover:bg-muted/50'}`}
              >
                <div 
                  className="flex-1 flex items-center gap-1"
                  onClick={(e) => handleItemToggle(itemIndex, e)}
                >
                  <div className="w-5 h-5 flex items-center justify-center touch-target">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : item.checked ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : null}
                  </div>
                  
                  <div className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                    <div className="flex items-center gap-1 flex-wrap">
                      {quantityText && <strong className="mr-1">{quantityText}</strong>}
                      <span className="font-medium">{item.name}</span>
                      
                      {(item.quality_indicators || item.storage_tips) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="inline h-3 w-3 text-muted-foreground ml-1" />
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
                      
                      {item.notes && <span className="text-xs text-muted-foreground ml-1">({item.notes})</span>}
                    </div>
                    
                    {item.alternatives?.length > 0 && (
                      <span className="block text-xs text-muted-foreground">
                        Alt: {item.alternatives.join(', ')}
                      </span>
                    )}
                    
                    {item.pantry_staple && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded inline-block mt-1">
                        Pantry
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto w-auto touch-target opacity-60 hover:opacity-100 focus:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(itemIndex);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
