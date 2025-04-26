
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import CuisineSelect from '../CuisineSelect';
import DietarySelect from '../DietarySelect';
import FlavorTagsInput from '../FlavorTagsInput';

interface InputsTabProps {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  ingredientInput: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuisineChange: (value: string) => void;
  onDietaryChange: (value: string) => void;
  onFlavorTagsChange: (tags: string[]) => void;
  onIngredientChange: (value: string) => void;
  onIngredientKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveIngredient: (index: number) => void;
}

const InputsTab = ({
  title,
  cuisine,
  dietary,
  flavorTags,
  ingredients,
  ingredientInput,
  onTitleChange,
  onCuisineChange,
  onDietaryChange,
  onFlavorTagsChange,
  onIngredientChange,
  onIngredientKeyDown,
  onRemoveIngredient,
}: InputsTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title">Recipe Title (Optional)</Label>
        <Input
          id="title"
          name="title"
          placeholder="Leave blank for AI to suggest a title"
          value={title}
          onChange={onTitleChange}
        />
      </div>

      {/* Cuisine Selector */}
      <CuisineSelect
        value={cuisine}
        onChange={onCuisineChange}
      />

      {/* Dietary Preference */}
      <DietarySelect
        value={dietary}
        onChange={onDietaryChange}
      />

      {/* Flavor Tags */}
      <FlavorTagsInput
        tags={flavorTags}
        onChange={onFlavorTagsChange}
      />

      {/* Ingredients List */}
      <div className="space-y-2">
        <Label htmlFor="ingredients">Main Ingredients</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredients.map((ingredient, index) => (
            <div 
              key={index}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => onRemoveIngredient(index)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Input
          id="ingredients"
          placeholder="Type ingredient and press Enter"
          value={ingredientInput}
          onChange={(e) => onIngredientChange(e.target.value)}
          onKeyDown={onIngredientKeyDown}
        />
        <p className="text-xs text-muted-foreground">Press Enter to add each ingredient</p>
      </div>
    </div>
  );
};

export default InputsTab;
