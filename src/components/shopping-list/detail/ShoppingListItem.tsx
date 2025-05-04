
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShoppingListItem } from '@/types/shopping-list';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ShoppingItemProps {
  item: ShoppingListItem;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingItemComponent({ item, onToggle, onDelete }: ShoppingItemProps) {
  // Format the display text with proper quantity and unit
  const displayText = `${item.quantity} ${item.unit} ${item.name}`.trim();
  const hasPackageInfo = item.package_notes || (item.shop_size_qty && item.shop_size_unit);
  const packageInfo = item.package_notes || 
    (item.shop_size_qty && item.shop_size_unit 
      ? `Standard package: ${item.shop_size_qty} ${item.shop_size_unit}`
      : '');
  
  // Handle delete with proper event stopping
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 py-1 px-1 rounded-md",
        "cursor-pointer hover:bg-muted/50",
        item.checked && "opacity-60"
      )}
      onClick={onToggle}
    >
      <div className="flex-1">
        <div className="flex items-center">
          <span className={cn(
            "flex-1",
            item.checked && "line-through text-muted-foreground"
          )}>
            {displayText}
            {item.notes && (
              <span className={cn(
                "text-sm ml-1",
                item.checked ? "line-through" : "text-muted-foreground"
              )}>
                ({item.notes})
              </span>
            )}
          </span>
          
          {hasPackageInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2 text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs">
                  {packageInfo}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="h-7 w-7 p-0 touch-target"
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
