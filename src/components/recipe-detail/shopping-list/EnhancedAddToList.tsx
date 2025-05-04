
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Settings } from 'lucide-react';
import { AddToShoppingListDialog } from '@/components/recipe-detail/shopping-list/AddToShoppingListDialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';
import type { Recipe } from '@/types/recipe';

interface EnhancedAddToListProps {
  recipe: Recipe;
}

export function EnhancedAddToList({ recipe }: EnhancedAddToListProps) {
  const [open, setOpen] = useState(false);
  const { usePackageSizes } = useShoppingListSettings();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 flex items-center gap-2 hover:bg-primary/10 transition-colors touch-feedback-optimized"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="font-medium">Add to Shopping List</span>
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 rounded-full"
              onClick={() => setOpen(true)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Shopping List Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {usePackageSizes 
                ? "Package optimization enabled" 
                : "Package optimization disabled"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <AddToShoppingListDialog
        recipe={recipe}
        open={open}
        onOpenChange={setOpen}
        data-testid="shopping-list-dialog"
      />
    </div>
  );
}
