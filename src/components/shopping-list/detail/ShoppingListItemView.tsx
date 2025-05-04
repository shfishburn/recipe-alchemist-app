
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Info } from 'lucide-react';
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
    return notes;
  };

  // Capitalize the first letter of each word in the name
  const capitalizedName = item.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
          <span className={cn(
            "font-medium truncate max-w-[200px]",
            item.checked && "text-gray-400 line-through"
          )}>{capitalizedName}</span>
          
          <div className={cn(
            "text-sm truncate max-w-[200px]",
            item.checked ? "text-gray-400 line-through" : "text-gray-600"
          )}>
            {item.quantity && item.unit && (
              <span className="mr-1">{item.quantity} {item.unit}</span>
            )}
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
        
        {formatNotes() && (
          <div className={cn(
            "mt-1 text-xs bg-gray-50 px-2 py-1 rounded inline-block truncate max-w-full",
            item.checked ? "text-gray-400 line-through" : "text-gray-600"
          )}>
            {formatNotes()}
          </div>
        )}
        
        {item.package_notes && (
          <div className={cn(
            "mt-1 text-xs px-2 py-1 rounded inline-block truncate max-w-full",
            item.checked ? "bg-green-50/50 text-green-600/60" : "bg-green-50 text-green-700"
          )}>
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
