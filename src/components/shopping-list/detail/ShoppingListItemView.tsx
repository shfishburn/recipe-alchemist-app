
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShoppingListItem } from '@/types/shopping-list';
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
  // Handle click with proper event stopping
  const handleItemClick = (e: React.MouseEvent) => {
    // Prevent toggling if clicking on the delete button
    if ((e.target as HTMLElement).closest('button')) return;
    onToggle();
  };
  
  // Handle delete with proper event stopping
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };
  
  // Format and standardize the notes display
  const formatNotes = () => {
    if (!item.notes) return null;
    
    // Standardize parentheses format
    const notes = item.notes.startsWith('(') ? item.notes : `(${item.notes})`;
    return <span className="text-gray-500 italic truncate">{notes}</span>;
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 transition-colors",
        item.checked 
          ? "bg-green-50" 
          : "hover:bg-gray-50",
        "cursor-pointer"
      )}
      onClick={handleItemClick}
    >
      <div className={cn(
        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
        item.checked ? "bg-green-100" : "bg-gray-100"
      )}>
        {item.checked ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-green-600" />
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className={cn(
          "flex items-baseline flex-wrap gap-x-1",
          item.checked && "line-through text-gray-500"
        )}>
          <span className="font-medium truncate max-w-[200px]">{item.name}</span>
          
          <div className="text-sm text-gray-600 truncate max-w-[200px]">
            {item.quantity && item.unit && (
              <span className="mr-1">{item.quantity} {item.unit}</span>
            )}
            {formatNotes()}
          </div>
          
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
