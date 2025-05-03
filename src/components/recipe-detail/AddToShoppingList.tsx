
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddToShoppingList } from './shopping-list/useAddToShoppingList';
import { AddToListSheet } from './shopping-list/AddToListSheet';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/hooks/use-auth';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const { createListMutation, addToExistingMutation } = useAddToShoppingList(recipe, () => setOpen(false));
  
  const isLoading = createListMutation.isPending || addToExistingMutation.isPending;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>Add to Shopping List</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          asChild
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Link to={`/recipe-shopping-list/${recipe.id}`}>
            <ShoppingBag className="h-4 w-4" />
            <span>View Recipe Shopping List</span>
          </Link>
        </Button>
      </div>

      <AddToListSheet
        open={open}
        onOpenChange={setOpen}
        recipe={recipe}
      />
    </>
  );
}
