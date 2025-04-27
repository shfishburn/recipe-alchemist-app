
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface IngredientsSectionProps {
  ingredients: string[];
  ingredientInput: string;
  onIngredientChange: (value: string) => void;
  onIngredientKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveIngredient: (index: number) => void;
}

const IngredientsSection = ({
  ingredients,
  ingredientInput,
  onIngredientChange,
  onIngredientKeyDown,
  onRemoveIngredient,
}: IngredientsSectionProps) => {
  return (
    <div className="py-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Ingredients</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-amber-600" />
          <Label htmlFor="ingredients" className="text-base">Main Ingredients</Label>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredients.map((ingredient, index) => (
            <div 
              key={index}
              className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => onRemoveIngredient(index)}
                className="ml-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-800/50 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Input
          id="ingredients"
          placeholder="Type ingredient and press Enter (e.g., chicken, tomatoes)"
          value={ingredientInput}
          onChange={(e) => onIngredientChange(e.target.value)}
          onKeyDown={onIngredientKeyDown}
          className="border-amber-200 focus-visible:ring-amber-300"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Press Enter to add each ingredient</p>
          <p className="text-xs text-amber-600">{ingredients.length} added</p>
        </div>
      </div>
    </div>
  );
};

export default IngredientsSection;
