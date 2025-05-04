
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShoppingListItem } from '@/types/shopping-list';

interface ShoppingListItemViewProps {
  item: ShoppingListItem;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingListItemView({ item, onToggle, onDelete }: ShoppingListItemViewProps) {
  // Ensure we don't have any conditional hook calls
  // All component logic should be executed in the same order on every render
  
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

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-2 rounded-md transition-colors",
        item.checked 
          ? "bg-green-50 hover:bg-green-100" 
          : "hover:bg-muted/50",
        "touch-feedback-optimized"
      )}
      onClick={handleItemClick}
    >
      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-recipe-blue/10 text-recipe-blue font-medium">
        {item.checked ? (
          <Check className="h-4 w-4" />
        ) : (
          <span>•</span>
        )}
      </div>
      
      <div className="flex-1 pt-0.5 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className={cn(
            "text-base font-medium",
            item.checked && "line-through text-muted-foreground"
          )}>
            {item.name}
          </div>
          
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="text-muted-foreground">{item.quantity} {item.unit}</span>
            {item.notes && (
              <span className="text-muted-foreground italic">
                ({item.notes})
              </span>
            )}
          </div>
          
          {item.package_notes && (
            <div className="text-sm text-primary-foreground/80 bg-primary/10 px-2 py-1 rounded mt-1 inline-block">
              {item.package_notes}
            </div>
          )}
        </div>
        
        {item.checked && (
          <Check className="h-5 w-5 text-green-500 mr-2" />
        )}
      </div>
      
      <div className={cn(
        "ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity",
        "sm:opacity-0 touch-optimized:opacity-100"
      )}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="h-8 w-8 p-0 rounded-full touch-target"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}
