
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Recipe } from '@/types/recipe';

interface NewListFormProps {
  recipe: Recipe;
  onSubmit: (name: string) => Promise<any>;
  isLoading: boolean;
  usePackageSizes: boolean;
  setUsePackageSizes: (value: boolean) => void;
}

export function NewListForm({ 
  recipe, 
  onSubmit, 
  isLoading, 
  usePackageSizes, 
  setUsePackageSizes 
}: NewListFormProps) {
  const [newListName, setNewListName] = useState(`${recipe.title} Ingredients`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onSubmit(newListName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="list-name">List Name</Label>
        <Input
          id="list-name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter a name for your new list"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="use-package-sizes" 
          checked={usePackageSizes}
          onCheckedChange={(checked) => setUsePackageSizes(!!checked)}
          disabled={isLoading}
        />
        <Label htmlFor="use-package-sizes" className="text-sm cursor-pointer">
          Use standard package sizes (recommended)
        </Label>
      </div>
      
      <Button 
        type="submit" 
        disabled={!newListName.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create New List'
        )}
      </Button>
    </form>
  );
}
