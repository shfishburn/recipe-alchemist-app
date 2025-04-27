
import React from 'react';
import RecipeNameInput from '../form/RecipeNameInput';
import RecipeBasics from '../form/RecipeBasics';
import IngredientsSection from '../form/IngredientsSection';
import FlavorTagsInput from '../FlavorTagsInput';

interface InputsTabProps {
  title: string;
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  ingredients: string[];
  ingredientInput: string;
  servings: number;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuisineChange: (value: string) => void;
  onDietaryChange: (value: string) => void;
  onFlavorTagsChange: (tags: string[]) => void;
  onIngredientChange: (value: string) => void;
  onIngredientKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveIngredient: (index: number) => void;
  onServingsChange: (value: number) => void;
}

const InputsTab = ({
  title,
  cuisine,
  dietary,
  flavorTags,
  ingredients,
  ingredientInput,
  servings,
  onTitleChange,
  onCuisineChange,
  onDietaryChange,
  onFlavorTagsChange,
  onIngredientChange,
  onIngredientKeyDown,
  onRemoveIngredient,
  onServingsChange,
}: InputsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Recipe Input */}
      <RecipeNameInput
        title={title}
        onTitleChange={onTitleChange}
      />

      {/* Basics Section */}
      <RecipeBasics
        cuisine={cuisine}
        dietary={dietary}
        servings={servings}
        onCuisineChange={onCuisineChange}
        onDietaryChange={onDietaryChange}
        onServingsChange={onServingsChange}
      />

      {/* Flavor Section */}
      <div className="py-4 space-y-6 border-t border-gray-100 dark:border-gray-800">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Flavor Profile</h3>
        <FlavorTagsInput
          tags={flavorTags}
          onChange={onFlavorTagsChange}
        />
      </div>

      {/* Ingredients Section */}
      <IngredientsSection
        ingredients={ingredients}
        ingredientInput={ingredientInput}
        onIngredientChange={onIngredientChange}
        onIngredientKeyDown={onIngredientKeyDown}
        onRemoveIngredient={onRemoveIngredient}
      />
    </div>
  );
};

export default InputsTab;
