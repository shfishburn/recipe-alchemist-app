
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Globe, Leaf, Plus } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="title" className="text-base">Recipe Title</Label>
          <span className="text-xs text-muted-foreground">(Optional)</span>
        </div>
        <Input
          id="title"
          name="title"
          placeholder="Enter desired dish or leave blank for AI to suggest"
          value={title}
          onChange={onTitleChange}
        />
        <p className="text-xs text-muted-foreground">Example: "Spicy Chicken Pasta" or "Vegetable Curry"</p>
      </div>

      {/* Basics Section */}
      <div className="py-4 space-y-6">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Basics</h3>
        
        {/* Cuisine Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-recipe-blue" />
            <Label htmlFor="cuisine" className="text-base font-medium text-recipe-blue">Cuisine Type</Label>
            <span className="text-xs bg-recipe-blue/10 text-recipe-blue px-2 py-0.5 rounded-full">Required</span>
          </div>
          <CuisineSelect
            value={cuisine}
            onChange={onCuisineChange}
          />
          <p className="text-xs text-muted-foreground">Sets the cultural style and flavors of your recipe</p>
        </div>

        {/* Dietary Preference */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <Label htmlFor="dietary" className="text-base">Dietary Preference</Label>
          </div>
          <DietarySelect
            value={dietary}
            onChange={onDietaryChange}
          />
          <p className="text-xs text-muted-foreground">AI will adapt the recipe to accommodate your dietary needs</p>
        </div>
      </div>

      {/* Flavor Section */}
      <div className="py-4 space-y-6 border-t border-gray-100 dark:border-gray-800">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Flavor Profile</h3>
        
        {/* Flavor Tags */}
        <FlavorTagsInput
          tags={flavorTags}
          onChange={onFlavorTagsChange}
        />
      </div>

      {/* Ingredients Section */}
      <div className="py-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Ingredients</h3>
        
        {/* Ingredients List */}
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
    </div>
  );
};

export default InputsTab;
