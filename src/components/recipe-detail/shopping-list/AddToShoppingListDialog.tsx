
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag } from 'lucide-react';
import { useRecipeToShoppingList } from '@/hooks/use-recipe-to-shopping-list';
import { ExistingListSelector } from './ExistingListSelector';
import { NewListForm } from './NewListForm';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
}

export function AddToShoppingListDialog({
  open,
  onOpenChange,
  recipe,
}: AddToShoppingListDialogProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  
  const {
    addRecipeToNewList,
    addRecipeToExistingList,
    usePackageSizes,
    setUsePackageSizes,
    isLoading
  } = useRecipeToShoppingList();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Add to Shopping List
          </DialogTitle>
          <DialogDescription>
            Add this recipe to a new or existing shopping list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Toggle between new and existing list */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'new' ? 'default' : 'outline'}
              onClick={() => setMode('new')}
              className="flex-1"
            >
              Create New List
            </Button>
            <Button
              variant={mode === 'existing' ? 'default' : 'outline'}
              onClick={() => setMode('existing')}
              className="flex-1"
            >
              Add to Existing
            </Button>
          </div>

          <Separator />

          {/* Settings that apply to both modes */}
          <ShoppingListSettings
            usePackageSizes={usePackageSizes}
            setUsePackageSizes={setUsePackageSizes}
          />

          {/* Mode-specific forms */}
          {mode === 'new' ? (
            <NewListForm 
              recipe={recipe} 
              onSubmit={addRecipeToNewList} 
              isLoading={isLoading} 
            />
          ) : (
            <ExistingListSelector 
              recipe={recipe} 
              onSelect={addRecipeToExistingList}
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
