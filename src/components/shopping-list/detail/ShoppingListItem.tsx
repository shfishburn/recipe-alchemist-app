
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Info } from 'lucide-react';
import type { ShoppingListItem } from '@/types/shopping-list';
import { FormattedItem } from '@/components/common/formatted-item/FormattedItem';
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
  const hasPackageInfo = item.package_notes || (item.shop_size_qty && item.shop_size_unit);
  const packageInfo = item.package_notes || 
    (item.shop_size_qty && item.shop_size_unit 
      ? `Standard package: ${item.shop_size_qty} ${item.shop_size_unit}`
      : '');
  
  return (
    <div className={`flex items-center gap-2 py-1 px-1 rounded-md ${item.checked ? 'opacity-60' : ''}`}>
      <Checkbox 
        checked={item.checked}
        onCheckedChange={() => onToggle()}
        className="h-5 w-5 touch-target"
      />
      
      <div className="flex-1">
        <div className="flex items-center">
          <FormattedItem
            item={item}
            options={{
              highlight: 'name',
              strikethrough: item.checked
            }}
            className="flex-1"
          />
          
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
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
