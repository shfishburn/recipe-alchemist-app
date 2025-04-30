
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingItem } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Extract ingredient details if available
  const hasIngredientDetails = item.ingredientData && 
    (item.ingredientData.notes || 
     (typeof item.ingredientData.item === 'object' && item.ingredientData.item.item));

  return (
    <div className="flex items-start gap-2 p-2 bg-muted/40 rounded-md group hover:bg-muted/60 transition-colors">
      <Checkbox 
        id={`item-${index}`}
        checked={item.checked}
        onCheckedChange={() => onToggle(index)}
        className="mt-0.5"
      />
      <label 
        htmlFor={`item-${index}`}
        className={`text-sm flex-1 cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
      >
        <div className="flex items-center gap-1">
          <span>{item.text}</span>
          
          {hasIngredientDetails && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground inline-block cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {item.ingredientData?.notes || 
                     (typeof item.ingredientData?.item === 'object' ? 
                      item.ingredientData.item.item : '')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {item.pantryStaple && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
            Pantry Staple
          </span>
        )}
      </label>
    </div>
  );
}
