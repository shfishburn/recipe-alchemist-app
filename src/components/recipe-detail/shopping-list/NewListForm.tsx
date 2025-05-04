
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface NewListFormProps {
  recipe: Recipe;
  onSubmit: (name: string) => Promise<void>;
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
  const [name, setName] = useState(`${recipe.title} Ingredients`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2.5">
        <Label htmlFor="list-name" className="text-base">
          List Name
        </Label>
        <Input
          id="list-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 text-base"
          placeholder="Enter list name"
          autoComplete="off"
          required
        />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 border rounded-lg p-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 rounded-md w-12 h-12 flex items-center justify-center text-white">
            <Check className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Use standard package sizes</p>
            <p className="text-muted-foreground text-sm mt-0.5">
              Adjust quantities to match common grocery store packages
            </p>
          </div>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!name.trim() || isLoading}
        className="w-full h-12 text-base mt-4 bg-recipe-blue hover:bg-recipe-blue/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating...
          </>
        ) : (
          'Create List'
        )}
      </Button>
    </form>
  );
}
