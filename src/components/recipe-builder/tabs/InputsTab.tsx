
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Globe, Leaf, Plus, BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const commonRecipes = ["Pasta Dish", "Chicken Recipe", "Soup", "Salad"];

  return (
    <div className="space-y-6">
      {/* Recipe Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-recipe-blue" />
          <Label 
            htmlFor="title" 
            className="text-lg font-medium"
          >
            Recipe
          </Label>
          <span className="text-xs text-muted-foreground bg-accent/30 px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Input
                  id="title"
                  name="title"
                  className="h-12 pl-10 bg-background/50 border-2 focus:border-recipe-blue transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                  placeholder="What would you like to cook? (e.g., 'Pasta', 'Chicken dish')"
                  value={title}
                  onChange={onTitleChange}
                  aria-label="Recipe name input"
                />
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter your desired dish or let AI suggest a recipe name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Let AI suggest a recipe or enter your own idea
          </p>
          <div className="flex flex-wrap gap-2">
            {commonRecipes.map((recipe) => (
              <button
                key={recipe}
                type="button"
                onClick={() => onTitleChange({ target: { value: recipe } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-sm px-3 py-1 rounded-full bg-accent/50 hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
              >
                {recipe}
              </button>
            ))}
          </div>
        </div>
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
