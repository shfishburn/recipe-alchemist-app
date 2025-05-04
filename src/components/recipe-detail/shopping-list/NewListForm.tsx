
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2.5">
        <Label htmlFor="list-name" className="text-sm font-medium">List Name</Label>
        <Input
          id="list-name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter a name for your shopping list"
          disabled={isLoading}
          required
          className="w-full"
        />
      </div>
      
      <div className="flex items-center space-x-2 rounded-md border p-3 bg-muted/20">
        <Checkbox 
          id="use-package-sizes-override" 
          checked={usePackageSizes}
          onCheckedChange={(checked) => setUsePackageSizes(!!checked)}
          disabled={isLoading}
          className="data-[state=checked]:bg-primary"
        />
        <div className="grid gap-1.5 leading-none">
          <div className="flex items-center gap-2">
            <Label htmlFor="use-package-sizes-override" className="text-sm font-medium cursor-pointer">
              Use standard package sizes
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  Override the global setting just for this list
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground">
            Adjust quantities to match common grocery store packaging
          </p>
        </div>
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
