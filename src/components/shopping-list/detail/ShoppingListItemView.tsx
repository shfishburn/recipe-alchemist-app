
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShoppingListItem } from '@/types/shopping-list';

interface ShoppingListItemViewProps {
  item: ShoppingListItem;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingListItemView({ item, onToggle, onDelete }: ShoppingListItemViewProps) {
  return (
    <div className={cn(
      "group flex items-center justify-between py-2 px-1 rounded-md transition-colors",
      "hover:bg-accent/50",
      "touch-target" // Custom touch target class for better mobile UX
    )}>
      <div 
        className="flex items-start flex-1 cursor-pointer"
        onClick={(e) => {
          // Prevent toggling if clicking on the delete button
          if ((e.target as HTMLElement).closest('button')) return;
          onToggle();
        }}
      >
        <div className="touch-target flex items-center pr-2">
          <Checkbox 
            checked={item.checked} 
            className="h-4.5 w-4.5 rounded-sm touch-target data-[state=checked]:bg-primary"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            "text-sm font-medium truncate",
            item.checked && "line-through text-muted-foreground"
          )}>
            {item.name}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="truncate">{item.quantity} {item.unit}</span>
            {item.notes && (
              <span className="truncate ml-2 text-xs italic">
                ({item.notes})
              </span>
            )}
          </div>
          
          {item.package_notes && (
            <div className="text-xs text-primary-foreground/70 bg-primary/10 px-1.5 py-0.5 rounded mt-0.5 inline-block">
              {item.package_notes}
            </div>
          )}
        </div>
      </div>
      
      <div className="ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-7 w-7 p-0 rounded-full touch-target"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}
