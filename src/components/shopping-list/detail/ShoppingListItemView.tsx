
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShoppingListItem } from '@/types/shopping-list';
import { FormattedItem } from '@/components/common/formatted-item/FormattedItem';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface ShoppingListItemViewProps {
  item: ShoppingListItem;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingListItemView({ item, onToggle, onDelete }: ShoppingListItemViewProps) {
  // Handle delete with proper event stopping
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 transition-colors group",
        "hover:bg-gray-50",
        "cursor-pointer"
      )}
      onClick={onToggle}
    >
      <div className="flex-grow min-w-0">
        <div className="flex items-baseline flex-wrap gap-x-1">
          <FormattedItem 
            item={item}
            options={{
              highlight: 'name',
              strikethrough: item.checked
            }}
            className="max-w-[200px] truncate"
          />
          
          {item.quality_indicators && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-blue-500 ml-1 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{item.quality_indicators}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {item.package_notes && (
          <div className="mt-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded inline-block truncate max-w-full">
            {item.package_notes}
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete}
        className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
