
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingBag } from 'lucide-react';
import { AddToShoppingListDialog } from './shopping-list/AddToShoppingListDialog';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 w-full"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Add to Shopping List</span>
      </Button>
      
      <AddToShoppingListDialog
        recipe={recipe}
        open={open}
        onOpenChange={setOpen}
        data-testid="shopping-list-dialog"
      />
    </>
  );
}
