
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface NewListFormProps {
  recipe: Recipe;
  onSubmit: (name: string, recipe: Recipe) => Promise<any>;
  isLoading: boolean;
}

export function NewListForm({ recipe, onSubmit, isLoading }: NewListFormProps) {
  const [listName, setListName] = useState(`${recipe.title} Shopping List`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim()) {
      await onSubmit(listName.trim(), recipe);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="list-name" className="text-sm font-medium">
          List Name
        </label>
        <Input
          id="list-name"
          placeholder="Enter shopping list name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          autoComplete="off"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!listName.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Shopping List'
        )}
      </Button>
    </form>
  );
}
